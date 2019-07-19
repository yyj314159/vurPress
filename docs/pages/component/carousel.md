# 轮播组件
【容器类组件】

轮播组件类型有单页轮播,多页轮播,满屏轮播.需要能无序添加图片,视频和颜色.每种类型的可调整的配置项有【页面管理】,【页面内容】,【页面设置】,【删除】.
```
//代码目录结构
└─components
    ├─com //编辑模式
    │  └─slide  //轮播组件
    │      │  comSlide1.vue //单页轮播
    │      │  comSlide2.vue //多页轮播
    │      │  comSlide3.vue //满屏轮播
    │      │  pageset.vue //单页轮播与满屏轮播页面切换控件
    │      │  pageset2.vue  //多页轮播页面切换控件
    │      │
    │      ├─config //轮播[页面设置]项
    │      │      config1.js  //单页轮播[页面设置]设置项
    │      │      config2.js  //多页轮播[页面设置]设置项
    │      │      config3.js  //满屏轮播[页面设置]设置项
    │      │      mconfig.js  //单页轮播与多页轮播手机端轮播[页面设置]设置项
    │      │      mconfig2.js //单页轮播手机端[页面设置]设置项
    │      │
    │      └─dialog //轮播[页面管理]项
    │              setlable.vue //[页面管理]面板
    │              setslideCheck.vue  //[页面管理]中新建页面按钮
    │              slide.css  //[页面管理]面板样式文件
    │              slideshow.css  //[页面管理]面板样式文件
    │              slideshow.less //[页面管理]面板样式文件
    │              tabpop.vue //提示弹窗控件(已改为调用编辑器全局弹窗)
    │
    ├─mpub  //手机发布模式
    │  └─slide  //轮播组件
    │          comSlide1.vue //单页轮播
    │          comSlide2.vue //多页轮播
    │          comSlide3.vue //满屏轮播
    │
    ├─pub //PC发布模式
    │  └─slide  //轮播组件
    │          comSlide1.vue //单页轮播
    │          comSlide2.vue //多页轮播
    │          comSlide3.vue //满屏轮播
    │
    └─set //设置项
        └─slide  //轮播组件私有控件
                complexSwitch.vue //开关控件
                comslide.css  //设置项样式
                comslide.less //设置项样式
                comslidshow.vue //翻页方式设置控件
                comTabimginfo.vue //面板图片控件
                comTabset.vue //页码位置控件(已注释)
                selectTab.vue //下拉框菜单

```

## 单页轮播
宽度为中间宽度的普通轮播类型
#### 代码文件  
components\com\slide\comSlide1.vue
## 多页轮播
宽度为中间宽度的多页展示轮播类型
#### 代码文件
components\com\slide\comSlide2.vue
## 满屏轮播
宽度为浏览器宽度的轮播类型
#### 代码文件
components\com\slide\comSlide3.vue
## 设置项
### 1. 页面管理

轮播页面管理并设定排序展示 

#### 主要功能
* 拖拽排序(子组件需要一起变化)
* 重命名(需要满足输入字符不超过20个字符及禁止重名)
* 上方添加页面 下方添加页面 删除页面(最多只能生成20个页面), 添加新页面注意事项：新建轮播页面，应该默认复制上一张轮播页面内容。比如原来有3个轮播页面，此时如果在第二个轮播使用【上方添加页面】【下方添加页面】时，则复制第二个，如果使用下方【新建页面】则复制最后一个轮播页面。总之新建轮播页面不要用族蚂默认图片。
* 注意事项 新增页面和删除页面的时候轮播组件会重新渲染组件。需要在页面管理面板组件创建和销毁的时候设置
```js
created(){
    this.$store.state.pane.isRenderSelect = false;
}
destroyed(){
    this.$store.state.pane.isRenderSelect = true;
}
```
#### 代码文件
components\com\slide\dialog\setlable.vue

### 2. 页面内容
设置轮播页的内容、样式和链接。有图片、视频、颜色三种模式。面板由编辑器统一提供。获取设置项的`settingData.backgroundData`返回数据对组件进行操作。
视频后台数据使用了m3u8的格式。前端需要用videojs解析。
 
#### 主要功能
*  图片  
覆盖纹理 纹理浅色 纹理深色 覆盖颜色 背景底色 显示比例(自适应/平铺) 设置链接(组件模式没有)
* 视频  
覆盖纹理 纹理浅色 纹理深色 覆盖颜色 背景底色 播放速度 循环播放 设置链接(组件模式没有)
* 纯色  
背景颜色

#### 代码文件
由编辑器提供。数据处理comSlide1.vue comSlide2.vue comSlide3.vue

### 3. 页面设置
设置轮播样式
#### 主要功能
* 常规  
边框宽度 边框颜色
* 翻页  
翻页箭头(在图标字体中找样式) 翻页样式 箭头大小 箭头颜色 背景色 页边距 轮播方式(自动轮播/手动轮播) 翻页耗时 展现时长 光标停顿 翻页方式(重新加载了轮播组件)
* 页码  
显示页码 页码类型 页码大小 页码颜色 当前页码颜色 页码间距 页码边距
* 阴影  
显示阴影 X轴偏移 Y轴偏移 模糊程度 阴影颜色
* 代码文件  
components\com\slide\config\config1.js。数据处理comSlide1.vue comSlide2.vue comSlide3.vue

### 4. 删除
由编辑器统一处理
