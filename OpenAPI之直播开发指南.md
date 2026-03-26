---
tags:
  - daily
date: 2026-03-25
week: 2026-W13
---
##  如何在第三方应用中通过H5方式集成播放器

#### 1 使用条件

- 设备通电且当前在线
- 流量卡流量充足
- 设备正确安装1个或以上的摄像头

#### 2 使用场景

查看设备的实时视频流。

#### 3 组件功能

通过输入设备IMEI号和摄像头通道号进行实时拉流播放，根据设备的摄像头安装情况，支持单路和多路，在播放过程中可以对其进行录屏和截屏。

#### 4 使用方法

以"获取 APPKEY —> 引入JS/CSS-SDK —> 初始化组件"三个核心功能开发为主线，为开发者介绍组件的使用。

##### 4.1 获取 APPKEY

通过商务合作，由我公司统一分配。

##### 4.2 引入JS/CSS-SDK 文件

**CDN方式：**

```html
<script src="https://cdn-static.m-m10010.com/mgui/common/js/mg-player/pro/index-pro.min.js?v=20251218"></script>
```

```html
<link rel="stylesheet" href="https://cdn-static.m-m10010.com/mgui/common/js/mg-player/pro/index.css" />
```



##### 4.3 初始化组件

引入JS文件后，通过实例对象后初始化播放器。
##### API

| 方法 | 说明 |
|------|------|
| setWindowNum | 设置播放器的数量方法 |
| destroyPlayer | 关闭所有直播的方法 |

##### 实例化参数

| 参数 | 是否必须 | 默认值 | 说明 |
|------|----------|--------|------|
| id | 是 | — | 指定播放初始化元素容器 |
| appkey | 是 | — | 唯一标识 |
| isExtend | 否 | true | 双路时是否扩展多屏 |
| isScreenshot | 否 | true | 播放器是否显示截图按钮 |
| isRecord | 否 | true | 播放器是否显示录制按钮 |
| screenshotCustom | 否 | false | 播放器截图保存事件返回blob流 |
| recordCustom | 否 | false | 播放器录制保存事件返回blob流 |

**示例：**

```html
<div style="width: 800px; height: 500px;" id="container"></div>
```

```javascript
let player = new mgPlayer({ id: 'container', appkey: '' })
```

##### screenshotCustom

- screenshotCustom初始化设置为true以后，点击播放器的截图按钮，就不会自动调取浏览器的下载功能，而是通过一个回调函数返回blob流

```javascript
let player = new mgPlayer({ id: 'container', appkey: '', screenshotCustom: true })
document.addEventListener("captureImg", (data) => {
  // data.detail.content就是截图的图片blob流
  console.log(data.detail.content);
});
```

##### recordCustom

- recordCustom初始化设置为true以后，点击播放器的录屏按钮保存视频以后，就不会自动调取浏览器的下载功能，而是通过一个回调函数返回blob流

```javascript
let player = new mgPlayer({ id: 'container', appkey: '', recordCustom: true })
document.addEventListener("recordVideo", (data) => {
  // data.detail.content就是录制视频的blob流
  console.log(data.detail.content);
});
```

##### player.setWindowNum(num)

| 参数 | 是否必须 | 说明 |
|------|----------|------|
| num | 否 | 同时播放的数量（最大支持16路） |

**示例：**

```javascript
player.setWindowNum(1)
```

##### player.initAutoPlayer

| 参数 | 是否必须 | 说明 |
|------|----------|------|
| imei | 是 | 设备IMEI |
| channel | 否 | 直播哪个摄像头 |
| config | 否 | 直播流携带参数配置 |

注：多个设备时，只需继续调用此方法替换imei即可。

**示例：**

```javascript
player.initAutoPlayer({ imei: 123421523 })
```

**传递channel**

```javascript
player.initAutoPlayer({ imei: 123421523, channel: 1 })
```

**添加配置config**

此配置的作用是把传递的配置项会被作为参数依次携带在直播流的url后面

```javascript
player.initAutoPlayer({
  imei: 123421523,
  config: {
    key1: 'value1',
    key2: 'value2',
  }
})
```

##### 4.4  在你的APP中使用

> demo地址：[https://cdn-static.m-m10010.com/demo/player/index.html](https://cdn-static.m-m10010.com/demo/player/index.html)

