# CSS

## window 视图属性

* innerWidth/innerHeight
    * 获取window窗体的内部宽度/高度 不包括用户界面元素
    * 使用方法 window.innerWidth
* pageXOffset/pageYOffset
    * 表示整个页面滚动的像素值(水平方向和垂直方向的)
    * 使用方法 window.pageXOffset
* screenX/screenY
    * 表示浏览器窗口在显示器中的位置
    * 使用方法 window.screenX
* outerWidth/outerHeight
    * 浏览器窗体的大小,包括任务栏
    * 使用方法 window.outerWidth

## Screen 视图属性

* availWidth/availHeight
    * 显示器可用宽高,不包括任务栏
    * 使用 screen.availWidth
* colorDepth
    * 显示器的颜色深度
    * 使用 screen.colorDepth
* pixelDepth
    * 与colorDepth一样,但兼容性较差
* width/height
    * 显示器屏幕的宽高
    * 使用 screen.width
## DocumentView 文档视图 和 ElementView 元素视图 方法
* elementFromPoint()
    * 返回给定坐标处所在的元素
    * 示例 document.elementFromPoint(100,100)
* getBoundingClientRect()
    * 得到矩形元素边界 返回的是一个对象,包括left,top,right,bottom,都是相对于文档视图左上角计算而来
    * 示例 element.getBoundingClientRect()
* getClientRects()
    * 返回元素的数个矩形区域,返回的结果是个对象列表,具有数组特性
    * 这里的矩形选区只针对 inline-box
    * 示例 element.getClientRects()
* scrollIntoView()
    * 让元素滚动到可视区域
    * 示例 element.scrollIntoView()
## 元素视图属性
* clientLeft/clientTop
    * 表示内容区域的左上角相对于整个元素左上角的位置(包括边框)
    * 示例 element.clientLeft
* clientWidth/clientHeight
    * 表示内容区域的高度和宽度,包括padding大小,但是不包括边框和滚动条
    * 示例 element.clientWidth
* offsetLeft/offsetTop
    * 表示相对于最近的祖先定位元素的左右偏移值
    * 示例 element.offsetLeft
* offsetParent
    * 第一个祖定位元素
    * 示例 element.offsetParent
* offsetWidth/offsetHeight
    * 整个元素的尺寸(包括边框)
    * 示例 element.offsetWidth
* scrollLeft/scrollTop
    * 表示元素滚动的像素大小,可读写
    * 示例 element.scrollLeft
* scrollWidth/scrollHeight
    * 表示整个内容区域的宽高,包括隐藏的部分
    * 示例 element.scrollWidth
## 鼠标位置
* clientX/clientY
    * 鼠标相对于window的偏移
    * 示例 event.clientX
* offsetX/offsetY
    * 鼠标相对于当前被点元素的左上偏移值
    * 示例 event.offsetX
* pageX/pageY
    * 鼠标相对于document的坐标
    * 示例 event.pageX
* screenX/screenY
    * 鼠标相对于显示器屏幕的偏移坐标
    * 示例 event.screenX
* x/y
    * 相当于clientX/clientY

## position: sticky

粘性固定,一个属性搞定元素吸顶功能
使用条件: 
1. 父元素不能 overflow:hidden 或者 overflow:auto 属性
2. 必须指定 top,bottom,left,right 4值中的一个,否则只会处于相对定位
3. 父元素的高度不能低于 sticky 元素的高度
4. sticky 元素仅在其父元素内生效

示例:  

<demo-sticky />

## scroll-behavior: smooth

设置页面平滑滚动,当页面滚动效果由浏览器或者是 CSSOM API 发出时,会触发这个属性  
例如:
1. 点击锚点跳转  
2. window.scrollTo() 跳转  

## 层叠顺序与堆栈上下文 z-index


## 盒模型









