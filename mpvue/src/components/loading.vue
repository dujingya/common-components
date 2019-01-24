<template>
    <div class="loading">
        <div class="load-container load8">
            <div class="loader">Loading...</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'loading',
        data () {
            return {
                tips: '加载中',
                step: 0
            }
        },
        methods: {
        },
        created() {
        },
        onShow() {
        },
        mounted() {
        }
    }
</script>

<style>
    page{
        height: 100%
    }
    .loading{
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        top: 0;
        width: 100%;
        bottom: 0;
        z-index: 100000;
    }
    .load-container {
        width: 120rpx;
        height: 120rpx;
        float: left;
        position: relative;
        overflow: hidden;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .load8 .loader {
        position: relative;
        text-indent: -9999em;
        border-top: 10rpx solid rgba(255, 255, 255, 0.4);
        border-right: 10rpx solid rgba(255, 255, 255, 0.4);
        border-bottom: 10rpx solid #fd4346;
        border-left: 10rpx solid #fd4346;
        -webkit-animation: load8 1.1s infinite linear;
        animation: load8 1.1s infinite linear;
    }
    .load8 .loader,
    .load8 .loader:after {
        border-radius: 50%;
        width: 100rpx;
        height: 100rpx;
    }
    @-webkit-keyframes load8 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @keyframes load8 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
</style>
