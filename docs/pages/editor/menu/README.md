# 头部菜单栏

## 换肤
:::tip
换肤功能通过给定的颜色列表选项可以切换不同的颜色作为网页的主题色，并同时使围绕主题色进行深浅变化的相关颜色发生改变，实现网页肤色的灵活切换.
:::

### 实现原理：
+ 换肤功能的实现主要基于`less`的带参混合原理————定义需要变化的主色参数变量，像函数一样，再定义一个带有这些参数的属性集合，然后在相关的class里进行调用，并传递不同的参数值，即可实现不同的肤色转化.

+ less文件：`src\style\base\common.less`

+ 主色变量：
    - @baseColor：`主色调 `
    - @baseColorDeep1：`主色调 深+1`
    - @baseColorLight1：`主色调 浅+1`
    - @baseColorLight2：`主色调 浅+2`
    - @baseColorLight3：`主色调 浅+3`
    - @baseColorLight4：`主色调 浅+4`
    - @baseColorLight5：`主色调 浅+5`
    - @baseColorLight6：`主色调 浅+6`
    - @baseColorLight7：`主色调 浅 5%`
    - @baseColorLight8:rgba(48,137,213,.05); `主色调 5% 组件背景hover色 必须是rgba形式否则会伪元素覆盖组件`
    - @baseColorLight9:rgba(48,137,213,.2);  `主色调 20% bodyRow的禁止区域色 必须是rgba形式否则会伪元素覆盖组件`


## 编辑模式切换

:::tip
建站编辑模式主要有PC端和移动端两种，通过点击顶部菜单栏的图标按钮可进行两种模式的相互切换.

+ `PC mold`：此模式用来进行PC端网页构建，可以灵活自由地对左侧组件列表中拖出的组件做任意排版布局，从而达到想要的网页效果.

+ `Mobile mold`：此模式模拟mobile端网页构建，对PC端已存在的组件进行不同的布局处理.由于mobile模式下的编辑区相对来说非常狭窄，并且切换到mobile模式时已存在的组件可能很多，因此，为了方便用户在移动端的编辑操作，在切换移动端时主要做以下处理：
    - `保留`已经在移动端做过处理的组件的位置信息
    - `清除`已经不存在的移动端组件的位置信息
    - `添加`新拖出的未切换过移动端的组件的位置信息    
:::

+ JS文件：\src\common\switch.js
+ main function：initSwicth();

### 程序设计
1. 页面加载时获取当前页面已保存的组件的位置信息数据
2. 筛选当前页面已经被删除的组件数据和新增加的组件数据
3. 清除已删除的组件占位并且将新添加的组件插入到已有的组件序列中
4. 页面销毁时保存数据

### 代码片段
+ `切换到移动端功能是以es6的类进行模块化处理的.`
```js
//computerEditor loading 
//加载页面时获取当前页面的历史mobile信息
let switchPC = new SwitchTool();
switchPC.savecomMobCurData();

//记录当前页面组件mobile信息
let switchPC = new SwitchTool();
switchPC.saveComponentMold({isSwitch:true});

//mobile created调用入口js
created(){
    this.$nextTick(()=>{//必须加nextTick(),在switch里调用了watch;
        let switchTool = new SwitchTool(); 
        switchTool.initSwicth();
    });
},

//切换到移动端的class类

class PushTool extends ChangeHeightTool{
    //继承：组件高度改变后同步下推
};

class DelTool extends HideTool{
    //继承：组件隐藏后的同步上移
}

export default class SwitchTool {
    constructor(){
        //数据构建
        this.switchData = {
            dt:10, //Number:组件纵向排列时上下间距默认10px;
            dm:10, //Number:父子嵌套组件横向间距,默认10px;
            scale:1, //Number:待定预留项,组件按pc端大小缩放显示到移动端的比例
            rowName:"",//String:组件所在的页面区域：headRow,bodyRow,footRow
            headRowComs:[],//Array:存放所有页头区域的组件列表
            bodyRowComs:[],//Array:存放所有页肚子区域的组件列表
            footRowComs:[],//Array:存放所有页尾区域的组件列表
            contentWidth:zmEditor.$store.state.mobile.contentWidth,//Number:当前mobile editor的宽度
            //update和watched做容错处理，避免组件某些原因出错导致达不成mobile watch的执行条件而不会执行移动端切换方法；此时执行定时器。
            upDated:false, //Boolean:判断是否执行定时器方法，default-false,
            watched:false, //Boolean:判断是否执行watch方法，default-false,
            headRowAddComs:[],//Array:存放页头新加组件信息列表
            headRowDeleteComs:[],//Array：存放页头被删除组件信息列表
            //headRowChangeComs:[],
            bodyRowAddComs:[],//Array:存放页肚子新加组件信息列表
            bodyRowDeleteComs:[],//Array:存放页肚子被删除组件信息列表
            //bodyRowChangeComs:[],
            footRowAddComs:[],//Array:存放页尾新家组件信息列表
            footRowDeleteComs:[],//Array:存放页尾被删除组件信息列表
            //footRowChangeComs:[],
            webType:zmEditor.$store.state.menu.webType,//当前网站模式-component,website,template
        };
        this.lastRowList = { //save last mobileEditor的组件数据；
            headRowList:[],//已存储的页头组件信息列表
            bodyRowList:[],//已存储的页肚子组件信息列表
            footRowList:[],//已存储的页尾组件信息列表
        };
        this.lastRowBotMar = {
            headRowBotMar:10,//已存储的页头底部距离最低端组件的间距
            bodyRowBotMar:10,//已存储的页肚子底端距离最低组件的间距
            footRowBotMar:10,//已存储的页尾底端距最低组件的间距
        }
    }

    initSwicth(){ //入口js
        this.handleSwitch({changePage:false}); //处理页面数据
        let switchWatch = zmEditor.$refs["main"].$refs["pageBox"].$refs["editor"]
        .$watch("comUpdatedNum",(newVal,oldVal)=>{ //监控组件的渲染状态
            if(!this.switchData.watched) //如果定时器程序已经执行，则以下代码程序停止执行
            {
                //页面组件总数
                let allCom = [...this.switchData.headRowComs,...this.switchData.bodyRowComs,...this.switchData.footRowComs];
                let allComNum = allCom.filter((item)=>{
                    return !item.toMobileData.exclude;
                }).length;
                console.log(allComNum,"allComNum");
                console.log(newVal,"newVal");
                //newVal已经渲染完成的页面组件数
                if(newVal >= allComNum)
                {
                    zmEditor.$store.state.mobile.waitSort = false;
                    this.switchData.watched = true;
                    this.componentSort();//组件排序js
                    if(switchWatch) switchWatch();
                }
            }
        },{
            immediate:true 
        });

        setTimeout(()=>{//当组件渲染完成状态传递错误导致watch里的代码不能执行时执行定时器
            console.log(this.switchData.upDated,"setTimeout----this.upDated");
            if(!this.switchData.upDated){
                this.handleSwitch({changePage:false});
                this.componentSort();
                zmEditor.$store.state.mobile.waitSort = false;
            }
        },10000)
    }

    //处理页面组件数据
    getAllRowComs({list,rowName,changePage}){
        this.switchData[`${rowName}Coms`] = [];
        let params = {list,layer:0,unionId:0,unionType:null,pId:0,pType:null,pageIndex:-1,isMobile:false,columnMargin:-1};
        this.spreadData(params,rowName); //构建组件数据

        this.changeMaxLayer({list},rowName);//获取组件的最大层级

        this.compareData({rowName,changePage});
        //筛选新添加的和已删除的组件
       
        this.spreadData({list,isChangeState:true,pState:0,pCMinTop:0,pCMaxBot:0},rowName);
        //改变组件特定状态
        this.changeWidth(rowName);
    }

    //排序入口js
    componentSort(){
        this.switchData.upDated = true;
        zmEditor.$nextTick(()=>{
            this.updateNewData("headRow"); 
            //在处理组件高度前，先同步pc端设置项改变后组件最新的高度信息
            this.handleHeight("headRow"); 
            //处理组件的删除或者新加组件后的新高度
            this.handleTop("headRow");
            //组件高度处理完成后，对组件进行排序
            this.updateNewData("bodyRow");
            this.handleHeight("bodyRow");
            this.handleTop("bodyRow");
            this.updateNewData("footRow");
            this.handleHeight("footRow");
            this.handleTop("footRow");

            zmEditor.$store.commit('changeSelectList', null);//切换到移动端后默认不选中任何组件
            
            console.log("%c componentSort++++","fonts-size:40px;")
            zmEditor.$store.commit('saveHistoryAfterComponentSortCompelete',this.switchData);
            //记录切换后组件的数据信息
        });
    }

    //处理组件高度js
    handleHeight(rowName){
        let sortList = this.switchData[`${rowName}Coms`];
        this.getUpTopCom({isMobile:false,sortList},rowName);
        //获取组件pc端排序序列
        this.handleParentMar(rowName);
        //获取父组件与其top值最大的子组件的底边的间距
        
        if(!sortList.length) return; 
        for(let i=0;i<sortList.length;i++)
        {
            let item = sortList[i];
            let toMobileData = item.toMobileData;
            let maxLayer = toMobileData.maxLayer;
            let unionId = toMobileData.unionId;

            if(maxLayer>1)
            {
                let rootHeight = item.mobileStyle.height;
                let rootCMintop = toMobileData.cMinTop;
                let rootCMaxBot = toMobileData.cMaxBottom;
                this.changeLayerHeight({allList:sortList,maxLayer,unionId,rootHeight,rootCMintop,rootCMaxBot},rowName);
                //处理层级嵌套组件的各层级的高度
            }
        }
    }

    //处理组件top的js
    handleTop(rowName){
        let list =  this.switchData[`${rowName}Coms`];

        let unionCom = list.filter((item)=>{
            return item.toMobileData.pId === 0;
        });
        //处理最外层的（父容器为bodyrow/headRow/footRow）的组件位置排序

        let addList = this.switchData[`${rowName}AddComs`].filter((item)=>{
            return item.toMobileData.pId == 0;
        });
        //新增组件

        this.handleAdd({addList,unionCom});
        //处理新增组件的位置

        list.forEach((item)=>{
            item.settingData.toMobileData.saveMold = false;
            item.settingData.saveMold = false;
        });
        //all the field 'saveMold' is false after switcing mobile;

        this.handleRowMar({addList,unionCom,rowName});
        //如果新增组件在父组件的最顶部和最底部则父组件与top最大和最小的子组件的间距改为默认值10px；

        this.changeRowHeight(rowName);
        //改变当前页面区域的高度:headRowH/bodyRowH/footRowH
        
        this.deleteFields(rowName);
        //删除构建组件数据所添加的字段以免浪费不必要的内存
    }
}

```



## 页面切换
