<template>
    <div class="webviewBg" style="height: 100%;">
        <web-view :src="url" @message="bindmessage"></web-view>
        <Navigation></Navigation>
    </div>
</template>
<script>
// import {
//     encodeUrlParam
// } from '@/utils/urlTool'
// import * as API from '@/service/api'
// import fetch from '@/service/fetch'
// import {
//     login,
//     getStorage,
//     setStorage
// } from '@/utils/wechat'
// import { setScrollTop } from '@/utils/index'
// import Config from '@/utils/config'
// import bindingphone from '@/components/bindingphone'
// import loading from '@/components/loading'
import Navigation from '@/components/navigation'
export default {
    components: {
        // bindingphone,
        // loading,
        Navigation
    },
    data () {
        return {
            url: 'https://www.baidu.com/'
        }
    },
    methods: {
        bindmessage() {
        }
    },
    created() {
    },
    onShow() {
    },
    mounted() {
    },
    onShareAppMessage(res) {
        // console.log(res)
        // if (res.from === 'button') {
        //     console.log(res.target)
        // };
        // return {
        //     title: '治未病，让天下人少生病',
        //     path: '/pages/index/main',
        //     imageUrl: 'https://lk-upload-api-pro.op.laikang.com/common/fileDownload/lk-upload/2c960003-3668-4c75-af80-08b74a37b527.jpg'
        // }
    }
}
</script>
<style lang='scss'>
    page{
        height: 100%;
    }
    .webviewBg{

    }
</style>
