<template>
    <div class="box">
        <div class="head"></div>
        <div class="demo">自动吸顶</div>
        <div class="foot"></div>
    </div>
</template>

<style scoped>
.box {
    width: 500px;
    height: 300px;
    overflow: auto;
}
.head,
.foot {
    width: 100%;
    height: 1000px;
    background: linear-gradient(#f00, #0f0, #00f);
}
.demo {
    width: 100%;
    height: 30px;
    line-height: 1;
    text-align: center;
    background-color: rgba(30, 95, 68, .5);
    position: sticky;
    top: 0;
}

</style>

