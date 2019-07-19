# javascript相关

## 数据类型
1. number
2. string
3. boolean
4. undefined
5. null
6. object `(包括Object,Array,Function)`
7. symbol `(ES6新增) 生成一个全局唯一的值`

### typeof 和 instanceof
typeof主要用于检测基本类型,instanceof主要用于检测引用类型
语法:
```js
typeof(a) // Object
a instanceof Array  //true or false
```

## 数组操作
### 常用数组方法
+ Array.find()
+ Array.findIndex()
+ Array.some()
+ Array.filter()
+ Array.map()
+ Array.reduce()
+ Array.indexOf()
+ Array.includes()
### 数组去重
```js
const arr = [...new Set(arr)]
```
### 数组合并
```js
const arr = [...arr1,...arr2]
```
### 类数组集合转数组
```js
const arr = Array.from(args)
```

## 遍历多叉树

```js
//数据结构
const data = [
    {
        id: 1,
        children: [
            {
                id: 11,
                children: [
                    {
                        id: 111
                    },
                    {
                        id: 112
                    },
                    {
                        id: 113
                    }
                ]
            },
            {
                id: 12,
                children: [
                    {
                        id: 121
                    },
                    {
                        id: 122
                    },
                    {
                        id: 123
                    }
                ]
            },
            {
                id: 13
            }
        ]
    },
    {
        id: 2,
    },
    {
        id: 3,
        children: [
            {
                id: 31
            },
            {
                id: 32
            },
            {
                id: 33
            }
        ]
    }
]
```

+ **递归实现**
```js
const parseData = (data) => {
    if(!data || !data.length) return;
    for(let i=0,len=data.length;i<len;i++){
        let child = data[i].children;
        if(child && child.length !== 0){
            parseData(child)
        }
    }
}
parseData(data)
```
+ **广度优先实现**
```js
//非递归广度优先实现
const parseData = (data) => {
    if(!data || !data.length) return;
    let stack = [];
    for(let i=0,len=data.length;i<len;i++){
        stack.push(data[i])
    }
    let item;
    while(stack.length){
        item = stack.shift();
        if(item.children && item.children.length){
            stack = stack.concat(item.children)
        }
    }
}
parseData(data);
```

+ **深度优先实现**
```js
//非递归深度优先实现
const parseData = (data) => {
    if(!data || !data.length) return;
    let stact = [];
    for(let i=0,len=data.length;i<len;i++){
        stack.push(data[i])
    }
    let item;
    while(stack.length){
        item = stack.shift();
        if(item.children && item.children.length){
            stack = item.children.concat(stack)
        }
    }
}
parseData(data);
```