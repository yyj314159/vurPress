# PC
:::tip 说明
PC 端有ctrl 多选和划选区多选

## PC 划选区多选<br> 
&nbsp;&nbsp;&nbsp; 1 鼠标点击拖动会出现一个蓝色的选区 <br>
&nbsp;&nbsp;&nbsp; 2 选区只要是碰到,在组件的范围内的,该组件都被选中<br>
&nbsp;&nbsp;&nbsp; 3 设置组件高亮,获取选中的组件循环添加 `outline`属性<br>
&nbsp;&nbsp;&nbsp; 4 设置最小选区范围 <br>
&nbsp;&nbsp;&nbsp; 5 判断组件的组合模式,取消组合的状态为单个组件的移动在`mixin.js` `mousedown`中做处理,组合组件的移动在 `innerSelected.vue` 中做了处理 <br>


## PC ctrl 多选
&nbsp;&nbsp;&nbsp; 1 按下ctrl点选组件 <br>
&nbsp;&nbsp;&nbsp; 2 ctrl按下状态在public.js中记录 当keyup的时候将状态改为false <br>
` case 17: //ctrl+`<br>
`e.preventDefault();`<br>
`zmEditor.$store.state.component.isCtrlEntry = true;// ctrl 键按下的状态`<br>
`zmEditor.$store.state.multipleSelectCom.ctrlLock = true;// 组合状态`<br>
`break;`
<br>
&nbsp;&nbsp;&nbsp; 3 根据选中的组件设置最小范围<br>
&nbsp;&nbsp;&nbsp; 4 判断组件的组合模式,取消组合的状态为单个组件的移动在mixin.js mousedown中做处理,组合组件的移动在 innerSelected.vue 中做了处理 <br>
:::

### bodyRow.vue
:::tip 说明
**`comHeightLight` 方法 判断那些组件在选中区域的范围内并高亮显示**<br>
**`this.$store.state.multipleSelectCom.selectList` 在 `multipleSelectCom` 中的`selectList`存储被选中的多选组件**<br>
**`this.$store.state.multipleSelectCom.selectListSet` 在 `multipleSelectCom` 中的`selectListSet`存储被选中的多选组件,主要功能是在ctrl多选时进行去重**<br>

:::
```js
// 多组件选择
comSelected(e) {
    // 鼠标点击时,初始化参数
    this.init();
    // 获取鼠标点击的坐标
    this.x1 = parseInt(e.pageX);
    this.y1 = parseInt(e.offsetY);
    let cliy = parseInt(e.pageY);
    this.x = this.x1;
    this.y = this.y1;

    let scrollInit = document.getElementById("zm-main").scrollTop;
    // 鼠标移动
    document.onmousemove = e => {
        //  鼠标移动且左键点击
        if (e.which == 1) {
        this.outIsShow = true;

        // 获取鼠标当前位置的坐标
        this.x2 = parseInt(e.pageX);

        let cliy2 = parseInt(e.pageY);
        let cony = parseInt(cliy2) - parseInt(cliy);

        let cliM = parseInt(e.pageY) + parseInt(20);
        if (cliM > document.documentElement.clientHeight) {
            cony = cony + parseInt(20);
            document.getElementById("zm-main").scrollTop =
            document.getElementById("zm-main").scrollTop + parseInt(20);
        } else if (
            cliy2 < 50 &&
            document.getElementById("zm-main").scrollTop != 0
        ) {
            cony = cony - parseInt(20);
            document.getElementById("zm-main").scrollTop =
            document.getElementById("zm-main").scrollTop - parseInt(20);
        }

        this.y2 =
            parseInt(this.y1) +
            parseInt(cony) +
            document.getElementById("zm-main").scrollTop -
            scrollInit;
        let zx,
            zy = 0;
        if (this.x2 > this.x1) {
            this.x = this.x1;
            zx = this.x2;
        } else {
            this.x = this.x2;
            zx = this.x1;
        }
        if (this.y2 > this.y1) {
            this.y = this.y1;
            zy = this.y2;
        } else {
            this.y = this.y2;
            zy = this.y1;
        }

        this.w = Math.abs(parseInt(this.x1) - parseInt(this.x2));
        this.h = Math.abs(parseInt(this.y1) - parseInt(this.y2));
        this.comHeightLight(this.x, this.y, zx, zy);
        }
    };
    document.onmouseup = () => {
        this.outIsShow = false;
        if (this.$store.state.multipleSelectCom.selectList.length == 1) {
            zmEditor.$store.state.multipleSelectCom.inIsShow = false;
            this.$store.commit("changeSelectList",this.$store.state.multipleSelectCom.selectList[0]);
            zmEditor.$store.state.multipleSelectCom.selectList[0].other();
            // 显示按钮列表
            zmEditor.$store.commit("switchBtnType", "unitMenu");
            // 显示边框
            zmEditor.$store.commit("changeCtrlBoxMode", true);
            this.$store.commit('setSelectList',[])
            this.coms = [];
        } else if (this.$store.state.multipleSelectCom.selectList.length > 1  ) {
            zmEditor.$store.state.multipleSelectCom.inIsShow = true;
            // 显示按钮列表
            zmEditor.$store.commit("switchBtnType", "unitMenu");
            // 显示边框
            zmEditor.$store.commit("changeCtrlBoxMode", false);
            zmEditor.$store.commit( "setSelectComBorder",this.$store.state.multipleSelectCom.selectList);
            // 设置多选数组信息
            zmEditor.$store.commit("setArrInfo", this.$store.state.multipleSelectCom.selectList);
            // 设置inner选中框的大小
            zmEditor.$store.commit("innerSelected");
            // selectListSet > 1  当前选中组件为 innerSelected
            if (zmEditor.$store.state.multipleSelectCom.selectList.length > 1) {
                zmEditor.$store.commit('setInnerSelected');
            }
            // 设置当前选中的组件 为inner
            zmEditor.$store.commit('changeSelectList',zmEditor.$refs["editor"].$refs["bodyRow"].$children.find(item => {return item.$el.id == "bodyId";}))
        }

        document.onmousemove = null;
        document.onmouseup = null;
    };
},
```
#### comSelected
**蓝色选区:**<br>
    comSelected()方法中鼠标点击 body head or  foot<br>
   &nbsp;&nbsp;&nbsp; _1. 获取鼠标点击的坐标_<br>
   &nbsp;&nbsp;&nbsp; _2. 向下拖动时,在滚动条允许的范围内向下移动当鼠标移动到底部时,自动滚动+20px_<br>
   ```js
    if (cliM > document.documentElement.clientHeight) {
            cony = cony + parseInt(20);
            document.getElementById("zm-main").scrollTop =
            document.getElementById("zm-main").scrollTop + parseInt(20);
        } else if (
            cliy2 < 50 &&
            document.getElementById("zm-main").scrollTop != 0
        ) {
            cony = cony - parseInt(20);
            document.getElementById("zm-main").scrollTop =
            document.getElementById("zm-main").scrollTop - parseInt(20);
        }

   ```
   #### comHeightLight
   &nbsp;&nbsp;&nbsp; 3.移动得到蓝色选区的宽高<br>
   **组件高亮**
   _comHeightLight() 蓝色选区选中的组件高亮_
   ```js
    /**
         * @param y 选中区域的 y 坐标
         * @param x 选中区域的 x 坐标
         * @param w 选中区域的 w 宽度
         * @param h 选中区域的 h 高度
         * @description 选中的组件高亮
         */
        comHeightLight(x, y, x2, y2) {
            zmEditor.$store.commit("clearSelectComBorder", this.arr);
            this.$store.commit('setSelectList',[])
            //   this.$store.state.multipleSelectCom.selectList = [];
            this.getSelectCom("head", x, y, x2, y2);
            this.getSelectCom("body", x, y, x2, y2);
            this.getSelectCom("foot", x, y, x2, y2);
        },
   ```
   #### getSelectCom
   :::tip 说明
   &nbsp;&nbsp;&nbsp;1.获取选中的组件 getSelectCom() 取得当前区域内的所有组件循环判断组件是否在蓝色选取范围内<br> 
     <font size=3 color=pink>
     __不在选中范围内的情况有四种:<br> 
     &nbsp;&nbsp; 1. 选中区域的最大x值 < 组件的x<br> 
     &nbsp;&nbsp; 2. 组件的最大x值 > 选中区域的x<br> 
     &nbsp;&nbsp; 3. 组件的最大y值 <选中区域的 y<br> 
     &nbsp;&nbsp; 4. 选中区域的最大y<组件的y__ 
     </font>
   ::: 
   ```js
    /**
    * @param x  选中区域的最小x  横坐标
    * @param y  选中区域的最小y  纵坐标
    * @param x2 选中区域的最大x2 横坐标
    * @param y2 选中区域的最大y2 纵坐标
    * @param type
    * @description 获取选中的组件放入 selectLists 多组件选择的数组中
    */
    getSelectCom(type, x1, y1, x2, y2) {
        let arr = this.getComByType(type);
        arr.forEach(ele => {
            let style = ele.style;
            let w = style.width;
            let h = style.height;
            let x = style.left;
            let y = style.top;
            // 获取实际中组件的x,y 坐标值
            let info = this.getSelectComXY(type, x, y);
            // 获取组件的最大x,y
            let cx = info.x - 0 + w;
            let cy = info.y - 0 + h;
            x = info.x;
            y = info.y;

            // 如果组件旋转,获取旋转后的最小矩形的坐标以及宽高
            let point = null;
            if (style.rotate > 0) {
            point = style.rotate;
            }
            let options = {
            x: x,
            y: y,
            width: w,
            height: h
            };
            let infoPiont = this.transform(options, point);

            if (infoPiont) {
            x = infoPiont.left;
            cx = infoPiont.right;
            y = infoPiont.top;
            cy = infoPiont.bottom;
            } else {
            cx = parseInt(x) + parseInt(w);
            cy = parseInt(y) + parseInt(h);
            }
            // 判断组件是否在选中范围之内
            // (不在选中范围内的情况有四种 1 选中区域的最大x值 < 组件的x 2 组件的最大x值 > 选中区域的x 3 组件的最大y值 <选中区域的 y 4 选中区域的最大y<组件的y)
            if (x2 < x || cx < x1 || cy < y1 || y2 < y) {
            console.log("this com  is not selected");
            } else {
            // 在选中范围内的存放到选中selectLists 多组件选择数组中
            this.$store.commit("setSelectList", ele);
            this.$store.commit("setArrx", x);
            this.$store.commit("setArrx1", cx);
            this.$store.commit("setArry", y);
            this.$store.commit("setArry1", cy);
            }
        });
    },
   ```
   #### getSelectComXY
   :::tip 说明
   getSelectComXY() 根据selectFrom 获取组件在页面上所属的坐标
   :::
   ```js
    /**
    * @param x 选中组件的x坐标
    * @param y 选中组件的y坐标
    * @description 每个组件实际的坐标
    */
    getSelectComXY(selectFrom, x, y) {
        let selInfo = new Object();
        switch (selectFrom) {
            case "head":
            selInfo.x = x - 0 + this.getEditorX();
            selInfo.y = y - this.headRowH;
            break;
            case "body":
            selInfo.x = x - 0 + this.getEditorX();
            selInfo.y = y;
            break;
            case "foot":
            selInfo.x = x - 0 + this.getEditorX();
            selInfo.y = y + this.height;
            break;
            default:
            break;
        }
        return selInfo;
    },
   ```
#### transform
:::tip 说明 transform()
组件旋转计算旋转后最小矩形的坐标以及宽高
::: 
```js
/**
    * [transform]
    * @param  {[type]} options [{x, y, width, height}]
    * @param  {[type]} angle   [旋转角度]
    * @return {[type]}         [{point, left, right, top, bottom, width, height]
    * @description 旋转后计算最小矩形的坐标以及宽高
  */
transform(options, angle) {
    const { x, y, width, height } = options;
    const r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
    const a = Math.round((Math.atan(height / width) * 180) / Math.PI);
    const tlbra = 180 - angle - a;
    const trbla = a - angle;
    const topLeft = {
        x: parseInt(x + width / 2 + r * Math.cos((tlbra * Math.PI) / 180)),
        y: parseInt(y + height / 2 - r * Math.sin((tlbra * Math.PI) / 180))
    };
    const topRight = {
        x: parseInt(x + width / 2 + r * Math.cos((trbla * Math.PI) / 180)),
        y: parseInt(y + height / 2 - r * Math.sin((trbla * Math.PI) / 180))
    };
    const bottomRight = {
        x: parseInt(x + width / 2 - r * Math.cos((tlbra * Math.PI) / 180)),
        y: parseInt(y + height / 2 + r * Math.sin((tlbra * Math.PI) / 180))
    };
    const bottomLeft = {
        x: parseInt(x + width / 2 - r * Math.cos((trbla * Math.PI) / 180)),
        y: parseInt(y + height / 2 + r * Math.sin((trbla * Math.PI) / 180))
    };
    const minX = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
    const maxX = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
    const minY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
    const maxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
    return {
        point: {
        topLeft,
        topRight,
        bottomLeft,
        bottomRight
        },
        width: parseInt(maxX - minX),
        height: parseInt(maxY - minY),
        left: parseInt(minX),
        right: parseInt(maxX),
        top: parseInt(minY),
        bottom: parseInt(maxY)
    };
},
```
#### setSelectList
:::tip 说明  setSelectList
this.$store.commit("setSelectList", ele); 在multipleSelectCom.js中的selectList (多选数组)赋值
:::
```js
/**
*  selectListSet 数组赋值(主要是多选数组去重)
* @param {*} state 
* @param {*} com 
*/
setSelectListSet(state, com) {
    if (com && com.length != 0) {
        if (com instanceof Array) {
            state.selectListSet.clear();
            com.forEach(element => {
                state.selectListSet.add(element);
            })
        } else {
            if (state.selectListSet.has(com)) {
                state.selectListSet.delete(com);
            } else {
                state.selectListSet.add(com);
            }
        }
    }
},
```
 


### computerEditor.vue
:::tip 说明
**_computerEditor_  watch中监听selectList的变化并重新绘制innerSelected的inner框大小**
:::

```js
selectList(value, oldVal) {
                
    if (value.length == 0) {
        
        if (oldVal.length > 1 
        && zmEditor.$store.state.component.isLock == true 
        && zmEditor.$store.state.preventComKeyEvent) {
            //隐藏边框
            zmEditor.$store.commit("changeCtrlBoxMode", false);
            switch (zmEditor.$store.state.component.selectFrom) {
                case 'headRow':
                    zmEditor.$store.commit('changeSelectList', zmEditor.$refs[
                        "editor"
                    ].$refs["headRow"].$children.find(item => {
                        return item.$el.id == "headerId";
                    }))
                    break;
                case 'bodyRow':
                    zmEditor.$store.commit('changeSelectList', zmEditor.$refs[
                        "editor"
                    ].$refs["bodyRow"].$children.find(item => {
                        return item.$el.id == "bodyId";
                    }))
                    break;
                case 'footRow':
                    zmEditor.$store.commit('changeSelectList', zmEditor.$refs[
                        "editor"
                    ].$refs["footRow"].$children.find(item => {
                        return item.$el.id == "footerId";
                    }))
                    break;
                default:
                    break;
            }
            value = oldVal;
            zmEditor.$store.commit('setSelectList',oldVal)
    
            // 显示innerSelected
            zmEditor.$store.state.multipleSelectCom.inIsShow = true;
            zmEditor.$store.state.multipleSelectCom.dragShow = false
        }
    }    
    // 清除组件高亮
    zmEditor.$store.commit("clearSelectComBorder", oldVal);
    // 设置将多选数组放入  selectListSet
    zmEditor.$store.commit("setSelectListSet", zmEditor.$store.state.multipleSelectCom.selectList);
    // 设置多选框下推图标的显示隐藏
    zmEditor.$store.commit("setDonwShow");
    // 将多选数组组件设置高亮
    zmEditor.$store.commit("setSelectComBorder", value);
    // 设置多选数组信息
    zmEditor.$store.commit("setArrInfo", value);
    // 设置inner选中框的大小
    zmEditor.$store.commit("innerSelected");
    // selectListSet > 1  当前选中组件为 innerSelected
    if (zmEditor.$store.state.multipleSelectCom.selectList.length > 1) {
        zmEditor.$store.commit('setInnerSelected');
    }else if(zmEditor.$store.state.multipleSelectCom.selectList.length == 1){
        zmEditor.$store.commit('changeSelectList',zmEditor.$store.state.multipleSelectCom.selectList[0]);
        // 显示编辑框
        zmEditor.$store.commit('changeCtrlBoxMode', true)
        // 显示按钮列表
        zmEditor.$store.commit('switchBtnType', 'unitMenu');
        // 计算按钮列表位置
        zmEditor.$store.commit('btnListLocation', zmEditor.$store.state.multipleSelectCom.selectList[0]);
    }

},
 
```

# Mobile
:::tip 说明
Mobile 端只有划选区多选

## Mobile 划选区多选<br> 
&nbsp;&nbsp;&nbsp; 1 鼠标点击拖动(`mobileRow.vue`中)会出现一个蓝色的选区 蓝色选区在`mobileOutterSelected.vue`组件中<br>
&nbsp;&nbsp;&nbsp; 2 选区只要是碰到,在组件的范围内的,该组件都被选中<br>
&nbsp;&nbsp;&nbsp; 3 设置组件高亮,获取选中的组件循环添加 `outline`属性<br>
&nbsp;&nbsp;&nbsp; 4 设置最小选区范围 <br>
&nbsp;&nbsp;&nbsp; 5 inner组件拖动 在`mobileInnerSelected.vue` 中操作<br>
:::


```js 
//入口
mobileRow.vue

 // 多组件选择 
comSelect(e) {
    this.init(); // 鼠标点击时,初始化参数
    zmEditor.$store.state.component.selectFrom = this.type;

    let clix = parseInt(e.pageX);
    this.x1 = parseInt(e.offsetX);

    let cliy = parseInt(e.pageY);
    this.y1 = parseInt(e.offsetY);

    this.outLeft = this.x1;
    this.outTop = this.y1;

    //  设置outter 选区显示
    this.outterShow = true;

    document.onmousemove = e => {
        if (e.which == 1) {
            // //  鼠标移动且左键点击
            this.outterPointerEvents = "none";
            this.innerPointerEvents = "none";

            let clix2 = parseInt(e.pageX);
            let cliy2 = parseInt(e.pageY);

            let conx = Math.abs(parseInt(clix2) - parseInt(clix)); // x移动的距离
            let cony = Math.abs(parseInt(cliy2) - parseInt(cliy)); // y移动的距离

            if (clix2 > clix) {
                this.x2 = parseInt(this.x1) + parseInt(conx);
                this.outLeft = this.x1;
            } else {
                this.x2 = parseInt(this.x1) - parseInt(conx);
                this.outLeft = this.x2;
            }

            if (cliy2 > cliy) {
                this.y2 = parseInt(this.y1) + parseInt(cony);
                this.outTop = this.y1;
            } else {
                this.y2 = parseInt(this.y1) - parseInt(cony);
                this.outTop = this.y2;
            }

            this.outWidth = Math.abs(parseInt(clix) - parseInt(clix2));
            this.outHeight = Math.abs(
                parseInt(this.y1) - parseInt(this.y2)
            );
        }
    };
    document.onmouseup = () => {
        this.outterPointerEvents = "auto";

        this.outterShow = false;
        this.comHeightLigth();
        this.innerSelected();
        let headIn = '';
        if (zmEditor.$refs["editor"].$refs[
                "headRow"
            ]) {
            headIn = zmEditor.$refs["editor"].$refs[
                "headRow"
            ].$children.find(item => {
                return item.$el.className == "zm-inner";
            });
        }
        let bodyIn = ''
        if (zmEditor.$refs["editor"].$refs[
                "bodyRow"
            ]) {
            let bodyIn = zmEditor.$refs["editor"].$refs[
                "bodyRow"
            ].$children.find(item => {
                return item.$el.className == "zm-inner";
            });

        }
        let footIn = ''
        if (zmEditor.$refs["editor"].$refs[
                "footRow"
            ]) {
            footIn = zmEditor.$refs["editor"].$refs[
                "footRow"
            ].$children.find(item => {
                return item.$el.className == "zm-inner";
            });
        }
        // 有选中组件内边框显示 , 没有则不显示
        if (zmEditor.$store.state.multipleSelectCom.selectList.length > 1) {
            this.innerShow = true;
            this.innerPointerEvents = "auto";
        } else {
            this.init();
            this.innerShow = false;
            
            
        }

        document.onmousemove = null;
        document.onmouseup = null;
    };
},

```
