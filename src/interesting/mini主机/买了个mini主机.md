# 买了个mini主机当服务器

虽然有苹果的电脑，但是在安装一些软件的时候，总想着能不能有一个小型的服务器，免得各种设置导致 Mac 出现异常。整体上看了一些小型主机，也看过苹果的 Mac mini，但是发现它太贵了，大概要 3000 多，特别是如果要更高配置的话，价格会更高，甚至更贵。所以，我就考虑一些别的小型主机。也看了一些像 NUC 这些服务器，但是觉得还是太贵了。于是我自己去淘宝搜索，找到了这一款 N100 版的主机。

成本的话，由于有折扣，所以大概是 410 左右，然后自己加了个看上去不错的内存条花了 300 左右。硬盘的话我自己之前就有，所以总成本大概是 700 左右。大小的话，大概是一台手机横着和竖着的正方形大小，还带 Wi-Fi，虽然不太稳定。

![iowejofwjeofjwoeifjwoe](https://github-images.wenzhihuai.com/images/iowejofwjeofjwoeifjwoe.png)

## 一、系统的安装

系统我看是支持windows，还有现在Ubuntu，但是我这种选择的是centos stream 9， 10的话我也找过，但是发现很多软件还有不兼容。所以最终还是centos stream 9。

1、下载Ventoy软件

去Ventoy官网下载Ventoy软件（Download . Ventoy）如下图界面

![QQ_1727625608185](https://github-images.wenzhihuai.com/images/QQ_1727625608185.png)

2、制作启动盘

选择合适的版本以及平台下载好之后，进行解压，解压出来之后进入文件夹，如下图左边所示，双击打开Ventoy2Disk.exe，会出现下图右边的界面，选择好自己需要制作启动盘的U盘，然后点击安装等待安装成功即可顺利制作成功启动U盘。

3、centos安装

直接取[官网](https://www.centos.org/download/)，下载完放到u盘即可。



![QQ_1727625711792](https://github-images.wenzhihuai.com/images/QQ_1727625711792.png)





它的BIOS是按F7启动，直接加载即可。

![image-20241007222938414](https://github-images.wenzhihuai.com/images/image-20241007222938414.png)

之后就是正常的centos安装流程了。





## 二、连接wifi

因为是用作服务器的，所以并没有给它配置个专门的显示器，只要换个网络，就连不上新的wifi了，这里可以用网线连接路由器进行下面的操作即可。

在 CentOS 系统中，通过命令行连接 Wi-Fi 通常需要使用 nmcli（NetworkManager 命令行工具）来管理网络连接。nmcli 是 NetworkManager 的一个命令行接口，可以用于创建、修改、激活和停用网络连接。以下是如何使用 nmcli 命令行工具连接 Wi-Fi 的详细步骤。

### 步骤 1: 检查网络接口

首先，确认你的 Wi-Fi 网络接口是否被检测到，并且 NetworkManager 是否正在运行。

```shell
nmcli device status
```

输出示例：

```text
DEVICE         TYPE      STATE         CONNECTION
wlp3s0         wifi      disconnected  --
enp0s25        ethernet  connected     Wired connection 1
lo             loopback  unmanaged     --
```

在这个示例中，wlp3s0 是 Wi-Fi 接口，它当前处于未连接状态。

### 步骤 2: 启用 Wi-Fi 网卡

如果你的 Wi-Fi 网卡是禁用状态，可以通过以下命令启用：

```shell
nmcli radio wifi on
```

验证 Wi-Fi 是否已启用：

```shell
nmcli radio
```

### 步骤 3: 扫描可用的 Wi-Fi 网络

使用 nmcli 扫描附近的 Wi-Fi 网络：

```shell
nmcli device wifi list
```

你将看到可用的 Wi-Fi 网络列表，每个网络都会显示 SSID（网络名称）、安全类型等信息。

### 步骤 4: 连接到 Wi-Fi 网络

使用 nmcli 命令连接到指定的 Wi-Fi 网络。例如，如果你的 Wi-Fi 网络名称（SSID）是 MyWiFiNetwork，并且密码是 password123，你可以使用以下命令连接：

```shell
nmcli device wifi connect 'xxxxxx' password 'xxxxx'
```

你应该会看到类似于以下输出，表明连接成功：

```text
Device 'wlp3s0' successfully activated with 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.
```

### 步骤 5: 验证连接状态

验证网络连接状态：

```shell
nmcli connection show
```

查看当前连接的详细信息：

```shell
nmcli device show wlp3s0
```

上面的其实在2024年其实有点问题，因为会默认连接2.4GHz的wifi，使用的时候很明显没有那么快，特别是在用命令行的时候会觉得明显卡顿，现在需要切换到5GHz的wifi。
首先，使用 nmcli 获取可用 WiFi 网络及其 BSSID：  
```shell
nmcli -f SSID,BSSID,CHAN dev wifi list
```
示例输出：

```text
SSID       BSSID              CHAN
MyNetwork  XX:XX:XX:XX:XX:01  36
MyNetwork  XX:XX:XX:XX:XX:02  1
```

在这里, XX:XX:XX:XX:XX:01 是 5GHz 网络的 BSSID。

使用 nmcli 连接到特定的 BSSID
```shell
nmcli dev wifi connect 'XX:XX:XX:XX:XX:01' password 'your_password'
```



## 三、VNC远程连接

桌面还是偶尔需要用一下的，虽然用的不多。

```text
root@master:~# dnf install  -y  tigervnc-server
root@master:~# vncserver
bash: vncserver: command not found...
Install package 'tigervnc-server' to provide command 'vncserver'? [N/y] y


 * Waiting in queue... 
 * Loading list of packages.... 
The following packages have to be installed:
 dbus-x11-1:1.12.20-8.el9.x86_64        X11-requiring add-ons for D-BUS
 tigervnc-license-1.14.0-3.el9.noarch   License of TigerVNC suite
 tigervnc-selinux-1.14.0-3.el9.noarch   SELinux module for TigerVNC
 tigervnc-server-1.14.0-3.el9.x86_64    A TigerVNC server
 tigervnc-server-minimal-1.14.0-3.el9.x86_64    A minimal installation of TigerVNC server
Proceed with changes? [N/y] y


 * Waiting in queue... 
 * Waiting for authentication... 
 * Waiting in queue... 
 * Downloading packages... 
 * Requesting data... 
 * Testing changes... 
 * Installing packages... 

WARNING: vncserver has been replaced by a systemd unit and is now considered deprecated and removed in upstream.
Please read /usr/share/doc/tigervnc/HOWTO.md for more information.

You will require a password to access your desktops.

getpassword error: Inappropriate ioctl for device
Password:
```

之后在mac开启屏幕共享就可以了

![image-20241007225855305](https://github-images.wenzhihuai.com/images/image-20241007225855305.png)

![QQ_1728313164289](https://github-images.wenzhihuai.com/images/QQ_1728313164289.png)





## 四、docker 配置

docker安装我以为很简单，没想到这里是最难的一步了。安装完docker之后，总是报错：

```shell
Error response from daemon: Get "https://registry-1.docker.io/v2/": context deadline exceeded
```

即使改了mirrors也毫无作用

```json
{
  "registry-mirrors": [
    "https://ylce84v9.mirror.aliyuncs.com"
        ]
}
```

看起来好像是docker每次pull镜像都要访问一次registry-1.docker.io，但是这个网址国内已经无法连接了，各种折腾，这里只贴一下代码吧，原理就就不讲了（懂得都懂）。

![img](https://github-images.wenzhihuai.com/images/5493f11fb4fe4de1bba971a744bf4f4a_1074242703.png)

```shell
sslocal -c /etc/shadowsocks.json -d start
curl --socks5 127.0.0.1:1080 http://httpbin.org/ip

sudo yum -y install privoxy
```



`vim /etc/systemd/system/docker.service.d/http-proxy.conf`

```text
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:8118"
```

 `/etc/systemd/system/docker.service.d/https-proxy.conf`

```text
[Service]
Environment="HTTPS_PROXY=http://127.0.0.1:8118"
```



最后重启docker

```shell
systemctl start privoxy
systemctl enable privoxy
sudo systemctl daemon-reload
sudo systemctl restart docker
```

![QQ_1729956484197](https://github-images.wenzhihuai.com/images/QQ_1729956484197.png)

## 五、文件共享

sd卡好像读取不了，只能换个usb转换器

```shell
fdisk -l
mount /dev/sdb1 /mnt/usb/sd
```

在CentOS中设置文件共享，可以使用Samba服务。以下是配置Samba以共享文件的基本步骤：

1. 安装Samba

```bash
sudo yum install samba samba-client samba-common
```

1. 设置共享目录

   编辑Samba配置文件`/etc/samba/smb.conf`，在文件末尾添加以下内容：

```ini
[shared]
   path = /path/to/shared/directory
   writable = yes
   browseable = yes
   guest ok = yes
```

1. 设置Samba密码

   为了允许访问，需要为用户设置一个Samba密码：

```bash
sudo smbpasswd -a your_username
```

1. 重启Samba服务

```bash
sudo systemctl restart smb.service
sudo systemctl restart nmb.service
```

1. 配置防火墙（如果已启用）

   允许Samba通过防火墙：

```bash
sudo firewall-cmd --permanent --zone=public --add-service=samba
sudo firewall-cmd --reload
```

现在，您应该能够从网络上的其他计算机通过SMB/CIFS访问共享。在Windows中，你可以使用`\\centos-ip\shared`，在Linux中，你可以使用`smbclient //centos-ip/shared -U your_username`

![QQ_1730035390803](https://github-images.wenzhihuai.com/images/QQ_1730035390803.png)







参考：

https://shadowsockshelp.github.io/Shadowsocks/linux.html

https://stackoverflow.com/questions/48056365/error-get-https-registry-1-docker-io-v2-net-http-request-canceled-while-b