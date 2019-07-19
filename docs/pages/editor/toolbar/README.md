# 工具条使用说明
#### 全屏功能
有全屏功能的组件有两种情况：
1. 可以在全屏和非全屏之间切换
```js
    data(){
        return {
            fullPageSet:true
        }
    }

    computed(){
        isFullPage(){
            // return  一个布尔值，即控制全屏的属性
        }
    }

    methods:{
        fullpage(val){
            // val是一个布尔值
            // 切换组件全屏的逻辑
        }
    }

```
   
2. 一直是全屏
```js
    data(){
        return {
            // unableChangeFullPage属性表示组件一直是全屏并且不可设置
            
            unableChangeFullPage:true,
        }
    }
```

