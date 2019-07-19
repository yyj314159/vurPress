# 辅助线

## 标尺辅助线

页面顶端的标尺是一个绝对定位的图片,点击会生成纵向的辅助线,两侧有调节页面宽度的按钮,页面宽度可调节的值在 1024 ~ 1300 之间.调节的同时,也会同步更新内容区距浏览器边距的距离(pageStore -> marginLeft),便于其他地方的计算.

点击生成的辅助线也要参与移动辅助线的计算中.

## 移动辅助线
:::tip
移动辅助线在组件`移动`过程中产生，显示在组件即将接近的页面元素对象的边缘（如正在接近的另一个组件），并且对正在移动的组件在间距`6px`以内（包括6px）产生`吸附`作用，从而确保了在动态页面构建中`页面布局的工整性`.
:::

+ 移动辅助线的两种形式
    - 水平辅助线
    - 垂直辅助线

+ 可产生辅助线的对象
    - 标尺辅助线
    - 页面组件
    - 页面中心线

+ 代码文件：
    - \src\common\auxiliary.js
    - \src\components\editor\auxiliaryLine\AuxiliaryLine.vue

+ main function：mousedown(e)——组件的mousedown事件

### 程序流程

1. `构造数据`：
    ```js
    $store.state.page.auxiliaryLines:[
            {"height":300,"width":1,"left":100,top:200},/*垂直辅助线*/
            {"height":500,"width":1,"left":600,top:500},
            {"height":1,"width":400,"left":300,top:400},/*水平辅助线*/
            {"height":1,"width":100,"left":700,top:600}
        ],
    //$store.state.page.auxiliaryLines：辅助线数组，数组里每一个对象代表一条辅助线
    ```
2. 鼠标按下时清空辅助线数组，并获取所需要的静态数据，以供鼠标移动时生成辅助线时使用.
    - bodyMarL: `Number:页面距窗口左侧距离——marginLeft`
    - adjustT: `Number:组件当前所在页面区域距窗口顶部的距离`
    - resultLine:`Array:存在可生成辅助线的数组` 
    - computerMold: `Booean:当前所在的编辑模式，true-computer,false-mobile`
    - disNum: `Number:x吸附距离`
    - isChild: `Boolean:组件是否位于容器内`
    - parentCom: `Object:当前组件的父组件`
    - curCom: `当前移动的组件`
    - innerSelected: `Array:多选组件内的组件id数组`
    - unionId: `String:层级嵌套组件的最外层组件的id`
    - layer: `层级嵌套组件所在的层级`
    - moveComId: `String: 当前移动组件的id，主要应用于单列横条组件`

3. 在每一次鼠标移动都先清空辅助线数组，再在当前移动事件中计算出所有能够生成的辅助线存入辅助线数组，从而保证在组件在移动过程中，生成的辅助线实时更新.

4. 鼠标抬起时清空辅助线数组，结束事件.

### 代码片段

```js
this.getAuxiliaryInfo(this,{comType,comId});//计算辅助线前获取相应信息

zmEditor.$store.commit("changeCurComMoveBox",false);//控制当前鼠标按下的组件的蓝色移动框只有在移动时才显示；

//移动辅助线初始化
zmEditor.$store.commit("changeMoveBox", []); //清空移动蓝色外边框
zmEditor.$store.commit("changeShowMoveBox", true); //显示移动框
zmEditor.$store.commit("changeMoveBoxType", 2); //移动时显示移动的位置x,y
zmEditor.$store.commit("changeAuxiliaryType", { 
    "type": "head",
    "value": false
});
// 页头中心线产生辅助线的外框
zmEditor.$store.commit("changeAuxiliaryType", {
    "type": "body",
    "value": false
});
// 页肚子中心线产生辅助线的外框
zmEditor.$store.commit("changeAuxiliaryType", {
    "type": "foot",
    "value": false
});
// 页尾中心线产生辅助线的外框

if (movX !== downX || movY !== downY) {
    _this.$nextTick(()=>{
        //放到nextTick里为了子banner的$parent渲染
        _this.createAuxiliary();
    })
}
//移动时产生辅助线
zmEditor.$store.commit('changeShowAuxiliary', true)
//显示辅助线
```







