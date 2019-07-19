# 组件控制框

::: tip 
组件控制框（编辑框）主要控制组件以下几项功能：组件旋转、组件伸缩、同步下推、同步拉伸.组件编辑框所在页面层是悬浮于组件所在的编辑页面层的，并以定位形式与组件位置形成包围编辑框.其dom树依据视图及功能需求主要包括：圆点按钮——可拖拽改变组件大小，旋转按钮——可拖拽改变组件旋转角度，特殊按钮（下推/拉伸）——控制组件上下平移以拉伸并同步下推下方组件以保持布局不变，编辑框外边框border.
:::
## 编辑框模板构建
+ 模板文件： \src\components\editor\ctrlBox\ctrlBox.vue

```html
<template>
    <div id="zm-component-editBox" v-if="existSelect" :style="{width: nowStyle.width + 'px',height: nowStyle.height+'px',left: left+'px',top: top+'px',transform: 'rotate('+nowStyle.rotate+'deg)'}">
        <div class="zm-component-box1"> <!--构建8个圆点按钮-->
            <div class="zm-component-dot" v-for="(item,index) of pattern" :key='index' v-show="item == 1" @mousedown.left.stop.prevent="componentResize($event,index)" @contextmenu.stop.prevent="handleRightKey($event)" :style="{cursor: cursors[index]}"></div>
        </div>
        <div class="zm-component-box2" v-show="isShowRotate && showRotateBtn"><!--构建旋转按钮-->
        
            <div class="zm-component-rotate iconfont icon-rotate-left" @mousedown.stop="componentRotate">
                <span v-if="nowStyle.rotate != 0 && nowStyle.rotate != 360 && showCloseRotate" class="zm-component-rotate-close" :style="{transform: 'rotate('+(360 - nowStyle.rotate)+'deg)'}" @mousedown.stop="recoverRotate">
                    <svg width="5" height="5" viewBox="0 0 5 5" class="symbol symbol-rotateCancel">
                        <path d="M4.02 5v-.99h.99V5h-.99zM3.99-.02h.99v.99h-.99v-.99zm-1 3.03h.99V4h-.99v-.99zm0-2.03h.99v.99h-.99V.98zm-1 1h.99v.99h-.99v-.99zM1.02.95h.99v.99h-.99V.95zm-1-1h.99v.99H.02v-.99zM.98 5h-.99v-.99h.99V5zm1-1H.99v-.99h.99V4z"></path>
                    </svg>
                </span>
            </div>
            <div class="zm-component-deg" v-show="moveBoxType===3" :style="{transform:'rotate(-'+nowStyle.rotate+'deg)'}">{{nowStyle.rotate}}&deg;</div>
        </div>
        <div class="zm-component-box3" v-show="((specialTopBtn || specialBotBtn) && showSpecialBtn)">
            <!--构建同步下推按钮-->
            <div :class="{specialBtnforBanner:isBanner,hoverText:hasText && showSpecailTopText}" class="zm-component-special-btn zm-component-special-top" :style="{left:right,zIndex:specialTextZindex}" v-show="specialTopBtn && activeBtn != 'bottom'" 
                @mousedown.stop.prevent="moveSpecialTop" 
                @contextmenu.stop.prevent="handleRightKey($event)"
                @mouseenter.stop.prevent="enterSpecailTop"
                @mouseleave.stop.prevent="leaveSpecialTop"
                >
                <span class="iconfont icon-down"></span>
                <span class="text" v-if="showSpecailTopText">拖动</span>
                <div class="specailInfo" v-show="showSpecailTopText && showTopPanel" :style="{top:`${infoPanelTop.top}px`}">
                    <p>通过此按钮向上或向下改变组</p>
                    <p>件位置，同时保证页面布局</p>
                    <div class="trangle" :class="[`loc-type-${infoPanelTop.type}`]"></div>
                </div>
            </div>
            <!--构建同步下拉按钮-->
            <div :class="{specialBtnforBanner:isBanner,hoverText:hasText && showSpecailBotText}" class="zm-component-special-btn zm-component-special-bot" :style="{left:right}" v-show="specialBotBtn && activeBtn != 'top'" 
                @mousedown.stop.prevent="moveSpecialBot" 
                @contextmenu.stop.prevent="handleRightKey($event)"
                @mouseenter.stop.prevent="enterSpecailBot"
                @mouseleave.stop.prevent="leaveSpecailBot"
                >
                <span class="iconfont icon-shangxiajiantou"></span>
                <span class="text" v-if="showSpecailBotText">拉伸</span>
                <div class="specailInfo" v-show="showSpecailBotText && showBotPanel" :style="{top:`${infoPanelTop.top}px`}">
                    <p>通过此按钮拉长或缩短组件</p>
                    <p>高度，同时保证页面布局</p>
                    <div class="trangle" :class="[`loc-type-${infoPanelTop.type}`]"></div>
                </div>
            </div>
        </div>
        <!--构建编辑框外边框-->
        <div v-show="isShowCtrlBox" :class="getClassByType? 'zm-component-box5':'zm-component-box4'"></div>
    </div>
</template>
```

### 模板data
```js
//下推和下拉按钮以下也共称特殊按钮
data(){
        return {
            showSpecialBtn: true, //控制下推和拉伸按钮的显示与隐藏
            showCloseRotate:true, //控制关闭旋转按钮的显示与隐藏
            dotOne: null, //编辑框在动态改变过程中显示哪个点
            //showInfo: false, 
            showRotateBtn: true, //控制旋转按钮的显示与隐藏
            //sumRotate:0,
            defaultCursor: [ //光标指示矩8个点的可被拉伸方向
                'nw-resize',
                'n-resize',
                'ne-resize',
                'e-resize',
                'se-resize',
                's-resize',
                'sw-resize',
                'w-resize',
            ],
            father:undefined,
            showSpecailTopText:false, //控制特殊按钮-下推的先关提示信息的显示与隐藏
            showSpecailBotText:false, //控制特殊按钮-下拉的先关提示信息的显示与隐藏
            showTopPanel:false, //控制特殊按钮-下推的信息面板的显示与隐藏及position
            showBotPanel:false, //控制特殊按钮-下推的信息面板的显示与隐藏及position
            movingState:false, //下推和拉伸按钮的mousemove状态,此状态下关闭信息提示
            activeBtn:undefined,
            specialTextZindex:null,

        }
    }
```
### 计算属性computed
+ curCom:当前选中组件
+ infoPanelPos：特殊按钮提示面板的位置
+ isBanner：banner组件的特殊按钮设定特殊样式
+ moveBoxType：控制组件在改变大小时实时显示新的宽度和高度
+ right：当组件宽度小于一定值时，特殊按钮的位置
+ cursors:组件在不同旋转角度下各个圆点的光标显示方向；

## 组件旋转

### 物理解析：鼠标点绕组件中心点的圆弧运动
+ main function：componentRotate(e);参数e为事件调用时的event参数；

### 代码片段

``` js
this.hideOtherBtn('rotate')
//旋转时隐藏编辑框的圆点按钮

const prevAngle = Math.atan2(downY - point.y, downX - point.x) - (parseInt(this.nowStyle.rotate) * Math.PI / 180);
//当鼠标按下时，记录此时与中心点形成的水平角度；

curCom.rotateDownCallBack && curCom.rotateDownCallBack();
//鼠标按下时提供给组件的回调接口

if(rotate > 0 && rotate < 4) rotate = 0
if(rotate > 86 && rotate < 94) rotate = 90
if(rotate > 176 && rotate < 184) rotate = 180
if(rotate > 266 && rotate < 274) rotate = 270
if(rotate > 356 && rotate < 360) rotate = 0
//组件旋转过程中在[0,90,180,270]角度边缘形成的整角度吸附效果

this.$store.commit("changeMoveBoxType",3);
//显示旋转角度

curCom.rotateUpCallBack && curCom.rotateUpCallBack();
//鼠标抬起时旋转结束提供给组件的回调接口

this.rotatePosLimit({curCom});//限制组件旋转后不可跨区域

```

## 组件大小改变
::: tip
通过鼠标拖拽编辑框的圆点按钮，可按相应方向改变组件相应的宽度或高.8个圆点从左上角按照顺时针方向给定索引值index依次为0-7;

+ 单边圆点
    + index=1的圆点上下平移
    + index=5的圆点组件拉伸反弹
    + 其他
+ 对角圆点
    - 容器组件——宽度和高度的改变互不影响
    - 其他组件
:::

### 物理解析：鼠标在当前圆点方向上的位移转变为组件相应边长的改变量.

+ main function：componentResize(e,index)；参数e为事件参数，参数index为当前被拖拽的圆点事件对象的索引值；

::: warning
圆点改变组件大小主要经历`两版改革`，当时做第二种改版时，主要是因为某些组件组件的最小值和`高度`是在组件大小改变过程中根据渲染结果得到的，渲染时间的存在会导致组件在最小值处发成抖动现象，而后来组件的`高度`则完全由`纯数据`决定：
    `第一版`编辑器先渲染组件，组件根据渲染的结果再次对组件进行限制并重新渲染，这时由于浏览器渲染时间的存在，会导致组件在最小限制处发生抖动现象。第一种方法以`mixin`混入组件的；
    `第二版`则是编辑器先给定组件一个计算出的可能值，组件通过这些值进行相应的计算并在限制完成后将最终结果统一传递给编辑器，编辑器在进行真正的赋值渲染。此版相应的方法以`es6的类class`来进行输出的；
    `但是`，根据目前对各个组件的最小值的分析，基本上所有的组件的最小值在鼠标按下时即可决定，所以目前看来两种方法其实在功能实现上其实没有差别，但是在`性能`上明显第二种更好些，每一次改变都避免了组件的二次渲染；
    `注：`如果最后仍然保留两种方法，则可将公共部分进行class封装；
    
:::

### 程序流程

<img :src="('../../../images/changeSize.jpg')" alt="the work flow about changeing size">

----

### 代码片段

```js
let {moveMold,bounceLimit} = curCom.pointDown && curCom.pointDown({index}) || {};
//在鼠标按下时获取组件在调用pointDown回调接口返回的组件在该圆点的运动信息
// moveMold:如果为1，则表示该组件的index=1的运动是上下位移；
//bounceLimit:组件在index=5时如果做反弹运动，则限制拉伸反弹距离；该需求已删除

let ctrlCirclelMove = null;
//moveMold为1时预留对象

let specalArr = ["file","questionnaire","selectquestionnaire","photoflow","photoAlbum"];
let isSpecial = specalArr.includes(type) || specalArr.includes(smallType) ? true : false;
//过滤使用第一版方法的组件，并用isSpecial变量表示；
//但是目前看来["file","questionnaire","selectquestionnaire","photoflow","photoAlbum"],组件的最小值都是可以在鼠标按下时获取并做为固定变量使用，完全可以改为第二种方法，组件有时间建议作出更改

if(!isSpecial) 
{
    changesizeTool = new ChangesizeTool();
    changesizeTool.changeSizeInfo.bounceLimit = bounceLimit; 
    //构造第二版组件大小改变工具的对象实例
}

if(moveMold == 1)
{
    ctrlCirclelMove = new CtrlCirclelMove()
    //创建index=1上下位移的相关对象实例，该实例对象原型的相关方法和属性是根据初始需求（相对复杂，包括跨区域跨容器）编译的，新需求相对简单；
    ctrlCirclelMove.getBasicInfo({curCom});
    //获取实例对象基本信息

    ({upDisT,downDisT} = ctrlCirclelMove.moveInfo);
    //upDisT:组件在当前页面区域上下位移时，距离页面顶部可位移的最大距离；
    //downDisT:组件在当前页面区域上下位移时，距离页面底部可位移的最大距离；
}else
{
    if(isSpecial)
    {
        //组件["file","questionnaire","selectquestionnaire","photoflow","photoAlbum"]使用第一版方法，但是建议都改成第二种方法
    }else
    {
        changesizeTool.getBasicVal();
        //获取组件初始信息
        changesizeTool.getChildDelta({index,curCom});
        //如果组件有子组件，获取子组件与父组件的间距，以显示父组件的改变量

        changesizeTool.getDotpos(index);
        //获取当前点及对角点的初始left，top,旋转后的left，top，
        _index = changesizeTool.getDerection();
        //_index用来判断鼠标拖拽圆点时改变量真正作用的方向

        //get limit/*******************/
        if(!isComputer) changesizeTool.reserveLimit({curCom,index});
        //移动端添加最小20px保留在编辑器限制

        if([0,2,4,6].indexOf(index) >= 0)
        {
            changesizeTool.getScaleMax({curCom,index});
            //对角点的最大改变限制，不可超过当前页面区域
        }else{
            changesizeTool.getSingleMax({curCom,index});
            //单边点的最大改变限制，不可超过当前页面区域
        }
    }
}

//curCom.pointCallBack:mousemove时供给组件的回调接口

if( [0,2,4,6].includes(index) ) 
{
    changesizeTool.getScaleCurrentSize({dex,dey,mex,mey,curCom,index,_index,changesizeTool,moveMold});
    //拖拽对角点改变组件大小方法
}else 
{
    let inc = changesizeTool.getMoveDistance({dex,dey,mex,mey,index,_index});
    //inc:鼠标在当前点的方向上位移改变量
    changesizeTool.getSingleCurrentSize({dex,dey,mex,mey,inc,index,curCom,changesizeTool,moveMold});
    //拖拽当前点改变组件大小的方法
}

```

## 特殊按钮

::: tip
同步下推按钮功能类似于`多米诺骨牌效应`，初始组件在下移过程中，位于组件下方并与组件在水平方向相交的组件进行下移，同时这些下移的组件在运动过程中又使其下方与其水平相交的组件下移，依次类推，从而保证在每一时刻的运动过程中，所有与运动组件水平相交下方组件都依次下移；组件的下移分为两种：`吸附性移动`和`条件性移动`
:::

+ 吸附性移动：运动组件与下方相交组件间距小于等于`70px`时，下方组件与运动组件保持同步移动；并当运动组件上移时，不存在障碍组件下，回到初始位置后会继续随运动组件一起上移；

+ 条件性移动：运动组件与下方相交组件间距大于`70px`时，只有当运动组件运动到与下方组件的间距小于等于`10px`时，下方组件才会随着运动组件继续下移，但是在上移过程中，回到初始位置后停止，并不会随运动组件继续上移；

### 物理解析：
+ 简单抽象即为在每一时刻下，运动组件的位移和相应的被动组件与其的初始距离的差值转化为被动组件的位移；

+ main function：moveSpecialTop(e)；

### 程序流程：
1. `构造数据结构`：由于运动组件是在不断运动的过程中推动下方组件下移的，下方组件是否运动以及运动多少所需要的相关信息数值各自都是不同的，所以在初始和运动过程中在组件身上挂载所需要的中间字段，以对象表示，并在鼠标抬起运动结束时删除挂载的字段，以免保存到数据库造成不必要的内存浪费。中间字段如下：
    
    ```js
    pushDown = { 
            isPushing,//Boolean,default-fault;组件如果已经移动则为true；
            origiTop,//组件的初始top；
            pushType，//Number,组件的下移类型，由与上方组件的初始间距决定，初始间距>70,则值为2，否则为1；default-2;
            origiHeight,////组件的初始height
            upPushCom,//Object,将推动组件运动的上方组件的相关信息，default-null,数据形式为-{id:"",pushDown:pushDown}
            upDisT,//Number,组件与上方组件的初始间距，defaul-null,
            hasBalk,//Boolean,组件在运动上移的过程中是否存在障碍，遇到障碍则立即停止，不再跟随上方组件运动,default-false;
            upBalk,//Object,记录障碍的相关信息，default-Boolean,数据形式：{balkId:"",balkType:1->stick,2->push,3->equal with curCom.top,balkDist:与障碍组件的原始距离}
            equalCurComTop,//Boolean,default-false,是否和当前组件相同高度
            isParent,//Boolean,default-false,是否是根运动组件的父组件,用来判断当前组件被下推时改变height还是top；
            specialBtn,//Boolean,default-false,同步下推和同步拉伸共用一套方法，判断是否是下拉按钮事件
            inPushing,//Boolean,default-false,组件是否在当前运动组件队列里；
            minHeight:0,//parent balk;
        }

    otherInfo = {
            inQueue,//Boolean,default-false,数据展开时使用，是否在当前可被下推队列,
            isParent,//Boolean,default-false,
            layer,//Number,default-1(父组件为bodyRow,headRow,footRow),父子嵌套组件时组件所在的层级
            pId,//String,default-0,组件的parent id,没有父组件为0
            notChangeHeight,//Boolean,deault-false,当前被下推组件是父组件但是该组件并不改变height而是改变top,目前只用于单列横条的形式
            pageIndex,//Number,default-1,轮播组件各页的页面索引,其余所有组件的页面索引都是1
        }  

    ```

2. `鼠标按下时记录组件间相互的递推关系`：包括：初始间距、下移类型、障碍存在、初始高度和初始top等；

3. `组件下移`：
    1. `构造`运动组件队列,默认为[当前事件源组件及鼠标拖拽的组件].
    2. `遍历`运动组件队列，对于每一个运动组件都去判断是否已经达成条件能够开始下推或继续下推下方的组件（此时下方组件可能已经存在运动队列里）.
    3. 将新被推动的组件`添加`到运动队列里.
    4. 对运动组件队列进行`去重`处理，

4. `结束运动`：鼠标抬起结束运动后，删除挂载在组件身上的中间字段. 方法：returnState().



































