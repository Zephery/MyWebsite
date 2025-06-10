# 商品推荐系统-FAISS召回
## 1. 背景与挑战

在互联网电商、内容平台等实际业务中，商品库动辄百万量级，如何为每位用户从海量商品中迅速召回个性化、高相关的候选商品，是推荐系统最基础也最关键的一环。 如果只依赖商品的原始属性（如标题、描述）匹配，不仅难以刻画深层语义，还会因为暴力检索计算巨大，难以支撑在线业务实时性需求。

**向量化（Embedding）特征+高效大规模近邻搜索**，成为业界主流技术路径。FAISS（Facebook AI Similarity Search）就是这样一款解决大规模向量检索难题的利器。然而，FAISS 只“用”向量不“生产”向量，如何从表结构中高效提取、存储和利用embedding，直接关系到系统效果和可扩展性。

---

## 2. 表结构与需求场景

考虑如下典型商品表（如在SQLite中）：

```sql
create table amazon_products
(
    asin              TEXT,    -- 商品唯一标识
    title             TEXT,    -- 商品标题
    imgUrl            TEXT,    -- 图片链接
    productURL        TEXT,    -- 商品详情页URL
    stars             REAL,    -- 平均评分
    reviews           INTEGER, -- 评论数量
    price             REAL,    -- 售价
    listPrice         REAL,    -- 原价
    category_id       INTEGER, -- 分类ID
    isBestSeller      INTEGER, -- 是否Bestseller
    boughtInLastMonth INTEGER  -- 上月销量
);

```

我们希望利用如 `title` 这样的文本特征，对百万商品转为向量，并实现“基于内容的高效召回”。

---

## 3. 第一环节：商品Embedding批量提取与存储

### 3.1 原因和意义

只有将文本型商品属性转化为稠密embedding（向量），才可以用数学距离度量内容相关性，支撑 FAISS 这样的相似度召回引擎。

### 3.2 推荐方案

- 建议用 [sentence-transformers](https://www.sbert.net/)，支持中英文，速度效能良好。
- 如需多模态（如商品图片），可追加用 CLIP/BLIP-2 提取图片向量后与文本拼接或融合。

### 3.3 代码实战：批量文本Embedding


```python
import sqlite3
from sentence_transformers import SentenceTransformer
import numpy as np

# 1. 加载模型（建议 MiniLM，快且效果很好）
model = SentenceTransformer('all-MiniLM-L6-v2')

# 2. 提取数据库中的 asin 和 title
conn = sqlite3.connect('recommend.db')
cur = conn.execute("SELECT asin, title FROM amazon_products")
asins, titles = [], []
for row in cur:
    asins.append(row[0])
    titles.append(row[1])
conn.close()

# 3. 批量生成embedding（按需分批，防止内存溢出）
BATCH = 1000
embeddings = []
for i in range(0, len(titles), BATCH):
    batch_titles = titles[i:i+BATCH]
    batch_emb = model.encode(
        batch_titles,
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True    # 归一化便于后续用内积检索
    )
    embeddings.append(batch_emb)
all_embeddings = np.vstack(embeddings)  # shape = (商品数, emb_dim)

# 4. 持久化embedding和asin
np.save('product_emb.npy', all_embeddings)
with open('asin_list.txt', 'w') as f:
    for asin in asins:
        f.write(f"{asin}\n")

```

### 3.4 结果检查

- `product_emb.npy`: N×dN×d 的 float32 矩阵，每一行是一个商品的 embedding
- `asin_list.txt`: 每行一个商品 asin，与向量顺序匹配

---

## 4. 第二环节：构建与优化FAISS召回系统

### 4.1 为什么选FAISS？

- 面对百/千万量级商品，全表暴力计算相似度不可用
- FAISS 能高效支持百万级向量毫秒级召回，可用 IndexFlatIP、IVFFlat、HNSW 等多种索引自由切换

### 4.2 索引构建与持久化

**高性能工程策略**：

- 索引训练和add建议只做一次，持久化磁盘，后续服务直接热加载
- 支持多核并发（推荐设置 omp_set_num_threads）
- 百万级数据建议用 IVFFlat+归一化，千万量级也支持

**代码示例**：


```python
import numpy as np
import faiss

all_embeddings = np.load('product_emb.npy').astype('float32')
faiss.omp_set_num_threads(8)      # CPU数按实际调整

def build_or_load_index(embeddings, dim, index_path='faiss.index'):
    try:
        index = faiss.read_index(index_path)
        print("Loaded FAISS index from disk.")
    except Exception:
        quantizer = faiss.IndexFlatIP(dim)
        nlist = 4096
        index = faiss.IndexIVFFlat(quantizer, dim, nlist)
        faiss.normalize_L2(embeddings)
        index.train(embeddings)
        index.add(embeddings)
        faiss.write_index(index, index_path)
        print("Trained and saved FAISS index.")
    return index

index = build_or_load_index(all_embeddings, all_embeddings.shape[1])

```

---

### 4.3 用户行为输入与召回

假设你能获取每个用户最近点击商品 asin：


```python
import sqlite3

def get_user_recent_click_asins(user_id, limit=10):
    conn = sqlite3.connect('recommend.db')
    cur = conn.execute('SELECT asin FROM user_clicks WHERE user_id=? ORDER BY click_time DESC LIMIT ?', (user_id, limit))
    click_asins = [row[0] for row in cur]
    conn.close()
    return click_asins

```

### 4.4 FAISS相似商品召回主流程

对每个用户历史点击asin，检索Top-K相似商品，再去重合并：


```python
def faiss_ann_recall(user_click_asins, topn=200):
    # asin与embedding行号的映射
    asin2idx = {asin: i for i, asin in enumerate(all_asins)}
    recalled = set()
    result_scores = dict()
    for asin in user_click_asins:
        idx = asin2idx.get(asin)
        if idx is None:
            continue
        emb = all_embeddings[idx].reshape(1, -1)
        D, I = index.search(emb, topn+1)
        for i, sim in zip(I[0], D[0]):
            recall_asin = all_asins[i]
            if i == -1 or recall_asin in user_click_asins or recall_asin in recalled:
                continue
            result_scores[recall_asin] = float(sim)
            recalled.add(recall_asin)
    return [a for a, s in sorted(result_scores.items(), key=lambda x: -x[1])]

```

### 4.5 多路召回融合与商品信息返回

与协同过滤等频道召回结果简单融合，并查回完整商品信息：


```python
def recall(user_id, top_n=500, hybrid=True):
    user_click_asins = get_user_recent_click_asins(user_id)
    recall_faiss = faiss_ann_recall(user_click_asins, top_n*2)
    recall_cf = []   # 你可以补充协同召回
    recall_union, seen = [], set(user_click_asins)
    for asin in recall_cf + recall_faiss:
        if asin not in seen:
            recall_union.append(asin)
            seen.add(asin)
        if len(recall_union) >= top_n:
            break
    # enrich every asin
    if recall_union:
        conn = sqlite3.connect('recommend.db')
        format_sql = ','.join(['?']*len(recall_union))
        query = f"SELECT * FROM amazon_products WHERE asin IN ({format_sql})"
        rows = conn.execute(query, tuple(recall_union)).fetchall()
        product_list = [dict(zip([col[0] for col in conn.execute("PRAGMA table_info(amazon_products)")], row)) for row in rows]
        conn.close()
        return product_list
    return []

```

---

## 5. 百万级大数据下的表现与实践建议

- **适用性**：FAISS专为这种百万、千万级内容召回设计，单机64G内存可支持极大库，工程成熟。
- **工程优化**：
    - embedding、索引建议都归一化和持久化
    - 多线程、批量搜索提升QPS
    - 大表可用倒排表（IVFFlat）、HNSW等近似加速型索引。
- **微服务实践**：索引文件和embedding持久化后随时API/服务热加载
- **横向扩展**：商品百万量级甚至上亿均可根据资源平滑扩容

---

## 6. 总结

本文详细介绍了如何从零开始，批量提取并存储商品embedding、基于内容特征构建FAISS索引、高效实现百万级商品的个性化召回流程以及工程落地优化建议。 **核心经验**：内容型推荐的向量建模与高效检索要“两条腿走路”，embedding和FAISS索引标准解耦、分批处理，并进行合理持久化与参数调优，才能满足大规模、实时推荐业务的需求。

> FAISS已经成为现代推荐与搜索系统的主流底层方案，在你的实际业务中大可放心应用，并可通过本文流程快速上线工程原型。

---
### 参考
1.https://blog.csdn.net/m0_73983707/article/details/148055430