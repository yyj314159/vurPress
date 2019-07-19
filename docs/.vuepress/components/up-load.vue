<template>
    <div class="component-upload">
        <label for="upload" ref="row" class="row" 
            @dragleave.stop="handleLeave" 
            @dragenter.stop="handleEnter" 
            @drop.stop="handleDrop" 
            @dragover="handleOver">
            +
            <input id="upload" type="file" accept="image/*" hidden
                @change.stop="handleChange">
            </input>
        </label>
        <div class="preview">
            <img :src="imageUrl">
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'uploadImage',
    props: {
        api: {
            type: String,
            default() {
                return '';
            }
        }
    },
    data() {
        return {
            imageUrl: ''
        };
    },
    methods: {
        handleEnter(e) {
            e.preventDefault();
            this.$refs.row.classList.add('dragIn');
        },
        handleOver(e) {
            e.preventDefault();
        },
        handleLeave(e) {
            e.preventDefault();
            this.$refs.row.classList.remove('dragIn');
        },
        // 拖拽图片
        handleDrop(e) {
            e.preventDefault();
            this.$refs.row.classList.remove('dragIn');
            const file = e.dataTransfer.files[0];
            if (file.type.indexOf('image') === -1) {
                return;
            }
            this.previewFile(file);
            this.postFile(file);
        },
        // 选择图片
        handleChange(e) {
            const file = e.target.files[0];
            this.previewFile(file);
            this.postFile(file);
        },
        // 预览图片的方法
        previewFile(file) {
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = e => {
                    this.imageUrl = e.target.result;
                };
            }
        },
        // 上传图片的方法
        postFile(file) {
            const formData = new FormData();
            formData.append('imageFile', file);
            axios({
                method: 'post',
                url: 'http://192.168.0.22:8888/api/uploadImage',
                async: true,
                contentType: false,
                processData: false,
                data: formData
            }).then(res => {
                console.log(res, '上传成功');
            }).catch(err => {
                console.log('上传失败');
            });
        },
        // 压缩图片
        zipFile() {

        }
    }
};
</script>

<style scoped>
.component-upload {
    width: 100%;
    height: 240px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.row {
    display: block;
    width: 200px;
    height: 200px;
    font-size: 50px;
    line-height: 3.5;
    text-align: center;
    background-color: #f5f5f5;
    border: 2px solid #fff;
}
.dragIn {
    border: 2px dashed #000;
}
.preview {
    width: 200px;
    height: 200px;
    margin-left: 20px;
    display: flex;
}
.preview > img {
    object-fit: contain;
}

</style>
