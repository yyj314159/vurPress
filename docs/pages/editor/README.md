# 编辑器简介

网站编辑器可以简单地分为两部分, `Menu 菜单栏`  和 `Editor 组件操作区` .

`Menu` 负责显示网站logo,显示用户信息,控制pc模式和mobile模式切换,网站换肤,切换工具条的显示/隐藏,缩小窗口,预览,保存及发布的功能.

`Editor` 再细分为三部分,左侧的组件列表(componentList),右侧的工具条(toolbar),以及组件编辑区域(editor),通常项目中所指的`editor`就是这一部分.
+ componentList 组件列表 显示原始组件,同时实现拖拽组件到页面显示的功能
+ toolbar 工具条 提供对组件的一些快捷操作(如: 改变旋转角度,改变大小,多组件对齐等) 
+ editor 编辑器 负责渲染组件,组件移动,组件拉伸,组件旋转,辅助线,页面背景,菜单,设置弹窗,历史记录等等

## 组件通用模板
```html
<!-- pc端和移动端结构不同的 template 模板 -->
<template>
    <transition 
        @enter="enter" 
        @leave="leave" 
        :css="false" 
        :appear="settingData.animation.isFirstPlay">
        <div class="zm-component-main" 
            v-if="isComputer" 
            v-show="show" 
            :data-title="type"
            :style="{position: 'absolute',width: style.width+'px',height: style.height+'px',left: style.left+'px',top: style.top+'px',transform: 'rotate('+style.rotate+'deg)'}" 
            @mousedown.stop.left="other($event),mousedown($event)" 
            @contextmenu.stop.prevent="other($event),openMenu($event)" 
            @mouseenter="handleEnter" 
            @mouseleave="handleLeave">
            <!-- 组件自身在 PC端 的展示模板 -->
        </div>
        <div class="zm-component-main" 
            v-else-if="(!isComputer && settingData.mobileComIsHide)" 
            v-show="show" 
            :data-title="type"
            :style="{position: 'absolute',width: mobileStyle.width+'px',height: mobileStyle.height+'px',left: mobileStyle.left+'px',top: mobileStyle.top+'px',transform: 'rotate('+mobileStyle.rotate+'deg)'}" 
            @mousedown.stop.left="other($event),mousedown($event)" 
            @contextmenu.stop.prevent="other($event),openMenu($event)" 
            @mouseenter="handleEnter" 
            @mouseleave="handleLeave">
            <!-- 组件自身在 mobile端 的展示模板 -->
        </div>
    </transition>
</template>

<!-- pc和移动端 结构相同的 template 模板 -->
<template>
    <transition 
        @enter="enter" 
        @leave="leave" 
        :css="false" 
        :appear="settingData.animation.isFirstPlay">
        <div class="zm-component-main" 
            v-if="(isComputer || settingData.mobileComIsHide)" 
            v-show="show" 
            :data-title="type" 
            :style="{position: 'absolute',width: ( isComputer ? style.width : mobileStyle.width )+'px',height: ( isComputer ? style.height : mobileStyle.height )+'px',left: ( isComputer ? style.left : mobileStyle.left )+'px',top: ( isComputer ? style.top : mobileStyle.top )+'px',transform: 'rotate('+( isComputer ? style.rotate : mobileStyle.rotate )+'deg)'}" @mousedown.stop.left="other($event),mousedown($event)" 
            @contextmenu.stop.prevent="other($event),openMenu($event)" 
            @mouseenter="handleEnter" 
            @mouseleave="handleLeave">
            <!-- 组件结构 -->
        </div> 
    </transition>
</template>
```
+ `transition` 这一层是为实现动画效果加的如果组件没有动画设置项,不要加这一层.  
+ `.zm-component-main` 这一层归编辑器控制,绑定style属性,用来控制组件的宽,高,坐标,zindex,rotate等
+ `enter` 全局混入的动画执行函数,必须和leave搭配使用
+ `leave` 全局混入的动画执行函数,必须和enter搭配使用
+ `show` 全局混入的属性,控制组件动画效果,与leave和enter搭配使用
+ `isComputer` 全局混入的属性 表示当前是否是PC模式
+ `style` 组件PC端样式数据
+ `mobileStyle` 组件Mobile端样式数据
+ `mobileComIsHide` 组件后台添加的属性 表示组件在Mobile端是否隐藏
+ `other()` 提供选中当前组件,关闭弹窗等功能
+ `mousedown()` 提供组件移动功能
+ `openMenu()` 打开右键菜单
+ `handleEnter()`,`handleLeave` 鼠标滑过组件时给组件增加遮罩效果
+ `data-title` 鼠标滑过组件时右上角显示的标签信息
```js
// props 部分
props: {
    prop: {
        type: Object,
        required: true
    },
    index: {
        type: [String, Number],
        required: true
    }
},//接收参数
```
+ prop 上级组件传递下来的组件数据
+ index 此组件在上级组件中的位置

```js
//data 部分
data() {
    return {
        id: this.prop.id, //随机ID
        type: "container", //组件类别
        // mobileState: "", //手机版组件状态 好像没有用到
        mold: "commonContainer", //组件类型(普通组件: commonUnit)(普通容器: commonContainer)(特殊容器: multipleContainer)(其他: 自行定义)
        style: this.prop.style, //组件外层样式 由编辑器控制
        settingData: this.prop.settingData, //组件设置项数据
        comName: this.prop.comName, //组件存储在后台的名称
        // childData: this.prop.childData, //子组件信息 //只有具有容器功能的组件再有这个属性
        // specialTop: true,//上部特殊按钮   默认: true 显示  当不需要这个按钮时,才写这个属性 false: 不显示
        // specialBot: true,//下部特殊按钮   默认: true 显示  当不需要这个按钮时,才写这个属性 false: 不显示
        buttonList: [], //设置按钮列表项
        pattern: [1, 1, 1, 1, 1, 1, 1, 1], //拖拽控制点 1: 显示 0: 隐藏  //根据需求文档来赋值
        // mobileFull: true,//标识组件在手机版是否可以左右移动
        isRotate: true, //是否可旋转 //根据需求调整 true or false
        mobileStyle: this.prop.mobileStyle, //手机版样式
        mobileButtonList: [], //手机版设置项按钮
        // mobileChildData: this.prop.mobileChildData, //手机版子组件信息
    }
}
```
注释的属性,需要的加,不需要的不要加

```js
//组件渲染时
mounted() {
    // this.$store.commit("addContainerToList", this); //具有容器功能的组件要加上这一句代码,不是容器的不要加,否则会报错 //将组件实例加入所有容器列表
    if (this.$store.state.pane.isRenderSelect) {
        this.$store.commit("changeSelectList", this);
    } else {
        if (this.id == this.$store.state.component.oldComID) {
            this.$store.commit("changeSelectList", this);
        }
    } // 加这个判断是为了实现 容器组件样式切换的时候 不会因为重新渲染选中她的子组件,进而变成切换子组件样式
}
```
具有容器属性的组件要添加注释的那一行代码,非容器组件只需要下面的代码
```js
computed: {
    mobileSetData() {
        return {}
    }, //手机版设置项数据结构 没有可不加
    setData() {
        return {}
    },//pc版设置项数据结构
    lists() {
        return this.prop.lists;
    },//请求数据的组件
}
```
计算属性中 setData 是必需的,mobileSetData 和 lists 根据需求来确定是否需要

```js
methods: {
    pointDown(obj){}, //组件改变大小时,操作开始,鼠标按下时执行的回调!!!
    pointCallBack(obj){}, //组件改变大小时,移动过程中,持续执行的回调!!!
    pointUp(obj){}, //组件改变大小时,操作结束,鼠标松开时执行的回调!!!
    moveCallBack(type = 'up'){}, //组件移动操作,鼠标按下和松开都会调用这个方法,按下会传参数 'down' ,松开传参数 'up'
    upDataMes(obj){
        this.childData[obj.index][obj.key] = obj.value
    } //容器提供给子组件的方法,更新子组件的lists数据的方法
}
```
编辑器提供的一些回调函数,当组件身上有这些方法时,编辑器在做相应操作时会调用这些方法.不需要的不要加这些方法,也要注意不要重名.



## 两端

+ 所谓两端就是 PC端 和 Mobile端,当然,这个 Mobile端是假的,是在浏览器中模拟手机端的界面展示.
+ `PC` 向 `Mobile` 切换,需要对组件的位置关系,大小等等进行换算,这一部分基本等于没做,和`wix`相去甚远.
+ `Pc` 和 `mobile` 相互切换,会重新渲染 `editor`(组件操作区)部分,也就是说 有两个编辑器组件,位于`src/components/async/editor/`中
+ `editor`加载时,会注册四个全局事件:
    + document.scroll事件 触发时会相应改变 pageStore 里的数值 
    + window.resize 
    + 鼠标在编辑器内移动事件 主要用来监测鼠标在编辑器的头部 中间 还是 尾部 
    + window.keydown 键盘响应事件 

## 三模

+ 所谓三种模式就是 **组件模式** , **模板模式** , **站点模式** . 这三种模式虽然共用一套代码,但是不能随意切换,有不同的入口.
+ vue 实例在 created 时,会判断当前的模式,并保存在 store 中.
+ 三种模式下,编辑器基本是相同的,不同的部分主要集中在 menu 中.

## editor DOM 层级
+ 弹窗层 `放置各类弹窗`
+ 按钮层 `放置组件按钮,背景按钮,右键菜单`
+ 控制窗层 `放置 ctrlBox 组件`
+ 标尺辅助线层 `放置标尺及渲染标尺辅助线`
+ 移动辅助线层 `渲染移动辅助线`
+ 组件层 `渲染各类组件`
+ 颜色拾取器层 `放置颜色拾取器`

::: tip
除了组件层,其它层都做了鼠标穿透(使用 pointer-events: none)  
各层级顺序为: 弹窗层>按钮层>移动辅助线层>控制窗层>标尺辅助线层>组件层  
:::

## 编辑器 层级结构
+ menu层
    + menu 基本层级 (id  zm-menu) 275  PS:(高度标尺的层级 低于组件设置按钮的层级)
    + menu下各个弹出层  大于 editor 层级(1100~1500)
    + 全屏遮罩层级  (5500~6000)
+ editor层 (200~1000)
    + 组件层(id  zm-editor-page)  200
    + 内容区域左右边线 PS:(伪元素)  210
    + 标尺(id  zm-editor-assist)  250
    + 组件设置项按钮 (id  zm-editor-button)  310
    + 组件控制框  (id  zm-editor-control)  300
    + 组件设置项弹窗  (id  zm-editor-dialog)  400
    + 组件移动显示坐标  (id  zm-editor-moveBox)  400
    + 辅助线  (id  zm-editor-auxiliary)  400
    + 拾色器遮罩  500
+ componentList层 1500
+ 预览层   5000


## 混入
通过全局混入 ``` Vue.mixin() ``` ,编辑器向组件实例上挂载了大量的属性及方法,现做如下说明:
+ 属性
    + show ``` 默认值: true 控制组件动画效果展示的属性 ```
    + settingData ``` 存放组件设置项数据 ```
        + oncePos ```默认值: false 标识组件在移动端是否更改过 ```
        + inAllPage ``` 默认值: false 标识组件是否在所有页面显示 ```
        + animation ``` 数据类型: Object; 存放动画相关的数据 ```
    + isActive ``` 默认值: false 标识组件当前是否是选中状态 ```
    + specialTop ``` 默认值: true 标识组件是否具有 上移特殊按钮 ```
    + specialBot ``` 默认值: true 标识组件是否具有 下移特殊按钮 ```
+ 计算属性
    + isComputer ``` 返回值 true or false 标识当前是否是PC版 ```
    + posX ``` 返回PC端组件相对文档区域(0,0)X轴的坐标 ```
    + posY ``` 返回PC端组件相对文档区域(0,0)Y轴的坐标 ```
    + mPosX ``` 返回Mobile端组件相对文档区域(0,0)X轴的坐标 ```
    + mPosY ``` 返回Mobile端组件相对文档区域(0,0)Y轴的坐标 ```
+ 方法
    + openMenu() ``` 打开组件右键菜单 ```
    + other() ``` 组件获得焦点时做一些操作 ```
    + mousedown() ``` 组件移动事件 ```
    + enter() ``` 执行动画依赖函数 ```
    + leave() ``` 执行动画依赖函数 ```
+ 生命周期钩子
    + created() ```大概也许可能是控制组件动画延迟显示的?```

::: tip 当组件和混入对象含有同名选项时
+ 数据对象在内部会进行浅合并 (一层属性深度)，在和组件的数据发生冲突时以组件数据优先。
+ 同名钩子函数将混合为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。
+ 值为对象的选项，例如 methods, components 和 directives，将被混合为同一个对象。两个对象键名冲突时，取组件对象的键值对。
:::

::: warning 友情提醒
全局混入会导致之后创建的每一个根实例及每一个组件都挂载上这些属性及方法,请大家慎用!!!
:::

::: danger 重要提示
+ 因为项目拆分的关系,编辑器不得不暴露一个全局变量 ```zmEditor```,以供各单独的模块使用,存在很大的安全隐患.
+ 能用 ```this.$store``` 的地方尽量避免使用 ```zmEditor.$store```
+ 如果以后有好的实现,建议废弃 ```zmEditor``` 接口
:::
