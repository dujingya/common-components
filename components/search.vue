<template>
    <div class="searchBg">
        <view :class="['search-wrapper-template', show ? 'show-full' : '']">
            <view class='search-wrapper-template-input'>
                <view class="input">
                    <text class="['iconfont', 'icon-sousuo1']"></text>
                    <input type="text" confirm-type="搜索" :value="value" data-model="value" bindinput='handleModelValue' catchtap="handlerShowModal" :focus="show" :disabled="!show" :placeholder="placeholder" bindconfirm="handlerSearch"/>
                    <text v-if="value" class="['iconfont', 'icon-cuowutishi', 'clear-text']" catchtap="handlerClearValue"></text>
                    <button class="btn" catchtap="handlerCloseModal">取消</button>
                </view>
            </view>
            <view class="search-wrapper-template-modal">
                <view class="s-title">搜索历史</view>
                <view class="s-wrap">
                    <button class="item" bindtap="handlerItem" v-for="(item, index) in list" :key="index">{{item.name}}</button>
                </view>
                <button :hidden="list.length === 0" class="['btn', 'clear-btn']" bindtap="clearSearchList">
                    <text class="iconfont"></text>
                    清空搜索历史
                </button>
            </view>
        </view>
    </div>
</template>

<script>
    const SEARCH_LIST = 'search_history_list'
    const LIST_MAX = 50
    // import {
    //     encodeUrlParam
    // } from '@/utils/urlTool'
    // import * as API from '@/service/api'
    // import fetch from '@/service/fetch'
    // import {
    //     login,
    //     setStorage
    // } from '@/utils/wechat'
    // import Config from '@/utils/config'
    export default {
        // name: 'bindphone',
        options: {
            addGlobalClass: true
        },
        properties: {
            placeholder: {
                type: String,
                value: '请输入要搜索的商品名称'
            },
            show: {
                type: Boolean,
                value: false
            },
            value: {
                type: String,
                value: ''
            }
        },
        props: [],
        data () {
            return {
                list: [],
                value: ''
            }
        },
        methods: {
            // 输入框双向绑定
            handleModelValue(e) {
                let value = e.detail.value
                let model = e.target.dataset.model
                this.setData({
                    [model]: value
                })
            },
            handlerShowModal() {
                this.handlerHistoryList()
                this.setData({
                    show: true
                })
            },
            handlerCloseModal() {
                this.setData({
                    show: false
                })
            },
            // 清空输入框内容
            handlerClearValue() {
                this.value = ''
                this.triggerEvent('search', this.value)
                this.triggerEvent('clear')
            },
            // 开始搜索
            handlerSearch() {
                const val = this.value
                this.setData({
                    value: val
                })
                this.createSearchValue(val)
                this.setData({
                    show: false
                })
                this.triggerEvent('search', this.value)
            },
            handlerItem(e) {
                console.log(e._relatedInfo.anchorTargetText)
                const value = e._relatedInfo.anchorTargetText
                this.setData({
                    value
                })
                this.handlerSearch()
            },
            // 缓存搜索名称
            createSearchValue(val) {
                if (!val.trim()) {
                    return
                }
                let list = this.getSearchList()

                const len = list.length
                let obj = {
                    name: val.trim(),
                    time: Date.now()
                }
                if (len === 0) {
                    list.push(obj)
                    wx.setStorageSync(SEARCH_LIST, list)
                } else {
                    if (len >= LIST_MAX) {
                        list.splice(0, 1)
                    }
                    let index
                    let isInc = list.filter((item, i) => {
                        if (item.name === val) {
                            index = i
                            return true
                        } else {
                            return false
                        }
                    })
                    if (isInc.length > 0) {
                        list.splice(index, 1)
                    }
                    list.push(obj)
                    console.log(list)
                    wx.setStorageSync(SEARCH_LIST, list)
                }
                this.handlerHistoryList()
            },
            // 获取搜索列表
            getSearchList() {
                let list = []
                try {
                    list = wx.getStorageSync(SEARCH_LIST) || []
                } catch (e) {
                    list = []
                    console.error(e)
                }
                return list
            },
            // 清空搜索列表
            clearSearchList() {
                wx.clearStorageSync(SEARCH_LIST)
                this.handlerHistoryList()
            },
            handlerHistoryList() {
                this.setData({
                    list: this.getSearchList().reverse()
                })
            }
        }
    };
</script>

<style lang="scss">
    .searchBg{
        .search-wrapper-template{
            z-index: 100;
            &.show-full{
                position: fixed;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                .search-wrapper-template-input{
                    input{
                        border-radius: 3px;
                    }
                    button{
                        display: block;
                    }
                    .clear-text{
                        left: auto;
                        right: 95rpx;
                        font-size: 40rpx;
                    }
                }
                .search-wrapper-template-modal{
                    display: block;
                }
            }
            .search-wrapper-template-input {
                height: 90rpx;
                padding: 0 30rpx;
                background-color: #f5f5f5;
                display: flex;
                align-items: center;
                justify-content: center;
                .input{
                    position: relative;
                    height: 70rpx;
                    width: 100%;
                    display: flex;
                    font-size: 28rpx;
                    overflow: visible;
                }
                input{
                    flex: 1;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    border: none;
                    border-radius: 40rpx;
                    background-color: #fff;
                    padding-left: 65rpx;
                    padding-right: 15px;
                    border-radius: 40rpx;
                    outline: none;
                }
                button{
                    flex: 0 0 4em;
                    padding: 0;
                    height: 100%;
                    font-size: 28rpx;
                    color: #666;
                    text-align: center;
                    margin-right: -30rpx;
                    display: none;
                }
                .iconfont{
                    position: absolute;
                    left: 15rpx;
                    top: 17rpx;
                    font-size: 35rpx;
                }
                .clear-text{
                    left: auto;
                    right: 15rpx;
                    font-size: 40rpx;
                    cursor: pointer;
                }
            }
            .search-wrapper-template-modal{
                display: none;
                width: 100%;
                height: calc(100vh - 90rpx);
                background-color: #fff;
                padding: 0 30rpx 30rpx;
                .s-title{
                    font-size: 22rpx;
                    height: 60rpx;
                    display: flex;
                    align-items: center;
                    color: #999;
                }
                .s-wrap{
                    display: flex;
                    flex-wrap: wrap;
                    .item{
                        display: inline-block;
                        height: 60rpx;
                        border-radius: 3px;
                        font-size: 25rpx;
                        white-space: nowrap;
                        color: #555;
                        margin: 0 15rpx 15rpx 0;
                        background-color: #f5f5f5;
                        &:after{
                            box-shadow: none;
                            border: none;
                            background: transparent;
                        }
                        &.button-hover{
                            background-color: #eee !important;
                        }
                    }
                }
                .clear-btn{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 30rpx auto;
                    width: 230rpx;
                    font-size: 25rpx;
                    color: #666;
                    border-radius: 35rpx;
                    height: 70rpx;
                    background: #fff;
                    border: 1px solid #f5f5f5;
                }
            }
        }
    }

</style>
