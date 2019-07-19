# 灯箱组件

灯箱组件分为三个组件，最底层的全屏容器、底层之上的容器和一个关闭按钮。
灯箱组件作为一个复杂容器组件，底层容器和容器里面还可以拖拽进若干子组件。
***
<!-- **1.comLightbox 灯箱组件中最底层的全屏背景容器**<br/> -->
<!-- **2.comLightboxClose 灯箱组件中的关闭按钮**<br/>
**3.comLightboxContainer 灯箱组件中底层之上的容器** -->

::: tip comLightbox
**灯箱组件中最底层的全屏背景容器**
:::
::: tip comLightboxClose
**灯箱组件中的关闭按钮**
:::
::: tip comLightboxContainer
**灯箱组件中底层之上的容器**
:::
*********************
### 1.comLightbox 
****************
* html模板如下
```html
<template>
    <div :id="id" :uid="uid" v-if="(isComputer || settingData.mobileComIsHide)" class="zm-component-main" :style="{position: ( isComputer ? 'fixed':mobileStyle.position), width:( isComputer ? Cwidht:Cwidht)+'px',height: ( isComputer ? Cheight:Cheight),left: (isComputer ? Cleft :0)+'px',top: (isComputer ? Ctop:0)+'px',zIndex:100}"  @mousedown.stop.left="lightActions($event)" @contextmenu.stop.prevent="openMenu($event),selectLightBox()" @dblclick.stop.prevent="lightboxSettingDialog">
        <div class="zm-component-lightbox" v-bind:style="zmComponentLightbox">
            <div class="zm-component-lightbox-bg"  :style="{backgroundColor:settingData.backgroundData.previewData?settingData.backgroundData.previewData.color : rgb}" v-if="settingData.backgroundData.previewData.type=='color'" ></div>
            <div class="zm-component-lightbox-img" v-else-if="settingData.backgroundData.previewData.type=='img'" :style="{backgroundColor:settingData.backgroundData.bottom.color,backgroundImage:settingData.backgroundData.previewData?'url('+settingData.backgroundData.previewData.poster+')' : src}" >
            </div>
            <div class="zm-component-lightbox-video" v-bind:style="zmComponentLightboxVideo" v-show="settingData.backgroundData.previewData.type=='video'">
                <video autoplay="true" loop="true"  :poster="settingData.backgroundData.previewData?settingData.backgroundData.previewData.poster : ''" ref="video" style="width:100%; height:100%;object-fit: fill;position: absolute;
            top: 0;
            zIndex: 12;"></video>
            </div>
            <div class="zm-component-lightbox-shadow"  :style="{backgroundImage:getShadow,backgroundColor:settingData.backgroundData.coverage.color}"></div>
             
            <div class="zm-component-lightbox-container" v-bind:style="zmComponentLightboxContainer" >
                <component v-for="(item,index) in childData" :is="item.component" :key="item.id" :prop="item" :index="index" @updataMes="updataMes"></component>
            </div>
        </div>
    </div>
 
</template>
```
* css如下
 ```css
 .zm-component-lightbox-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 12;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}
.zm-component-lightbox-img {
  width: 100%;
  height: 100%;
  z-index: 12;
  position: absolute;
  top: 0;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}
.zm-component-lightbox-shadow {
  width: 100%;
  height: 100%;
  z-index: 30;
  position: absolute;
  top: 0;
}
 ```
* data数据如下
```js
 data() {
    return {
      rgb: "rgba(51, 136, 255, 0.5)",
      url: "",
      src: "",
      isLightBox: true,
      id: this.prop.id,
      uid: "",
      inrowlayer: "",
      type:"lightBox",
      mold:"commonContainer",
      lightBoxId:'',
      comName:this.prop.comName,
      videoPlayer:null,
      style:this.prop.style,
      settingData:this.prop.settingData,
      childData:this.prop.childData,
      zmComponentMain: {
        width: "100%",
        height: "100%",
        left: 0,
        top: "6%",
        zIndex: 10,
        position: "fixed"
      },
      zmComponentLightbox: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0
      },
      zmComponentLightboxVideo: {
        backgroundImage: "",
        width: "100%",
        height: "100%",
        zIndex: 12,
        position: "absolute",
        top: 0,
        overflow: "hidden",
        backgroundSize: 'cover',
        backgroundPosition: "50%",
        backgroundRepeat: "no-repeat"
      },
      zmComponentLightboxContainer: {
        width: "100%",
        height: "100%",
        zIndex: 50,
        position: "absolute",
        top: 0
      },

      buttonList: [
        {
          type: "lightboxset",
          title: "设置",
          icon: "icon-shezhi1",
          paneTitle: "背景设置",
          paneIcon: "",
          paneInfo:"变更背景设置",
          paneHeight:350,
          callback: this.lightboxSettingDialog

        },
        {
          type: "lightboxScreenBackground",
          title: "屏幕背景",
          paneIcon: "",
          icon: "icon-color",
          callback: this.lightboxScreenBackground,
          paneInfo:"选择和替换屏幕背景"
        }
      ],
      pattern: [0, 0, 0, 0, 0, 0, 0, 0], //外边框八个点
      isShowRotateBtn: false, //隐藏旋转按钮
      
      customType: {
        title: "",
        time: "",
        id: "",
        creatorId: "",
        audioCreator: "",
        num: 4,
        blean: "true",
        display: "none"
      },
      lists:{},
      mobileSetData:{
        props: [{
               type: '/com/lightbox/lightboxset/comLightboxSettingConse.vue'
        }],
      },
      mobileButtonList: [{ 
          type: "lightboxset",
          title: "设置",
          icon: "icon-shezhi1",
          paneTitle: "背景设置",
          paneIcon: "",
          paneInfo:"变更背景设置",
          paneHeight:410,
          callback: this.lightboxSettingDialog 
        }, 
      ],
      mobileChildData: this.prop.mobileChildData, 
      mobileStyle: this.prop.mobileStyle, 
      specialTop: false,
      specialBot: false,
      isRotate: false, //是否可旋转
      isChildComs:false,
    };
  },
```
* computed数据如下
```js
computed: {
    
    getShadow() {
      let url = "";
      if (this.settingData.backgroundData.depthIndex === 0) {
        url =
          "url(/static/background/light_0" +
          this.settingData.backgroundData.textureIndex +
          ".png)";
      } else {
        url =
          "url(/static/background/dark_0" +
          this.settingData.backgroundData.textureIndex +
          ".png)";
      }
      return url;
    },
    childnum: function(){
        console.log(this.childData.length,'灯箱>>>>>>>>>>>>>>>>>>')
        return  this.childData.length;
    },
    Cheight: function() {
      return "100%";
    },
    Cwidht: function() {
      let widths = this.$store.state.page.nowWinWidth;
      console.log(widths)
      return widths;
    },
    Ctop: function(){
      return 50;
    },
    Cleft: function(){
      return 0 ;
    },
    setData () {
      return {
            type: 'sets',
            props: [
              {
                type: '/com/lightbox/lightboxset/comLightboxSettingConse.vue'
            }
          ]
      }
    }
  },
```
`getShadow()用于更换背景里面的覆盖纹理`<br/>
`childnum 是获取灯箱的子组件数目`<br/>
`Cheight 是设置灯箱底层容器的高度`<br/>
`Cwidht 是设置灯箱底层容器的宽度`<br/>
`Ctop 是设置灯箱底层容器的top值`<br/>
`Cleft 是设置灯箱底层容器的left值`<br/>
`setData() 是灯箱底层容器的设置项`<br/>
***************
* mounted()里面的内容是编辑器通用的和video.js的配置更改组件背景设置项数据
* watch <br/>
1."settingData.backgroundData.previewData.src" ---------- video.js的配置更改组件背景设置项数据
2."settingData.backgroundData.isLoopPlay"------------- video.js的配置更改组件背景设置项数据
3."settingData.backgroundData.playbackRate"------------- video.js的配置更改组件背景设置项数据
4."childnum"-------------------根据子组件数量和容器组件子组件数量变化判断是否要调用提示弹窗<br/>
``` js
"childnum":{
      handler:function(n,o){
        setTimeout(() => {
              if(this.childnum >= 3){
          if(this.isChildComs == true){
            this.isChildComs = false;
            return;
          }else{
              zmEditor.$store.commit("openInfoDialog",{
                      oneBtnCallback:null,
                      twoBtnCallback:null,
                      btnNum:1,
                      oneBtnTitle:null,
                      twoBtnTitle:null,
                      content:"移动组件至灯箱容器外部，显示可能会出现异常。",
                      title:"提示"
              }) 
          }    
          
        }
        }, 100);
        
      },
      deep: true
    }
```
::: warning 提示
* this.isChildComs 是data属性里面声明的一个属性，由子组件里面的容器组件控制值，当子组件容器增加组件时值变为true，进过判断再把值给为false。实现当把子组件容器外的组件拖入容器时 不出现弹窗提示<br/>
* this.childnum 是计算属性里面的，是计算灯箱背景容器子组件数量的<br/>
* zmEditor.$store.commit("openInfoDialog", 是编辑器的弹窗调用
:::
* methods<br/>
`lightboxScreenBackground()-----------设置项第二个按钮执行的方法打开屏幕背景弹窗`<br/>
`lightboxSettingDialog()-----------设置项第一个按钮和双击鼠标执行的方法打开背景设置弹窗`<br/>
`selectLightBox()-----------单击鼠标时调用的方法 隐藏按钮列表和打开的弹窗`<br/>
`lightActions(e)-----------单击鼠标左键时调用的方法 打开按钮列表并赋值按钮列表的坐标隐藏打开的弹窗`<br/>
*****************************
### 2.comLightboxClose 
* html模板如下
```html
<template>
<div :id="id"  v-if="(isComputer || settingData.mobileComIsHide)" class="zm-component-main" :style="{position: 'absolute', width: ( isComputer ? style.width:mobileStyle.width)+'px',height: ( isComputer ? style.height:mobileStyle.height)+'px',left: ( isComputer ? style.left:mobileStyle.left)+'px',top: ( isComputer ? style.top:mobileStyle.top)+'px',zIndex: ( isComputer ? style.zIndex:mobileStyle.zIndex)}" @mousedown.stop.prevent.left="other($event),( isComputer? Clicks($event):mobileClicks($event))" @contextmenu.stop.prevent="other($event),openMenu($event)" @dblclick.stop.prevent="openSetPaneLightboxClose">
        <div class="zm-compoent-lightbox-close"  v-html="settingData.svg.value" :style="{fill:settingData.backgroundColor.value}">
            
        </div>
    </div>
</template>
```
* css如下
 ```css
 .zm-compoent-lightbox-close {
  width: 100%;
  height: 100%;
  svg {
    width: 100%;
    height: 100%;
  }
}
 ```
* data数据如下
```js
data() {
    return {
      id: this.prop.id,
      uid: "",
      inrowlayer: "",
      type: "lightBoxClose",
      style: this.prop.style,
      settingData: this.prop.settingData,
      comName: this.prop.comName,
      keepScaleX: true,
      buttonList: [
        {
          type: "lightboxCloseset",
          title: "设置",
          icon: "icon-shezhi1",
          paneInfo: "图标设置",
          paneTitle: "图标设置",
          paneIcon: "",
          paneHeight:350,
          callback: () => {
            zmEditor.$store.commit("changePaneData", {
              key: "paneType",
              value: true
            });
            zmEditor.$store.commit("changePaneData", {
              key: "paneTitle",
              value: "图标设置"
            });
            zmEditor.$store.commit("changePaneData", {
              key: "paneIcon",
              value: ""
            });
            zmEditor.$store.commit("changePaneData", {
              key: "paneMode",
              value: "/com/lightbox/lightboxset/setComLightboxCloseSetting.vue"
            });
            zmEditor.$store.commit("changePaneData", {
              key: "paneHelpInfo",
              value: " 图标设置"
            });
            
          }
        },
        {
          type: "lightboxcloseplace",
          title: "变更样式",
          icon: "icon-style",
          paneInfo: " 变更图标样式",
          callback: () => {
            zmEditor.$store.commit("changePaneData", {
              key: "paneType",
              value: true
            });
            zmEditor.$store.commit("changePaneData", {
              key: "paneTitle",
              value: "图标样式"
            });
            zmEditor.$store.commit("changePaneData", {
              key: "paneIcon",
              value: ""
            });
            zmEditor.$store.commit("changePaneData", {
              key: "paneMode",
              value: "/com/lightbox/lightboxset/setComLightboxClose.vue"
            });
            zmEditor.$store.commit("changePaneData", {
              key: "paneHelpInfo",
              value: " 变更图标样式"
            });
          }
        },
        {
          type: "lightboxClosePlaceChange",
          title: "图标位置",
          icon: "icon-dingwei",
          paneInfo: "调整图标的位置",
          callback: () => {
            zmEditor.$store.commit("changePaneData", {
              key: "paneType",
              value: true
            });
            zmEditor.$store.commit("changePaneData", {
              key: "paneTitle",
              value: "图标位置"
            });
            zmEditor.$store.commit("changePaneData", {
              key: "paneIcon",
              value: ""
            });
            zmEditor.$store.commit("changePaneData", {
              key: "paneMode",
              value:
                "/com/lightbox/lightboxset/comLightboxCloseSettingPlace.vue"
            });
            zmEditor.$store.commit("changePaneData", {
              key: "paneHelpInfo",
              value: " 调整图标的位置"
            });
          }
        }
      ],
      pattern: [0, 0, 0, 0, 0, 1, 1, 1], //外边框八个点
      isShowRotateBtn: false, //隐藏旋转按钮
      mobileStyle: this.prop.mobileStyle,
      mobileButtonList: [],
      specialTop: false,
      specialBot: false,
      onlydianW_1: 0,
      onlydianW_2: 0,
      onlydianW_3: 0
    };
  },
```
* computed数据如下
```js
computed: {
    setData() {
      return {
        type: "sets",
        props: [
          {
            type: "/set/sliders.vue",
            props: {
              title: "背景颜色",
              attr: "backgroundColor",
              param: "color",
              minVal: 0,
              maxVal: 100,
              value: zmEditor.$store.state.component.selectList[0].settingData.backgroundColor.value,
              decimalNum: 0,
              lastCallback: function() {
                zmEditor.$store.commit("saveOperationToHistory");
              }
            }
          }
        ]
      };
    },
```
`setData() 是灯箱容器的设置项`<br/>
* mounted()里面的内容是编辑器通用的和动态更改组件外框小圆点数据
::: warning 提示
* this.isComputer 是判断是否为pc模式<br/>
* this.settingData.placeIndex.value是当前关闭按钮处在哪个位置
:::
* methods<br/>
`pointDown(data)-----------鼠标按下回调`<br/>
`pointCallBack(string)-----------鼠标移动回调`<br/>
`CloseMouseup(e)-----------设置项第三个按钮调用方法`<br/>
`Clicks(event)-----------单击鼠标左键时调用的方法 打开按钮列表并赋值按钮列表的坐标隐藏打开的弹窗`<br/>
`mobileClicks($event)-----------移动版单击鼠标左键时调用的方法 打开按钮列表并赋值按钮列表的坐标隐藏打开的弹窗`<br/>
`openSetPaneLightboxClose()-------------设置项第二个按钮和双击调用的方法`
::: warning 提示
* this.onlydianW_1、this.onlydianW_2、this.onlydianW_3 是记录鼠标按下的时候关闭按钮的不能移动的点（位置）<br/>
* pointCallBack()中再根据哪个不能移动的点去计算新的left和top<br/>
* 实现的是 关闭按钮在改变大小的时候位置不乱

:::
*****************************
### 3.comLightboxContainer 
* html模板如下
```html
<template>
        <div :id="id" :data-title="'灯箱容器'"   v-if="(isComputer || settingData.mobileComIsHide)" @mouseover="handleEnter" @mouseout="handleLeave" class="zm-component-main" :style="{position: 'absolute',width: ( isComputer ? style.width:mobileStyle.width)+'px',height: ( isComputer ? style.height : mobileStyle.height)+'px',left: ( isComputer ? style.left : mobileStyle.left )+'px',top: ( isComputer ? style.top : mobileStyle.top )+'px'}" @mousedown.stop.left="other($event),mousedown($event)" @contextmenu.stop.prevent="other($event),openMenu($event)" @dblclick.stop.prevent="openSetPaneLightboxcontainer">
            <div v-bind:style="zmComponentLightbox">
                <div  :style="{borderWidth: settingData.borderWidth.value+'px',borderStyle: 'solid',borderColor: '#3089d5', width:'100%',height:'100%',position:'absolute',top:'0',zIndex:'30'}"></div>
                <div class="zm-component-lightbox-bg"  :style="{backgroundColor:settingData.backgroundData.previewData?settingData.backgroundData.previewData.color : rgb}" v-if="settingData.backgroundData.previewData.type=='color'" ></div>
                <div class="zm-component-lightbox-img" v-else-if="settingData.backgroundData.previewData.type=='img'" :style="{backgroundColor:settingData.backgroundData.bottom.color,backgroundImage:settingData.backgroundData.previewData?'url('+settingData.backgroundData.previewData.poster+')' : src}" >
                </div>
                <div class="zm-component-lightbox-video" v-bind:style="zmComponentLightboxVideo" v-show="settingData.backgroundData.previewData.type=='video'">
                    <video autoplay="true" loop="true"  :src="settingData.backgroundData.previewData?settingData.backgroundData.previewData.src : src" :poster="settingData.backgroundData.previewData?settingData.backgroundData.previewData.poster : ''" ref="video" style="width:100%; height:100%;object-fit: fill;position: absolute;
                top: 0;
                zIndex: 12;"></video>
                </div>
                <div class="zm-component-lightbox-shadow"  :style="{backgroundImage:getShadow,backgroundColor:settingData.backgroundData.coverage.color}"></div>
                <p v-show="id == tipsshow" style="width:80px;height:28px;top:-28px; right:18px; text-align: center; color:#fff; line-height:28px; background-color:#3089d5; position:absolute;border-top-radius: 5px; border-left-radius: 5px; ">灯箱容器</p>
                <div class="zm-component-main-container is-container">
                    <component v-for="(item,index) in childData" :is="item.component" :key="item.id" :prop="item" :index="index" @updataMes="updataMes"></component>
                </div>
            </div>
                
        </div>
       
</template>
```
* css如下
 ```css
 .zm-component-main-container {
    width: 100%;
    height: 100%;
    z-index: 50;
    position: absolute;
    top: 0
}
.zm-component-lightbox-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 12;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}
.zm-component-lightbox-img {
  width: 100%;
  height: 100%;
  z-index: 20;
  position: absolute;
  top: 0;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}
.zm-component-lightbox-shadow {
  width: 100%;
  height: 100%;
  z-index: 30;
  position: absolute;
  top: 0;
}

 ```
* data数据如下
```js
data() {
        return {
            id: this.prop.id, //随机ID
            type: "LightboxContainer", //组件类别
            mobileState: "", //手机版组件状态
            mold: "commonContainer", //组件类型(普通组件: commonUnit)(普通容器: commonContainer)(特殊容器: multipleContainer)(其他: 自行定义)
            style: this.prop.style, //组件外层样式
            settingData: this.prop.settingData, //组件设置项数据
            childData: this.prop.childData,
            comName:this.prop.comName,
            rgb: "rgba(51, 136, 255, 0.5)",
            url: "",
            src: "",
            // specialTop: true,//上部特殊按钮   true:显示   false: 不显示
            // specialBot: true,//下部特殊按钮   true:显示   false: 不显示
            zmComponentMain: {
                    width: "100%",
                    height: "100%",
                    left: 0,
                    top: "6%",
                    zIndex: 10,
                    position: "fixed"
                },
                zmComponentLightbox: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0
                },
                zmComponentLightboxVideo: {
                    backgroundImage: "",
                    width: "100%",
                    height: "100%",
                    zIndex: 20,
                    position: "absolute",
                    top: 0,
                    overflow: "hidden",
                    backgroundSize: 'cover',
                    backgroundPosition: "50%",
                    backgroundRepeat: "no-repeat"
                },
            buttonList: [
                {
                    type: "lightboxcontainerSet",
                    title: "灯箱设置",
                    icon: "icon-shezhi1",
                    paneTitle: "灯箱设置",
                    paneIcon: "",
                    paneInfo: " 灯箱设置",
                    callback: () => {
                        zmEditor.$store.commit("changePaneData", {
                            key: "paneType",
                            value: true
                        });
                        zmEditor.$store.commit("changePaneData", {
                            key: "paneTitle",
                            value: "灯箱设置"
                        });
                        zmEditor.$store.commit("changePaneData", {
                            key: "paneIcon",
                            value: ""
                        });
                        zmEditor.$store.commit("changePaneData", {
                            key: "paneMode",
                            value: "/editor/pane/paneSetContent.vue"
                        });
                        zmEditor.$store.commit("changePaneData", {
                        key: "paneHelpInfo",
                        value: " 灯箱设置"
                        });
                    }
                },
                {
                    type: "lightboxBackground",
                    title: "灯箱背景",
                    icon: "icon-color",
                    paneTitle: "灯箱背景",
                    paneIcon: "",
                    paneInfo: " 选择和替换灯箱背景",
                    callback: this.lightboxBackground
                },
                {
                    type: "lightboxContainerPlace",
                    title: "灯箱位置",
                    icon: "icon-dingwei",
                    paneTitle: "灯箱位置",
                    paneIcon: "",
                    paneInfo: "调整灯箱的位置",
                    paneHeight:350,
                    callback: () => {
                        zmEditor.$store.commit("changePaneData", {
                        key: "paneType",
                        value: true
                        });
                        zmEditor.$store.commit("changePaneData", {
                        key: "paneTitle",
                        value: "灯箱位置"
                        });
                        zmEditor.$store.commit("changePaneData", {
                        key: "paneIcon",
                        value: ""
                        });
                        zmEditor.$store.commit("changePaneData", {
                        key: "paneMode",
                        value:
                            "/com/lightbox/lightboxset/comLightboxContainerSettingPlace.vue"
                        });
                        zmEditor.$store.commit("changePaneData", {
                        key: "paneHelpInfo",
                        value: " 调整灯箱的位置"
                        });
                    }
                },
                {
                    type: "style",
                    title: "灯箱样式",
                    icon: "icon-style",
                    paneTitle: "灯箱样式",
                    paneIcon: "",
                    paneInfo: "选择和替换灯箱样式"
                },
                { type: "del", title: "删除", icon: "icon-delete" },
                
            ], //设置按钮列表项
            pattern: [1, 1, 1, 1, 1, 1, 1, 1], //拖拽控制点 1: 显示 0: 隐藏
            mobileFull: true,//标识组件在手机版是否可以左右移动
            isRotate: false, //是否可旋转
            mobileStyle: this.prop.mobileStyle, //手机版样式
            mobileButtonList: [
                // { type: "hide", title: "隐藏", icon: "icon-hide" },
                // { type: "set", title: "设置", icon: "icon-shezhi1" }
            ], //手机版设置项按钮
            mobileChildData: this.prop.mobileChildData, //手机版子组件信息
            _width:0,
            _height:0,
            _left:0,
            _top:0,
            specialTop: false,
            specialBot: false,
            childstyle:[

            ],
        }
    },
```
* computed数据如下
```js
computed: {
        mobileSetData() {
            return {
               
            };
        }, //手机版设置项结构数据 没有可不加
        tipsshow: function(){
            
            if(this.$store.state.component.selectList.length >0){
                 return  this.$store.state.component.selectList[0].id;
            }else{
                return false;
            }
           
        },
        childnum: function(){
            console.log(this.childData.length,'灯箱容器子组件数量>>>>>>>>>>>>>>>>>>')
            return  this.childData.length;
        },
        getShadow() {
            // const textureIndex = this.$store.state.background.settingData.textureLightboxIndex;
            // const depthIndex = this.$store.state.background.settingData.depthLightboxIndex;
            let url = "";
            if (this.settingData.backgroundData.depthIndex === 0) {
                url =
                "url(/static/background/light_0" +
                this.settingData.backgroundData.textureIndex +
                ".png)";
            } else {
                url =
                "url(/static/background/dark_0" +
                this.settingData.backgroundData.textureIndex +
                ".png)";
            }
            return url;
        },
        setData() {
          
            if(this.$store.state.menu.webType == "website" || this.$store.state.menu.webType == "template" ){
                    return {
                        type: 'tabs',
                        props: [
                        {
                            title: '常规',
                            type: 'sets',
                            props: [
                            {
                                type: '/com/lightbox/lightboxset/comLightboxSettingName.vue'
                            },

                            {
                                type: '/com/lightbox/lightboxset/comLightboxSettingConse.vue'
                            },
                            {
                                type: '/com/lightbox/lightboxset/comLightboxSettingTime.vue'
                            },
                            {
                                type: '/com/lightbox/lightboxset/comLightboxSettingChuFa.vue'
                            }
                            ]
                        },
                        {
                            title: '适用页面',
                            type: 'sets',
                            isScroll:false,
                            // mold: 'show',
                            props: [
                            {
                                type: '/com/lightbox/lightboxset/comLightboxSettingPage.vue'
                            }
                            ]
                        }
                        ]
                    }
            }else{
                    return {
                        type: 'tabs',
                        props: [
                        {
                            title: '常规',
                            type: 'sets',
                            props: [
                            {
                                type: '/com/lightbox/lightboxset/comLightboxSettingName.vue'
                            },

                            {
                                type: '/com/lightbox/lightboxset/comLightboxSettingConse.vue'
                            },
                            {
                                type: '/com/lightbox/lightboxset/comLightboxSettingTime.vue'
                            },
                            {
                                type: '/com/lightbox/lightboxset/comLightboxSettingChuFa.vue'
                            }
                            ]
                        },
                        
                        ]
                    }
            }
        },
        lists() {
            // return this.prop.lists;
        },
        ttyy(){
            return this.$store.state.pane.paneData.paneType
        }
    },
```
`getShadow()用于更换子组件容器背景里面的覆盖纹理`<br/>
`childnum 是获取灯箱子组件容器的子组件数目`<br/>
`tipsshow 是计算当前组件的id 根据id去判断html模板中的---灯箱容器p标签显示和隐藏`<br/>
`setData() 是灯箱子组件容器的设置项`<br/>
* mounted()里面的内容是编辑器通用的和video.js的配置更改组件背景设置项数据
* watch <br/>
1."settingData.backgroundData.previewData.src" ---------- video.js的配置更改组件背景设置项数据
2."settingData.backgroundData.isLoopPlay"------------- video.js的配置更改组件背景设置项数据
3."settingData.backgroundData.playbackRate"------------- video.js的配置更改组件背景设置项数据
4."childnum"-------------------根据容器组件子组件数量变化判断是否要调用提示弹窗<br/>
``` js
"childnum":{
                handler:function(n,o){
                    if(o < n){
                        this.$parent.isChildComs = true;
                    }
                },
                deep: true
             }
```
::: warning 提示
* this.isChildComs 是data属性里面声明的一个属性，检测子组件数量，当子组件数量增加时，把父组件（灯箱底层容器）的isChildComs的值改成true
:::
* methods<br/>
`pointDown(data)-----------鼠标按下回调`<br/>
`pointCallBack(string)-----------鼠标移动回调`<br/>
`changeChildStyle(newnum,styleName)------------pointCallBack(string)方法里面调用 用来计算容器组件子组件的left和top`<br/>
`lightboxBackground()-----------设置项第二个按钮调用的方法打开灯箱背景弹窗`<br/>
`openSetPaneLightboxcontainer()------------设置项第一个按钮和双击调用的方法打开灯箱设置弹窗`<br/>
`changeStyleCallback(obj)------------设置项第四个按钮调用的方法（编辑器通用）`<br/>
::: warning 提示
* this._width、this._height、this._left、this._top 是记录鼠标按下的时候容器的宽、高、left、top<br/>
* this.childstyle是一个数组，记录所有子组件鼠标按下时的left和top<br/>
* pointCallBack()中再根据鼠标按下的时候容器的宽、高、left、top和拖动之后容器的宽、高、left、top去计算拖动的距离newnum。再根据拖动的距离newnum去计算新的宽、高、left、top<br/>
* changeChildStyle(newnum,styleName)在pointCallBack()调用用来计算容器组件子组件新的left和top保持位置不变<br/>
* 实现的是 容器组件在拖动的时候两边同时拖动而子组件位置不变
:::
::: danger 警告
* 灯箱底层容器和灯箱子组件容器的html模板data属性css还有一个设置项极为相似，注意不要弄混了
:::
::: tip 提示信息

***内容待添加***


:::