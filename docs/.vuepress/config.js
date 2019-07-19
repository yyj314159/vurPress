/**
 * @file 文档配置文件
 * @author lh
 */
module.exports = {
    // 网站标题
    title: '族蚂建站系统开发文档|规范',
    // 设置显示在浏览器标签页中的图标
    head: [
        ['link', {rel: 'icon', href: '/logo.png'}]
    ],
    // markdown: {
    //     lineNumbers: true,//代码块显示行数
    // },
    // 不向下兼容IE及低版本浏览器,加快构建速度
    evergreen: true,
    themeConfig: {
        sidebar: [
            ['/', '简介'],
            ['/pages/grammar/', 'Markdown语法'],
            {
                title: '编辑器系统',
                children: [
                    ['/pages/editor/', '编辑器简介'],
                    ['/pages/editor/structure/', '项目结构'],
                    ['/pages/editor/helpline/', '辅助线'],
                    ['/pages/editor/animate/', '动画'],
                    ['/pages/editor/background/', '背景'],
                    ['/pages/editor/ctrlbox/', '组件控制'],
                    ['/pages/editor/store/', '状态管理'],
                    ['/pages/editor/keyboard/', '快捷键'],
                    ['/pages/editor/history/', '历史记录'],
                    ['/pages/editor/menu/', '顶部菜单'],
                    ['/pages/editor/side/', '侧边列表'],
                    ['/pages/editor/colorPicker/', '颜色拾取器'],
                    ['/pages/editor/publicFun/','公共组件'],
                    ['/pages/editor/changeStyle/','组件样式切换'],
                    ['/pages/editor/selected/','组件多选'],
                    ['/pages/editor/toolbar/','工具条']
                ]
            },
            {
                title: '组件系统',
                children: [
                    ['/pages/component/text.md', '文字 Text'],
                    ['/pages/component/button.md', '按钮 Button'],
                    ['/pages/component/shape.md', '图形 Shape'],
                    ['/pages/component/banner.md', '横条 Banner'],
                    ['/pages/component/nav.md', '导航 Nav'],
                    ['/pages/component/carousel.md', '轮播 Carousel'],
                    ['/pages/component/product.md', '产品 Product'],
                    ['/pages/component/container.md', '容器 Container'],
                    ['/pages/component/audio.md', '音频 Audio'],
                    ['/pages/component/video.md', '视频 Video'],
                    ['/pages/component/news.md', '新闻 News'],
                    ['/pages/component/blog.md', '博客 Blog'],
                    ['/pages/component/image.md', '图片 Image'],
                    ['/pages/component/tab.md', '选项卡 Tab'],
                    ['/pages/component/funtion.md', '功能 Function'],
                    ['/pages/component/lightbox.md', '灯箱 LightBox']
                ]
            },
            {
                title: '一些知识',
                children: [
                    ['/pages/know/html/', 'html'],
                    ['/pages/know/css/', 'css'],
                    ['/pages/know/javascript/', 'javascript'],
                    ['/pages/know/algorithm/', '算法'],
                    ['/pages/know/example/', '示例'],
                    ['/pages/know/pwa/', 'PWA']
                ]
            }
        ]
    }
};
