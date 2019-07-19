# HTML相关

## scrollIntoView()
让当前元素滚动到浏览器窗口的可视区域
```js
element.scrollIntoView()
```

## hidden
隐藏元素
```js
element.hidden = true
```

## toggle()
添加或删除元素的某个class
```js
element.classList.toggle('some-class')
```

## querySelector()
元素选择器,可以应用在任意元素上,而不仅限于document上
```js
const ul = document.querySelect('.ul')
ul.querySelect('a')
```

## closest()
该方法可在任意元素上使用,它能够向上查找元素的树形结构,可以理解为与`querySelect`相反的方法.
```js
element.closest('#app')
```

## getBoundingClientRect()
返回包含其空间结构详细信息的简单对象
```js
element.getBoundingClientRect()
```

## matches()
检查某个元素是否包含一个特定的class
```js
element.matches('some-class')
```

## contains() 
该方法用于检测某个节点是不是另一个节点的后代.调用`contains()`方法的应该是祖先节点,这个方法接收一个参数,即要检测的后代节点.如果被检测的节点是后代节点返回`true`,否则返回`false`.
```js
document.body.contains(document.querySelector('#app')) // true
```

## dialog 元素
包含三个方法
+ show() 显示
+ close() 隐藏
+ showModal() 显示在页面顶层,居中对齐

## select()
文本域全选