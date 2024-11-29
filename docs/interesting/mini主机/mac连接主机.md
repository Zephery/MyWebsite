

# mac通过网线连接主机(fnOS)

## 一、mac端

mac是typec的，用了个转接头+网线直连主机，初始化的时候跟下面一致，默认都是自动的

![](https://github-images.wenzhihuai.com/images/QQ_1732811324411.png)

点击详细信息，配置IPv4选择使用DHCP

![](https://github-images.wenzhihuai.com/images/b1efd8cf4b16b9b7ffe0e11500258a91.png)

## 二、主机端

主机端是最麻烦的，刚开始的时候怎么也找不到网卡，ifconfg敲了很多遍，最后发现是fnOS没有装驱动。。。

```text
root@server:~# sudo lshw -C network
  *-network
       description: Wireless interface
       product: Wi-Fi 6 AX210/AX211/AX411 160MHz
       vendor: Intel Corporation
       physical id: 0
       bus info: pci@0000:01:00.0
       logical name: wlp1s0
       version: 1a
       serial: 10:5f:ad:d6:2b:ee
       width: 64 bits
       clock: 33MHz
       capabilities: pm msi pciexpress msix bus_master cap_list ethernet physical wireless
       configuration: broadcast=yes driver=iwlwifi driverversion=6.6.38-trim firmware=72.daa05125.0 ty-a0-gf-a0-72.uc ip=192.168.0.113 latency=0 link=yes multicast=yes wireless=IEEE 802.11
       resources: irq:18 memory:80900000-80903fff
  *-network UNCLAIMED
       description: Ethernet controller
       product: RTL8111/8168/8411 PCI Express Gigabit Ethernet Controller
       vendor: Realtek Semiconductor Co., Ltd.
       physical id: 0
       bus info: pci@0000:02:00.0
       version: 2b
       width: 64 bits
       clock: 33MHz
       capabilities: pm msi pciexpress msix cap_list
       configuration: latency=0
       resources: ioport:3000(size=256) memory:80804000-80804fff memory:80800000-80803fff
```

`*-network UNCLAIMED` 表明你的网络接口未被驱动程序识别和管理。为了解决这个问题，你需要安装或重新加载正确的网络驱动程序。



#### 下载并安装 Realtek 网络驱动程序

访问 Realtek 官方网站下载适用于你的 RTL8111/8168/8411 网络控制器的驱动程序，通常是 `r8168` 驱动程序。

- 访问 [Realtek 官方驱动下载页面](https://www.realtek.com/)。
- 找到并下载适用于 Linux 内核的 `r8168` 驱动程序。

```shell
root@server:/vol1# cd /vol1/1000/aaa/r8168-8.054.00/r8168-8.054.00.tar/r8168-8.054.00/
root@server:/vol1/1000/aaa/r8168-8.054.00/r8168-8.054.00.tar/r8168-8.054.00# ls
autorun.sh  Makefile  README  src
root@server:/vol1/1000/aaa/r8168-8.054.00/r8168-8.054.00.tar/r8168-8.054.00# sh autorun.sh

Check old driver and unload it.
Build the module and install
Warning: modules_install: missing 'System.map' file. Skipping depmod.
Backup r8169.ko
rename r8169.ko to r8169.bak
DEPMOD 6.6.38-trim
load module r8168
Updating initramfs. Please wait.
update-initramfs: Generating /boot/initrd.img-6.6.38-trim
Completed.
```



安装好了之后，理论上自动显示网口2，但IP什么的都是空的，需要点击编辑，然后按照下面的填一下。

![](https://github-images.wenzhihuai.com/images/QQ_1732806426577.png)


## 三、最后
最后就可以互相ping通了，很稳定，传输速度很快很快，基本都能1ms以内

![](https://github-images.wenzhihuai.com/images/QQ_1732806404944.png)