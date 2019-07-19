# 快捷键

支持的全局快捷键列表如下:
+ Ctrl + C 复制组件
+ Ctrl + V 粘贴组件
+ Ctrl + X 剪切组件
+ Ctrl + Z 上一步
+ Ctrl + Y 下一步
+ Ctrl + A 全选组件
+ ↑ 组件上移1px
+ ↓ 组件下移1px
+ ← 组件左移1px
+ → 组件右移1px

事件注册函数在 `src/common/public.js` 中,若要增加快捷键,在此文件添加  
相应执行的方法在 `src/store/` 不知道在哪儿, **@史时敏** 补充

::: tip

1. 触发键盘事件时,会销毁挂载在 document 上的 mousemove 事件,同时触发一次 mouseup 事件并销毁.(ps: 主要是为了解决拖动时执行截图操作,截图完成后会发生鼠标黏黏的情况)
2. 系统提供 removeComKeyEvent 方法来阻止响应全局快捷
3. 系统提供 addComKeyEvent 方法来恢复响应全局快捷键
4. 当组件全屏时,不允许左右移动(ps: pc端用settingData->fullScreen->value 判断, mobile用 是否有 mobileFull 属性来判断)

ps: 
当出现快捷键失效的时候,可能是哪里调用了 removeComKeyEvent 方法 而忘记调用 addComKeyEvent 方法来恢复

:::



