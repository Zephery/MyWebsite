# Tesla api

## 一、特斯拉应用申请

### 1.1 创建 Tesla 账户

如果您还没有 Tesla 账户，请创建账户。验证您的电子邮件并设置多重身份验证。

正常创建用户就好，然后需要开启多重身份认证，这边常用的是mircrosoft的Authenticator.

<img src="https://github-images.wenzhihuai.com/images/3hnb7w.png" alt="image-20231210142130054" style="zoom:5%;" />



<img src="https://github-images.wenzhihuai.com/images/zdto5j.png" alt="image-20231210142415598" style="zoom:25%;" />

注意点：（1）不要用自己车辆的邮箱来注册（2）有些邮箱不是特斯拉开发者的邮箱，可能用这些有些无法正常提交访问请求。

### 1.2 提交访问请求

点击下方的“提交请求”按钮，请求应用程序访问权限。登录后，请提供您的合法企业详细信息、应用程序名称及描述和使用目的。在您提交了详细信息之后，我们会审核您的请求并通过电子邮件向您发送状态更新。

这一步很坑，多次尝试之后都无果，原因也不知道是为啥，只能自己去看返回报文琢磨，太难受了，下面是自己踩的坑

（1）Invalid domain

<img src="https://github-images.wenzhihuai.com/images/mfthul.png" alt="image-20231210144504486" style="zoom:33%;" />

无效的域名，这里我用的域名是腾讯云个人服务器的域名，证书是腾讯云免费一年的证书，印象中第一申请的时候还是能过的，第二次的时候就不行了，可能被识别到免费的ssl证书不符合规范，还是需要由合法机构的颁发证书才行。所以，为了金快速申请通过，先填个https://baidu.com吧。当然，后续需要彻底解决自己域名证书的问题，我改为使用阿里云的ssl证书，3个月到期的那种。

（2）Unable to Onboard

<img src="https://github-images.wenzhihuai.com/images/y6s6ea.png" alt="image-20231210142930976" style="zoom:50%;" />

应用无法上架，可能原因为邮箱不对，用了之前消费者账号（即自己的车辆账号），建议换别的邮箱试试。

（3） Rejected

<img src="https://github-images.wenzhihuai.com/images/5fxmcv.png" alt="image-20231210143156308" style="zoom:50%;" />

这一步尝试了很多次，具体原因为国内还无法正常使用tesla api，只能切换至美国服务器申请下（截止2023-11-15），后续留意官网通知。

### 1.3 访问应用程序凭据

一旦获得批准，将为您的应用程序生成可在登录后访问的客户端 ID 和客户端密钥。使用这些凭据，通过 OAuth 2.0 身份验证获取用户访问令牌。访问令牌可用于对提供私人用户账户信息或代表其他账户执行操作的请求进行身份验证。

申请好就可以在自己的账号下看到自己的应用了，

<img src="https://github-images.wenzhihuai.com/images/kpdjbc.png" alt="image-20231210144244888" style="zoom:33%;" />

### 1.4 开始 API 集成

按照 API 文档和设置说明将您的应用程序与 Tesla 车队 API 集成。您需要生成并注册公钥，请求用户授权并按照规格要求拨打电话。完成后您将能够与 API 进行交互，并开始围绕 Tesla 设备构建集成。



# 二、开发之前的准备

**由于特斯拉刚推出，并且国内进展缓慢，很多都申请不下来，下面内容均以北美区域进行调用。**

### 2.1 认识token

app与特斯拉交互的共有两个令牌（token）方式，在调用api的时候，特别需要注意使用的是哪种token，下面是两种token的说明：

（1）合作伙伴身份验证令牌：这个就是你申请的app的令牌

（2）客户生成第三方令牌：这个是消费者在你这个app下授权之后的令牌。

此外，还需要注意下，中国大陆地区对应的api地址是 [https://fleet-api.prd.cn.vn.cloud.tesla.cn](https://fleet-api.prd.cn.vn.cloud.tesla.cn/)，不要调到别的地址去了。

### 2.2 获取第三方应用token

这一步官网列的很详细，就不在详述了。

```shell
CLIENT_ID=<command to obtain a client_id>
CLIENT_SECRET=<secure command to obtain a client_secret>
AUDIENCE="https://fleet-api.prd.na.vn.cloud.tesla.com"
# Partner authentication token request
curl --request POST \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=client_credentials' \
  --data-urlencode "client_id=$CLIENT_ID" \
  --data-urlencode "client_secret=$CLIENT_SECRET" \
  --data-urlencode 'scope=openid vehicle_device_data vehicle_cmds vehicle_charging_cmds' \
  --data-urlencode "audience=$AUDIENCE" \
  'https://auth.tesla.com/oauth2/v3/token'

```



### 2.3  验证域名归属

#### 2.1.1 Register

完成注册合作方账号之后才可以访问API. 每个developer.tesla.cn上的应用程序都必须完成此步骤。官网挂了一个github的代码，看了半天，以为要搞很多东西，实际上只需要几步就可以了。

```shell
cd vehicle-command/cmd/tesla-keygen
go build .
./tesla-keygen -f -keyring-debug -key-file=private create > public_key.pem
```

这里只是生成了公钥，需要把公钥挂载到域名之下，我们用的是nginx，所以只要指向pem文件就可以了，注意下nginx是否可以访问到改文件，如果不行，把nginx的user改为root。

        location ~ ^/.well-known {
               default_type text/html;
               alias /root/vehicle-command/cmd/tesla-keygen/public_key.pem;
        }

随后，便是向tesla注册你的域名，域名必须和你申请的时候填的一样。

```shell
curl --header 'Content-Type: application/json' \
  --header "Authorization: Bearer $TESLA_API_TOKEN" \
  --data '{"domain":"string"}' \
  'https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/partner_accounts' 

```

#### 2.1.2 public_key

最后，验证一下是否真的注册成功（GET /api/1/partner_accounts/public_key)

```
curl --header 'Content-Type: application/json' \
  --header "Authorization: Bearer $TESLA_API_TOKEN" \
  'https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/partner_accounts/public_key' 
```

得到下面内容就代表成功了

```json
{"response":{"public_key":"xxxx"}}
```

至此，我们的开发准备就完成了，接下来就是正常的开发与用户交互的api。