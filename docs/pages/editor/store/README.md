# 状态管理

本项目使用 vuex 来做状态管理.由于项目较大,关系复杂,因此各个模块的状态管理拆分为独立的小文件.
::: warning
没有写到的模块自行添加,毕竟我也不太清楚
:::


以下是主要的状态管理模块: 
## 页面背景 backgroundStore
+ state
    + SelectTab `弹窗当前显示资源库还是设置项 resource or set`
    + paneData `当前选择区域的背景数据`
    + headData `页面头部背景数据`
    + bodyData `页面中部背景数据`
    + footData `页面底部背景数据`
+ mutations
    + setBackData() `修改背景数据`
    + switchTab `切换弹窗是显示设置项还是资源库`
    + openBackPaneData `打开弹窗时做一些操作`
::: tip
+ 组件模式下,预览是没有背景的
+ 站点和模板模式下,后台数据会覆盖初始数据
:::
## 弹窗 paneStore
+ state
    + paneData `主弹窗的数据`
    + otherPaneData `副弹窗数据`
    + customerPaneData `自定义弹窗数据`
    + toolDialogData `???`
+ mutations
    + changePaneData `通过此方法打开的是主弹窗`
    + changeOtherPaneData `通过此方法打开的是副弹窗`
    + changeCustomerPaneData `通过此方法打开的是自定义弹窗`
    + changeToolDialogData `???`
    + openBackPane `打开背景设置弹窗的方法`
+ getters
    + getAttribute `???`
    + getPosition `???`

::: tip
+ 主弹窗主要是设置弹窗,样式切换弹窗等
+ 副弹窗主要是当主弹窗打开时,需要另开一个弹窗选择图标等资源时使用,主弹窗关闭,副弹窗也会同时关闭
+ 很多组件还有特殊的设置弹窗,因此提供一个自定义弹窗.编辑器只提供一个全屏遮罩,通过地址异步加载具体的组件
:::

## 设置项按钮 buttonStore
+ state
    + pageBtnData `页面背景按钮类型`
    + nowButtonType `当前显示按钮类型`
    + nowButtonPlace `当前显示按钮坐标`
    + backgroundType `背景类型`
+ mutations
    + switchBtnType(String) `切换按钮列表显示类型`
    + upPlace(Obj) `更新按钮坐标`
    + setPageBtnData(obj) `设置页面按钮数据`
    + showRightKeyMenu(obj) `显示页面背景右键菜单`
    + switchBackType(String) `切换页面背景类型`

## 页面 pageStore
+ state
    + headRowH `pc端head高度`
    + bodyRowH `pc端body高度`
    + footRowH `pc端foot高度`
    + mobileHeadRowH `mob端head高度`
    + mobileBodyRowH `mob端body高度`
    + mobileFootRowH `mob端foot高度`
    + contentWidth `页面内容区的宽度`
    + nowWinWidth `页面可视区宽度(不包含滚动条)`
    + nowWinHeight `页面可视区高度`
    + marginLeft `页面内容区距可视区的边距`
    + nowScrollY `页面Y轴滚动距离`
    + menuHeight `页面顶部菜单栏高度`
    + isShowRuler `是否显示标尺`
    + isShowAssitLine `是否显示辅助线`
    + ctrlBoxmode `编辑框是否渲染 移动时 控制显示隐藏`
    + ctrlBoxType `编辑框是否显示 切换模式时控制渲染与否`
    + activeContainer `当前选中区域 头|中|尾|组件`
    + isShowAuxiliary `switch to show auxiliary lines when dragging`
    + ruleLines `标尺线数组合集，用以对移动组件进行吸附`
    + auxiliaryLines `auxiliary line when draging`
    + showRightTool:false `右侧功能栏的显示与隐藏`
    + isShowLoginDialog `是否显示登录弹窗`
    + showMoveBox:false `组件移动时蓝色外边框的显示与隐藏`
    + freezePageHead `是否冻结页眉`
    + ECommerce `是否显示电子商务功能栏`
    + footerPalette `是否显示页脚功能栏`
    + nowPointRow `当前鼠标指向的容器`
    + auxiliaryType`Object 页眉、页肚子、页脚出现页面中心线时，显示页眉、页肚子、页脚的的红色外框`
    + showCurComMoveBox `控制curcom的moveBox只有在移动时才显示`
           
+ mutations
    + 
+ getters
    + ableToAdsorpList PC mold下组件移动过程中可对组件进行吸附的对象
    + MobileAbleToAdsorpList Mobile mold下组件移动过程中可对组件进行吸附的对象
::: tip
+ 记录页面信息及通用的一些属性
+ 

:::

## 动画 animationStore
::: warning 注意事项
### 未完待续
:::

## 历史记录 historyStore
::: warning 注意事项
### 未完待续
:::

## 颜色拾取器 colorPickerStore
+ state
    + mold `默认: false`
    + defaultColor `默认: 白色`
    + callback `默认: null 回调函数`
    + position `组件坐标 默认值随意,显示时会重新计算`
+ mutations
    + changeColor `将接受到的颜色值,解析成不同的格式`
::: tip
callback 是 `sliders` 设置项传过来的,颜色拾取器只与 `sliders` 设置项有交互,不与组件有直接交互
:::


## 侧边栏 componentList
+ state 
    + isShowTabList: 1, `用于控制侧边栏导航区域的显示和隐藏  1 -- 显示  0 -- 隐藏`
    + componentsNav: new Map(), `用于存放组件图标列表`
    + componentsData: new Map(), `用于存放组件详情信息`
    + isNewLightBox:false, `是否打开灯箱窗口  用于页面管理中的新建灯箱的功能`
    + isCloseAllDialog : true, `关闭所有的 componentList 弹窗  false 为关闭状态`
    + isShowComList : false, `用于控制侧边栏内容区域的显示和隐藏`
+ mutations
    + setStateData: `修改当前state中第一层的数据`
    + changeComListType: `控制手机端侧边栏的显示和隐藏` 
    + setComponentsNav: `存储组件图标列表 参数key为 组件大类 value 为当前组件大类的数据列表`
    + setComponentsData: `存储当个组件的详情 参数 key 为 组件id value 为组件的详情`
    + deleteComponentData: `删除组件库中的数据 主要用于component模式中的打开组件组件的删除功能`
+ getters
    + setStateData: `获取组件;列表数据 参数 组件大类`
    + hasComponentsNav: `判断指定大类的组件列表是否存在`
    + getComponentsData: `获取指定ID的组件数据`

## 头部  menu
+ state
    + webType: `当前站点的模式  component---组件模式  website---站点模式  template---模板模式`
    + allDialogType: `用于关闭menu下所有的弹窗  默认值为 true  关闭为 false`
    + isCtrlS: `触发组件/模板/站点 的 ctrl + s 保存操作`
    + userData: `当前用户信息`
    + siteData   `存放当前的站点信息/模板信息  下面默认了三个参数名 实际参数多于三个`
      + fSiteName: `站点名称`
      + fDomainName: `用户自己的域名`
      + fSecDomainName: `族蚂提供的子域名`
    + pageData: `当前模板 | 站点 下的 页面总数据`
    + lightBoxData: `当前模板 | 站点 下的 灯箱总数据`
    + publicityData: `当前模板 | 站点 下的 宣传页总数据`
    + headPageData: `当前模板 | 站点 下的 页眉总数据`
    + footPageData: `当前模板 | 站点 下的 页脚总数据`
    + commPageData: `当前模板 | 站点 下的 公共页面数据(既公共组件功能)`
    + selectPageData: `选中的页面数据`
    + selectLightBoxData: `选中的灯箱数据`
    + selectPublicityData: `选中的宣传页数据`
    + dialogIsShow: `控制 menu 下第一弹窗`
    + isShowMenuDialog: `控制 menu 下第二弹窗`
    + dialogType: `第一弹窗的类型  参数: pageSetDialog/页面管理弹窗 webSiteDialog/站点设置弹窗  seoDialog/SEO优化弹窗  openComDialog/打开组件功能弹窗 saveDialog/组件保存弹窗`
    + settingIsShow: `控制页面管理设置栏功能的显示和隐藏`   




## 组件多选  multipleSelectCom
+ state
    + arrx:`多选选中的组件x 坐标集合`
    + arrx1:`多选选中的组件最大x坐标集合   `
    + arry:`多选选中的组件y 坐标集合`
    + arry1:`多选选中的组件最大y 坐标集合`
    + selectList:`多选选中的组件`
    + selectListSet:`多选选中的组件的set集合(为了去重)`
    + childrenListSet:`多选选中的组件的子组件的set的集合`
    + parentListSet:`多选选中的组件的父组件的set的集合`

    + outX:`蓝色选区的x坐标`
    + outY:`蓝色选区的y坐标`
    + outW:`蓝色选区的宽度`
    + outH:`蓝色选区的高度`

    + inX:`多选框的x坐标`      
    + inY:`多选框的y坐标`
    + inW:`多选框的宽度`
    + inH:`多选框的高度`

    + ctrlLock:`ctrl组合`
    + outIsShow:`蓝色选区的显示隐藏`
    + inIsShow:`多选框的显示隐藏`
    + dragShow:`locked状态下可以自由拖动组件的框的显示隐藏`
    + downShow:`多选组件中的下推图标`
    + comPointerEvents:`多选框区域的指针事件`
    + clearState :`清除状态 `

    + selParent:`选中的是当前组件的父组件`

## 组件 component

