# 视频组件
视频组件类型有单页视频,多页视频,满屏视频.需要能无序添加图片,视频和颜色.每种类型的可调整的配置项有【页面管理】,【页面内容】,【页面设置】,【删除】.
```
//代码目录结构
└─components
    ├─com //编辑模式
    │  └─video  //视频组件
    │      │  comVideoType1.vue //单个视频
    │      │  comVideoType3.vue //竖向轮播
    │      │  comVideoType4.vue //横向轮播
    │      │  comVideoType6.vue //横向分页列表视频
    │      │  comVideoType9.vue  //竖向分页列表视频
    │      │
    │      ├─config //视频[页面设置]项
    │      │      config1.js  //单个视频[页面设置]设置项
    │      │      config3.js  //竖向轮播[页面设置]设置项
    │      │      config4.js  //横向轮播[页面设置]设置项
    │      │      config6.js  //竖向分页列表视频[页面设置]设置项
    │      │      config9.js  //横向分页列表视频[页面设置]设置项
    │      │
    │      └─dialog //视频[页面管理]项
                  manageVideo1 //视频轮播（3,4）
                  manageVideo2 //视频列表（6,9）
                  setVideo2    //单个视频
    │
    ├─mpub  //手机发布模式
    │  └─video  //视频组件
    │         comVideoType1.vue //单个视频
    │      │  comVideoType3.vue //竖向轮播
    │      │  comVideoType4.vue //横向轮播
    │      │  comVideoType6.vue //横向分页列表视频
    │      │  comVideoType9.vue  //竖向分页列表视频
    │
    ├─pub //PC发布模式
    │  └─video  //视频组件
    │         comVideoType1.vue //单个视频
    │      │  comVideoType3.vue //竖向轮播
    │      │  comVideoType4.vue //横向轮播
    │      │  comVideoType6.vue //横向分页列表视频
    │      │  comVideoType9.vue  //竖向分页列表视频
    │
    └─set //设置项
        └─video  //视频组件私有控件
                complexSwitch.vue //开关控件

```

## 单个视频
视频播放器
#### 代码文件  
components\com\video\comVideoType1.vue
#### 注意事项
更换视频src，初始化dplayer 插件 
## 竖向轮播
竖状海报轮播
#### 代码文件
components\com\video\comVideoType3.vue
#### 注意事项
组件width或者数据有变化时，调用initHTML()这个函数，保持样式动态改变（如果是拖拽8个点，请调用dragHTML()）
## 横向轮播
横向视频轮播， 图片主要是缩略图
#### 代码文件
components\com\video\comVideoType4.vue
#### 注意事项
组件width或者数据有变化时，调用initHTML()这个函数，保持样式动态改变（如果是拖拽8个点，请调用dragHTML()）
## 横向视频列表
视频播放器
#### 代码文件  
components\com\video\comVideoType6.vue
#### 注意事项
组件width或者数据有变化时，调用initHTML()这个函数，保持样式动态改变（如果是拖拽8个点，请调用dragHTML()）
## 竖向视频列表
视频播放器
#### 代码文件  
components\com\video\comVideoType9.vue
#### 注意事项
组件width或者数据有变化时，调用initHTML()这个函数，保持样式动态改变（如果是拖拽8个点，请调用dragHTML()）
## 设置项
### 1. 视频数据

操作视频数据

#### 主要功能
* 拖拽排序
* 指定视频要按照后端要求记录id

#### 代码文件
components\set\video\manageVideo1.vue      (视频轮播   横向/竖向)
components\set\video\manageVideo2.vue      (视频列表   横向/竖向)

### 2. 组件样式（常规设置项）
设置视频组件的样式，例如：图片比例，下部高度，边距，背景色

#### 代码文件
components\com\video\config\config1.js

components\com\video\config\config3.js

components\com\video\config\config4.js

components\com\video\config\config6.js

components\com\video\config\config9.js

### 2. 通用设置项
components\set\setBorder.vue

components\set\setTextLayout.vue

components\set\setFont

#### 注意事项

组件间传值，通信

### 3. 删除
由编辑器统一处理
