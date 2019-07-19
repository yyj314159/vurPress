# 颜色拾取器

拾取器选择颜色

使用了一个 tinycolor2 插件来进行颜色换算(rgba -> hex -> hsl -> hsv -> rgba). 


## 经典颜色

classic.vue

## 点击改变颜色

## 当前色/新颜色显示
:::tip  说明

computed 中的 nowColor 获取当前颜色
`:class=" newColor ? 'point-newColor-show' : 'point-newColor-show-background'"` 
通过当前颜色有无判断是否显示没有颜色的图片

computed 中的 nowColor2 获取当前颜色 通过selectType 的状态值判断是否改变当前颜色

`this.selectType = 'Toning' --> 针对的是调色杆拖动的时候不该变当前颜色和组件颜色`

`this.selectType = 'previewStatus' --> 针对的是鼠标移动的预览效果`

`this.selectType = 'active' --> 改变组件和当前颜色`


:::
 
```js
    nowColor2() {
    if (this.selectType) {
        if (this.selectType === "Toning") {
            // 拖动调色杆新颜色中的色块不改变 return  this.activeColor
            // 组件的颜色也不改变
            this.callback(this.activeColor, "previewStatus");
            return this.activeColor;
        } else {
            if (this.selectType && this.selectType == "active") {
                this.newColor = this.colors.rgba;
                this.activeColor = this.$store.state.colorPicker.defaultColor.hex
            }
            const rgba = this.colors.rgba;
            return `rgb(${rgba.r},${rgba.g},${rgba.b})`;
        }
    }
},
```
## 输入改变颜色

ColorInput.vue

```js
//输入框改变颜色
inputChange(data) {
    if (!data) return;
    this.newColor = data;
    // this.activeColor = `rgb(${data.r},${data.g},${data.b})`;
    if (data["#"]) {
        this.$store.commit("changeColor", "#" + data["#"]);
    } else if (data.R || data.G || data.B) {
        let rgb = {
            r: data.R || this.colors.rgba.r,
            g: data.G || this.colors.rgba.g,
            b: data.B || this.colors.rgba.b
        };
        this.$store.commit("changeColor", `rgb(${rgb.r},${rgb.g},${rgb.b})`);
    } else if (data.H || data.S || data.V) {
        let hsv = {
            h: data.H || this.colors.hsv.h,
            s: data.S || this.colors.hsv.s,
            v: data.V || this.colors.hsv.v
        };
        this.$store.commit("changeColor", `hsv(${hsv.h},${hsv.s},${hsv.v})`);
    }
    // input 中的值改变后使生效
    this.activeColor = this.$store.state.colorPicker.defaultColor.hex

    //记录当前操作到历史记录池
    zmEditor.$store.commit('saveOperationToHistory')
},

```

## 我喜爱的颜色
::: tip 说明
 1 点击判断颜色是否和当前颜色是否是一样的
 2 不一样的放入本地localStorage

:::

```js
  //添加喜爱的颜色
    addLikeColor() {
        const valCol = this.nowColor;
        if (this.likeColors.includes(valCol)) {
            return false;
        } else {
            this.likeColors.pop();
            this.likeColors.unshift(valCol);
            this.saveColorToLocal(this.likeColors);
        }
    },
    //喜爱的颜色存入loalhost
    saveColorToLocal(arr) {
        localStorage.setItem("pickLikeColor", JSON.stringify(arr));
    },

```

## 页面内取色功能

页面内取色


#### vuecolor.vue 
::: tip  说明

 1 点击拾取器图标

 2 在页面中 zm-image div  显示(渲染后的页面在此显示)

 3 获取页面中所有的svg 通过canvg 转换为 canvas 放到当前svg的下一级,并将svg设置隐藏

 4 通过html2canvas 将页面转换为canvas
:::

```js
strawClick() {
        // 设置拾色器面板显示
        this.$store.state.colorPicker.isCanvasShow = true;

        // setTimeout(() => {
        if (typeof html2canvas !== "undefined") {
            //以下是对svg的处理
            var nodesToRecover = [];
            var nodesToRemove = [];
            //zm-editor-page eidtor编辑区为需要截取成图片的dom的id
            var svgElem = $("body").children().find("svg");


            svgElem.each(function (index, node) {
                var parentNode = node.parentNode;
                // 获取svg对应的父级元素
                let pNode = node.parentNode;

                var svgDiv = document.createElement("div");
                svgDiv.style.display = "-moz-inline-stack";
                $(svgDiv).insertBefore($(node));
                $(svgDiv).append($(node));
                var svg = $(node).parent().html().trim();
                $(svgDiv).after($(node));
                $(svgDiv).remove();
                // 创建canvas
                var canvas = document.createElement("canvas");
                // canvg 对svg进行处理
                canvas.width = node.getBoundingClientRect().width;
                canvas.height = node.getBoundingClientRect().height;

                canvg(canvas, svg);


                // canvas.fillRect(0, 0, canvas.width, canvas.height);
                if (node.style.position) {
                    canvas.style.position += node.style.position;
                    canvas.style.left += node.style.left;
                    canvas.style.top += node.style.top;
                }

                canvas.style.width = node.getBoundingClientRect().width + "px";
                canvas.style.height = node.getBoundingClientRect().height + "px";

                nodesToRecover.push({
                    parent: pNode,
                    child: node
                });
                // 设置svg上层div隐藏

                $(node).hide()
                nodesToRemove.push({
                    parent: pNode,
                    child: canvas
                });
                // canvas添加
                pNode.appendChild(canvas);
            });

            // -50 头部菜单固定的高度
            let top = -zmEditor.$store.state.page.menuHeight - 0 + $('#zm-main').scrollTop() + 'px';
            $('#zmEditor-img').css('top', top)
            html2canvas(document.getElementById('zmEditor'), {
                useCORS: true
            }).then(function (canvas) {

                $("#zmEditor-img").html(canvas);
                var canvasElem = $("body").find("canvas");
                canvasElem.each(function (i, e) {

                    if ($(e)[0].parentNode.id !== 'zmEditor-img') {
                        $(e).prev().show()
                        e.remove();
                    }

                });
            });

        }

    },
    
},


```


#### computerEditor.vue 
::: tip  说明

此时是点击过拾取器图标,HTML转换成了canvas

 1 用拾取器点击页面中的颜色,实际点中的是 zm-image canvas图片上的

 2 通过点击位置获取canvas图片上点的颜色

 3 点击获取到颜色后,将 zm-image div 隐藏 , 将canvas隐藏 svg显示
 
:::

```js

canvasClick(ev) {
    // 获取渲染后的canvas
    var colorData = document.getElementById("zmEditor-img").getElementsByTagName("canvas")[0];  
    var thisContext = colorData.getContext("2d");
    // 根据点击坐标获取图片信息    
    var imageData = thisContext.getImageData(
        this.mousePos(ev).x,
        this.mousePos(ev).y,
        1,
        1
    );
    var pixel = imageData.data;
    var r = pixel[0];
    var g = pixel[1];
    var b = pixel[2];
    var a = pixel[3] / 255;
    a = Math.round(a * 100) / 100;
    var rHex = r.toString(16);
    r < 16 && (rHex = "0" + rHex);
    var gHex = g.toString(16);
    g < 16 && (gHex = "0" + gHex);
    var bHex = b.toString(16);
    b < 16 && (bHex = "0" + bHex);

    this.$refs.colorPickerMethods.selectType = "active";
    this.$store.commit("changeColor", `rgb(${r},${g},${b})`);

    // 去除 canvase 将svg显示
    this.$refs.colorPickerMethods.colorPickerEntry();
    zmEditor.$store.commit('changeColorStrawStatus', false);
    // 将吸管改为指针
    document.getElementsByTagName("body")[0].classList.remove("colorDropper");
}
```

