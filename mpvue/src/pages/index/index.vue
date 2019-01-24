<template>
    <div id="homePage" style="height: 100%;">
        <div :class="notScroll? 'box preventTouchMove' : 'box'">
            <view class='titleBar'>
                <!--<img :src="bgImg">-->
                <swiper  autoplay="true" interval="3000" duration="1000"  circular="true" current="currentSwiper" @change="swiperChange" class="swiperSet">
                    <div @click="gotoNextView(item)" v-for="(item, index) in imgUrls" :index="index" :key="key">
                        <swiper-item>
                            <image :src="item.url" class="slide-image" mode="aspectFill"/>
                        </swiper-item>
                    </div>
                </swiper>
                <div class="dots">
                    <div v-for="(item, index) in imgUrls" :key ="key">
                        <div :class="index == currentSwiper ? 'dotSelected' : 'dotNormal' "></div>
                    </div>
                </div>
                <view class='messageBar' v-if="isShowMessage">
                    <img src="../../image/red.png">
                    <view class="tipMsg">请立即领取您的体检健康金</view>
                    <view class="login" v-if="bindPhone" @click="login">领取</view>
                </view>
            </view>
            <div class='package'>
                <view class="title-one">
                    <view class="left">体检套餐</view>
                    <view class="right" @click="getMorePackage">更多套餐</view>
                    <img class="morePackage" src="../../image/blackarrow.png">
                </view>
                <view class="classification">
                    <view :class="['tabs', item.selectedItem]" v-for="(item, index) in tabsPackageList" :key="index" @click="packageItemChange(item, index)">
                        {{item.name}}
                    </view>
                </view>
                <view class="classification-page">
                    <view class="classification-list" v-for="(item, index) in classList"  v-if="index<3" :key="item.price+index">
                        <view class="card" >
                            <div class="packImg" :id="'pg'+item.id">
                                <img @click="changeContent(index, item.id)"  :src="item.logo">
                            </div>
                            <view class="classTitle">
                                <view class="packageModal">
                                    <view class="name">
                                        <span>{{item.name}}</span>
                                        <view @click="changeContent(index, item.id, $event)" class="detailBtn">体检项详情
                                            <img v-if="item.showContent" class="double" src="../../image/doubleUp.png">
                                            <img v-else class="double" src="../../image/double.png">
                                        </view>
                                    </view>
                                    <view class="price">¥{{item.prices}}</view>
                                </view>
                                <view class="buyBtn">
                                    <view @click="toBuy(item, index)" class="buy">套餐详情</view>
                                </view>
                            </view>
                        </view>
                        <view :id="'bg'+item.id" v-if="item.showContent" class="collapse"  >
                            <!--<view class="title">三疗健康</view>-->
                            <!--:class="{fadeInDownBig:item.showContent,animated:item.showContent}"-->
                            <ul>
                                <li v-for="(item, n) in collapseList" :key="n" :id="'pg'+item.id" >
                                    <div @click="showModal(item, n)" class="line" :class="{lineBottom: item.showList}">
                                        <div v-if="item.showList" class="smallBox"></div>
                                        <div class="left">
                                            <h5>{{item.name}}</h5>
                                            <div class="icon-box">
                                                <div class="icon-child">
                                                    <img v-if="item.showList"  src="../../image/right1.png">
                                                    <img v-else  src="../../image/bottom.png">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="right">
                                            <div class="discription">
                                                {{item.desc}}
                                            </div>
                                        </div>
                                    </div>
                                    <ul class="childModal" v-if="item.showList">
                                        <li v-if="item.items.length>0" class="childDetail"  v-for="(content, j) in item.items" :class="item.items.length-1==j?'noBorder':''" :key="j">
                                            <div class="left">
                                                <h5>{{content.itname}}</h5>
                                            </div>
                                            <div class="right">{{content.desc}}</div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </view>
                    </view>
                    <div v-if="classList.length<3" class="bottomModal"></div>
                </view>
                <div v-if="bottomModal" class="bottomModal"></div>
                <div class="goosBg">
                    <div class="goosBg">
                        <div v-for="(item, index) in goodsList" :key="index" class='goodsItem'>
                            <img :src="item.img" alt="" class="goodsImg">
                            <div class="goodsLabel">{{item.title}}</div>
                            <div class="goodsPrice">{{item.price}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <bindingphone :showBindPhone="loginModal" @listenToChildCloseModal="closeModal"></bindingphone>
        <!--<loading v-if="showLoading"></loading>-->
    </div>
</template>
<script>
import {
    encodeUrlParam
} from '@/utils/urlTool'
import * as API from '@/service/api'
import fetch from '@/service/fetch'
import {
    login,
    getStorage,
    setStorage
} from '@/utils/wechat'
import { setScrollTop } from '@/utils/index'
import Config from '@/utils/config'
import bindingphone from '@/components/bindingphone'
import loading from '@/components/loading'
export default {
    components: {
        bindingphone,
        loading
    },
    data () {
        return {
            currentSwiper: 0, // swiper的index
            imgUrls: [
                {
                    url: 'https://lk-upload-api-pro.op.laikang.com/common/fileDownload/lk-upload/e7a6d840-f959-4f1f-bc43-feb28960df04.jpg',
                    path: '../preview/main' // 平衡秤使用说明
                },
                {
                    url: 'https://lk-upload-api-pro.op.laikang.com/common/fileDownload/lk-upload/086bb434-3a27-4372-8d5a-435275ca51ff.jpg',
                    path: '../preview/main' // 平衡秤使用说明
                },
                {
                    url: 'https://lk-upload-api-pro.op.laikang.com/common/fileDownload/lk-upload/207211f5-c522-45a0-aae9-ea6d3db17b5e.jpg',
                    path: '../preview/main' // 平衡秤使用说明
                }
            ],
            loginModal: false,
            bottomModal: false,
            showLoading: false,
            isModal: false,
            notScroll: false,
            bgImg: 'https://lk-upload-api-pro.op.laikang.com/common/fileDownload/lk-upload/1db06203-b994-49d3-b9aa-f362fee19d07.jpg', // 测试用图
            // bgImg: 'https://lk-upload-api-pro.op.laikang.com/common/fileDownload/lk-upload/7af89085-b841-440f-86a2-0fc4f9997546.jpg', // 正式图
            bindPhone: true,
            allowEnt: true,
            phoneNumber: '',
            phoneCode: '',
            userName: '',
            inputName: '',
            right: true,
            inputTelephone: '',
            inputCode: '',
            tabsPackageList: [],
            classList: [],
            goodsList: [],
            modalTitle: '',
            modalList: [],
            collapseList: [],
            index: -1,
            name: '三疗',
            toView: '',
            isShowMessage: false, // 健康金领取栏:1.个人进来,不用处理  2.团体用户扫码进来,二维码参数name='group',如果是未绑定电话,则显示领取栏,绑定电话后跳转到健康金领取页 3.如果已绑定电话,进来查询是否有未领取健康金,有就显示领取栏,无就不显示
            groupName: '' // 团检名称
        }
    },
    methods: {
        swiperChange(e) {
            // console.log('swiper滑动', e.mp.detail.current)
            this.currentSwiper = e.mp.detail.current
        },
        gotoNextView(e) {
            // swiper跳转对应页面
            console.log('swiper当前点击跳转', e)
            // let url = encodeUrlParam(e.path)
            // wx.navigateTo({ url })
        },
        getPackageClass() { // 获取分类
            this.showLoading = true
            fetch({
                method: 'GET',
                baseUrl: API.baseUrl,
                api: API.getPackagekinds + '/healthcheck',
                contentType: 'application/json; charset=UTF-8',
                params: {}
            }).then(res => {
                this.showLoading = false
                if (res.data.head.faultcode === 'ok') {
                    this.tabsPackageList = [{
                        name: '推荐',
                        id: '-1'
                    }]
                    this.tabsPackageList = [...this.tabsPackageList, ...res.data.body]
                    this.tabsPackageList.forEach((item, key) => {
                        getStorage('labelClass').then((res) => {
                            let id = res.data
                            if (id === item.id) {
                                item.selectedItem = 'tabsSelect'
                            } else {
                                item.selectedItem = 'tabsNormal'
                            }
                        }).catch((err) => {
                            console.log(err)
                            if (key === 0) {
                                item.selectedItem = 'tabsSelect'
                            } else {
                                item.selectedItem = 'tabsNormal'
                            }
                        })
                    })
                }
            }, err => {
                console.log(err)
                this.errMsg()
            })
        },
        getPackageList() { // 获取套餐列表
            this.classList = []
            let params = {
                'version': '1.0',
                'head': {
                    'firstresult': 0,
                    'maxresults': 100,
                    'bodytype': 'flat',
                    'sortfields': []
                },
                'body': [
                    {
                        'type': 'healthcheck'
                    }
                ]
            }
            this.showLoading = true
            fetch({
                method: 'POST',
                baseUrl: API.baseUrl,
                api: API.getPackageList,
                contentType: 'application/json; charset=UTF-8',
                params: params
            }).then(res => {
                if (res.data.head.faultcode === 'ok') {
                    if (res.data.body.length > 0) {
                        let data = res.data.body
                        this.classList = [...data]
                    }
                }
            }, err => {
                console.log(err)
            })
        },
        getPackageClassList(id) { // 根据分类查询套餐
            this.classList = []
            let params = {
                'version': '1.0',
                'head': {
                    'firstresult': 0,
                    'maxresults': 100,
                    'bodytype': 'flat',
                    'sortfields': []
                },
                'body': []
            }
            fetch({
                method: 'POST',
                baseUrl: API.baseUrl,
                api: `${API.listbykind}/${id}`,
                contentType: 'application/json; charset=UTF-8',
                params: params
            }).then(res => {
                if (res.data.head.faultcode === 'ok') {
                    let data = res.data.body
                    this.classList = [...data]
                }
            }, err => {
                console.log(err)
                this.errMsg()
            })
        },
        getPackageChildList(id, index) { // 获取套餐子项列表
            fetch({
                method: 'GET',
                baseUrl: API.baseUrl,
                api: `${API.getChildInfo}/${id}`,
                contentType: 'application/json; charset=UTF-8',
                params: {}
            }).then(res => {
                this.bottomModal = false
                if (res.data.head.faultcode === 'ok') {
                    let list = res.data.body;
                    for (var i = 0; i < list.length; i++) {
                        list[i].showList = false
                    }
                    this.collapseList = [...list]
                    for (let m = 0; m < this.classList.length; m++) {
                        if (index === m) continue
                        (this.classList)[m].showContent = false
                    }
                    this.classList[index].showContent = !this.classList[index].showContent;
                    // 点击套餐展开子项的时候滚动
                    setScrollTop(id, index, this.classList)
                }
            }, err => {
                console.log(err)
                this.errMsg()
            })
        },
        errMsg(text) {
            wx.showToast({
                title: text || '请求超时，稍后重试',
                icon: 'none',
                duration: 2000
            })
        },
        onGotUserInfo(e) {
            console.log(e)
        },
        login() {
            getStorage('mobile').then((res) => {
                console.log('如果之前绑定过电话,跳转到健康金领取页面,否则登录页面', res)
                if (res.data) {
                    let url = encodeUrlParam(`../healthCash/main`)
                    console.log('跳转到健康金url', url)
                    wx.navigateTo({ url })
                } else {
                    this.loginModal = true
                    this.notScroll = true
                }
            }).catch((err) => {
                console.log(err)
                this.loginModal = true
                this.notScroll = true
            })
        },
        isLogin() {
            fetch({
                method: 'GET',
                baseUrl: API.baseUrl,
                api: API.isLogin,
                contentType: 'application/json; charset=UTF-8',
                params: {}
            }).then(res => {
                let data = res.data.body[0]
                if (data.login === 'false') {
                    console.log('如果未登录就去登录')
                    this.toLogin()
                } else {
                    console.log('检测是否登录:登录成功')
                    setStorage('mobile', data.mobile)
                    setStorage('userid', data.id)
                    if (data.mobile) {
                        console.log('如果是已绑定用户,需要查询是否有健康金.')
                        this.hasCashTicket()
                    } else {
                        console.log('未绑定的用户:是团检的,显示绑定栏;不是团检的,不显示绑定栏')
                        if (this.groupName === 'group') {
                            this.isShowMessage = true
                        } else {
                            this.isShowMessage = false
                        }
                    }
                    // 如果当前分类套餐列表不为空,不刷新
                    if (this.classList.length > 0) {
                        return
                    }
                    this.getPackageClass()
                    getStorage('labelClass').then((res) => {
                        let id = res.data
                        if (id === '-1') {
                            this.getPackageList() // 查询全部
                        } else {
                            this.getPackageClassList(id)
                        }
                    }).catch((err) => {
                        console.log(err)
                        this.getPackageList() // 查询全部
                    })
                }
            }, err => {
                console.log(err)
            })
        },
        toLogin() {
            login().then((res, reject) => {
                console.log(res, '登录')
                if (res.errMsg === 'login:ok') {
                    this.showLoading = true
                    fetch({
                        method: 'GET',
                        baseUrl: API.baseUrl,
                        api: `${API.login}/${Config.orgCode}/${Config.md.appCode}/${res.code}`,
                        contentType: 'application/json; charset=UTF-8',
                        params: {}
                    }).then(res => {
                        this.showLoading = true
                        console.log(res, '登录成功')
                        setStorage('token', res.header['Set-Cookie'])
                        setStorage('loginInfo', res.data.body[0])
                        this.getPackageClass()
                        getStorage('labelClass').then((res) => {
                            let id = res.data
                            if (id === '-1') {
                                this.getPackageList() // 查询全部
                            } else {
                                this.getPackageClassList(id)
                            }
                        }).catch((err) => {
                            console.log(err)
                            this.getPackageList() // 查询全部
                        })
                        this.isLogin() // 再次检测是否登录
                    }, err => {
                        console.log(err)
                    })
                } else {
                    wx.showToast({
                        title: '登录失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        },
        hasCashTicket() {
            fetch({
                method: 'GET',
                baseUrl: API.baseUrl,
                api: `${API.getHasCashTicket}`,
                contentType: 'application/json; charset=UTF-8',
                params: {}
            }).then(res => {
                console.log(res, '是否有健康金查询')
                if (res.data.head.faultcode === 'ok') {
                    if (res.data.head.faultstring === 'true') {
                        console.log('查询到健康金状态:有')
                        this.isShowMessage = true
                    } else {
                        console.log('查询到健康金状态:无')
                        this.isShowMessage = false
                    }
                } else {
                    this.errMsg()
                }
            }, err => {
                console.log('健康金查询失败', err)
            })
        },
        changeContent(index, id) {
            this.bottomModal = true
            this.getPackageChildList(id, index)
        },
        toBuy(item, index) {
            let jsonString = JSON.stringify(item)
            let url = encodeUrlParam(`../packageDetail/main?routeparam=${jsonString}`)
            console.log('跳转到详情页url', url)
            wx.navigateTo({ url })
        },
        showModal(data, index) {
            for (var i = 0; i < this.collapseList.length; i++) {
                if (index === i) {
                    this.collapseList[index].showList = !this.collapseList[index].showList
                }
            }
        },
        getMorePackage() {
            console.log('更多套餐')
            let url = encodeUrlParam('../packageList/main')
            wx.navigateTo({ url })
        },
        closeModal(e) {
            this.loginModal = false
            if (!e) {
                console.log('调用关闭modal', e)
                // 如果是注册成功后,关闭modal.需要跳转到健康金页面
                if (this.groupName === 'group') {
                    let url = encodeUrlParam(`../healthCash/main`)
                    console.log('跳转到健康金url', url)
                    wx.navigateTo({ url })
                }
            }
            this.isModal = false
            this.notScroll = false
            this.modalTitle = ''
            this.modalList = []
        },
        packageItemChange(item, index) {
            console.log(item)
            for (var i = 0; i < this.tabsPackageList.length; i++) {
                this.tabsPackageList[i].selectedItem = 'tabsNormal'
                if (i === index) {
                    this.tabsPackageList[i].selectedItem = 'tabsSelect'
                    var name = this.tabsPackageList[i].name
                    this.tabsPackageList[i].name = ''
                    this.tabsPackageList[i].name = name
                    if (item.id === '-1') {
                        this.getPackageList() // 查询全部
                    } else {
                        this.getPackageClassList(item.id) // 根据分类查询
                    }
                }
            }
            setStorage('labelClass', item.id)
        },
        toDetailPage(item, index) {
            let jsonString = JSON.stringify(item)
            let url = encodeUrlParam(`../packageDetail/main?routeparam=${jsonString}`)
            console.log('跳转到详情页url', url)
            wx.navigateTo({ url })
        },
        // 是否团检用户
        dealGroupMedical() {
            this.groupName = ''
            var pages = getCurrentPages() // 获取加载的页面
            var currentPage = pages[pages.length - 1] // 获取当前页面的对象
            var options = currentPage.options // 如果要获取url中所带的参数可以查看options
            console.log('onshow options', options)
            if (options.name) {
                // 只有扫码才进入此方法
                this.groupName = options.name
            }
        }
    },
    created() {
        setStorage('baseUrl', API.baseUrl)
    },
    onShow() {
        console.log('首页onshow')
        this.dealGroupMedical()
        this.isLogin()
    },
    mounted() {
    },
    onShareAppMessage(res) {
        console.log(res)
        if (res.from === 'button') {
            console.log(res.target)
        };
        return {
            title: '三疗健康',
            path: '/pages/index/main',
            imageUrl: 'https://lk-upload-api-pro.op.laikang.com/common/fileDownload/lk-upload/2c960003-3668-4c75-af80-08b74a37b527.jpg'
        }
    }
}
</script>
<style lang='scss'>
    page{
        position: relative;
        height: 100%;
        /*overflow: auto;*/
    }
    .modal{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0,0,0, .6);
        z-index: 20000;
        .content{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            .showModal{
                position: relative;
                width: 70%;
                height: 50%;
                margin-top: 30%;
                background: #fff;
                border-radius: 10rpx;
                -webkit-border-radius: 10rpx;
                padding: 0 20rpx;
                overflow: hidden;
                .title{
                    position: relative;
                    height: 80rpx;
                    font-size: 28rpx;
                    line-height: 80rpx;
                    text-align: left;
                    border-bottom: 2rpx solid #F6E8F1;
                    img{
                        position: absolute;
                        top: 20rpx;
                        right: 0;
                        width: 30rpx;
                        height: 30rpx;
                    }
                }
                .text{
                    position: absolute;
                    top: 82rpx;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    ul{
                        width: 100%;
                        height: 100%;
                        overflow: auto;
                        li{
                            margin: 0 20rpx;
                            font-size: 24rpx;
                        }
                        .childDetail{
                            border-bottom: 2rpx solid #f1f1f1;
                            overflow: hidden;
                            padding: 10rpx 0;
                            .left{
                            }
                            .right{
                            }
                        }
                    }
                    .name,.telephone,.code{
                        position: relative;
                        height: 100rpx;
                        margin: 20rpx;
                        display: block;
                        overflow: hidden;
                        .left{
                            float: left;
                            height: 100rpx;
                            width: 120rpx;
                            padding-left: 20rpx;
                            line-height: 100rpx;
                            font-size: 28rpx;
                            color: #1b1b1b;
                            text-align: left;
                            box-sizing: border-box;
                            -webkit-box-sizing: border-box;
                        }
                        .right{
                            margin-left: 120rpx;
                            height: 100rpx;
                            overflow: hidden;
                            input{
                                height: 40rpx !important;
                                min-height: 40rpx;
                                max-height: 40rpx;
                                background:none;
                                outline:none;
                                border:0px;
                                margin: 30rpx 0;
                                width: 100%;
                                /*line-height: 40rpx;*/
                                font-size: 28rpx;
                            }
                            .placeClass{
                                font-size: 28rpx;
                                line-height: 40rpx;
                                height: 40rpx;
                            }
                        }
                        .codeNum{
                            display: block;
                            margin-right: 200rpx;
                            background: #f1f1f1;
                        }
                        .time{
                            position: absolute;
                            width: 200rpx;
                            height: 100rpx;
                            right: 0;
                            top: 0;
                            .timeBtn{
                                margin-left: 10rpx;
                                height: 100%;
                                line-height: 100rpx;
                                text-align: center;
                                font-size: 28rpx;
                                background: #fd4346;
                                color: #fff;
                            }
                            .send{
                                background: rgba(253,67,70,.7);
                            }
                        }
                    }
                    .name,.telephone{
                        background: #f1f1f1;
                    }
                    .login{
                        width: 60%;
                        height: 80rpx;
                        line-height: 80rpx;
                        color: #fff;
                        border-radius: 8rpx;
                        -webkit-border-radius: 8rpx;
                        margin: 10rpx auto;
                        text-align: center;
                        background: #fd4346;
                    }
                }
            }
        }
    }
    .box{
        .titleBar{
            position: relative;
            width: 750rpx;
            height: 450rpx;
            overflow: hidden;
            img{
                width: 100%;
                height: 100%;
            }
            .swiperSet{
                width: 100%;
                height: 450rpx;
                .slide-image{
                    width: 100%;
                    height: 100%;
                }
            }
            /*用来包裹所有的小圆点  */
            .dots{
                width: 100%;
                height: 60rpx;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                position: absolute;
                left: 0rpx;
                bottom: 0rpx;
            }
            .dotNormal,.dotSelected {
                margin: 10rpx;
                width: 16rpx;
                height: 16rpx;
                border-radius: 50%;
            }

            /*未选中时的小圆点样式 */
            .dotNormal{
                background-color: rgba(130,130,130,0.8);
            }
            /*选中以后的小圆点样式  */
            .dotSelected{
                background-color: rgba(202,202,202,0.8);
            }
        }
        .messageBar{
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 120rpx;
            background: rgba(253,58,63,.8);
            overflow: hidden;
            .tipMsg{
                float: left;
                margin-left: 20rpx;
                height: 120rpx;
                line-height: 120rpx;
                font-size: 24rpx;
                color: #fff;
            }
            img{
                float: left;
                width: 140rpx;
                height: 120rpx;
                opacity: 0.8
            }
            .login{
                width: 100rpx;
                height: 48rpx;
                border: 2rpx solid #fff;
                line-height: 48rpx;
                margin: 36rpx 0;
                font-size: 22rpx;
                color: #fff;
                float: right;
                margin-right: 20rpx;
                text-align: center;
                border-radius: 8rpx;
                -webkit-border-radius: 8rpx;
            }
        }
        .bottomModal{
            height: 1000rpx;
        }
        .package{
            .title-one{
                position: relative;
                height: 100rpx;
                line-height: 100rpx;
                overflow: hidden;
                border-bottom:2rpx solid #F8F8F8;
                .left{
                    float: left;
                    font-size: 28rpx;
                    color: #1b1b1b;
                    margin-left: 20rpx;
                }
                .right{
                    float: right;
                    font-size: 22rpx;
                    color: #888;
                    margin-right: 30rpx;
                }
                .morePackage{
                    width: 22rpx;
                    height: 20rpx;
                    position: absolute;
                    top: 40rpx;
                    right: 10rpx;

                }
            }
            .classification{
                display: flex;
                margin: 0 20rpx;
                justify-content: space-between;
                .tabs{
                    padding: 20rpx 0;
                    height: 48rpx;
                    font-size: 24rpx;
                    line-height: 48rpx;
                    width: 120rpx;
                    text-align: center;
                }
                .tabsSelect{
                    border-bottom: 4rpx solid #fd4346;
                    color: #fd4346;
                }
                .tabsNormal{
                    color: #1b1b1b;
                }
            }
            .classification-page{
                border-bottom: 20rpx solid #f1f1f1;
                box-shadow: 0 5px 15px 0 rgba(78,24,2,0.12);
                .classification-list{
                    .card{
                        height: 438rpx;
                        z-index: 100;
                        background: #fff;
                    }
                    .packImg{
                        position: relative;
                        overflow: hidden;
                        img{
                            display: block;
                            width: 750rpx;
                            height: 320rpx;
                            margin: 0;
                            padding: 0;
                        }
                        .packDetail{
                            position: absolute;
                            right:10rpx;
                            bottom: 10rpx;
                            width: 110rpx;
                            height: 36rpx;
                            font-size: 24rpx;
                            color: #fd4346;
                            border-radius: 18rpx;
                            -webkit-border-radius: 18rpx;
                            background: #f1f1f1;
                            .package-nickName{
                                width: 100%;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                img{
                                    width: 30rpx;
                                    height: 30rpx;
                                    margin-left: 10rpx;
                                }
                            }
                        }
                        .label{
                            position: absolute;
                            top: 10rpx;
                            width: 100%;
                            height: 36rpx;
                            .label-line{
                                width: 100%;
                                height: 100%;
                                overflow: hidden;
                            }
                            .text{
                                float: right;
                                margin-right: 10rpx;
                                width: 80rpx;
                                height: 36rpx;
                                font-size: 24rpx;
                                color: #fff;
                                text-align: center;
                                border-radius: 5rpx;
                                background: rgba(229,158,42,.8);
                            }
                        }
                    }
                    .classTitle{
                        position: relative;
                        display: flex;
                        margin: 0 20rpx;
                        height: 118rpx;
                        overflow: hidden;
                        .buyBtn{
                            width: 130rpx;
                        }
                        .packageModal{
                            flex: 1;
                            .name{
                                display: flex;
                                flex-direction: row;
                                height: 28rpx;
                                line-height: 28rpx;
                                font-size: 28rpx;
                                color: #1b1b1b;
                                margin: 20rpx 0;
                                .detailBtn{
                                    position: relative;
                                    height: 40rpx;
                                    line-height: 40rpx;
                                    border-radius: 20rpx;
                                    background: #f5f6f5;
                                    color: #1b1b1b;
                                    text-align: center;
                                    font-size: 20rpx;
                                    width: 150rpx;
                                    padding-right: 20rpx;
                                    margin-top: -6rpx;
                                    margin-left: 5rpx;
                                    /*margin-top: 40rpx;*/
                                    .double{
                                        position: absolute;
                                        right: 10rpx;
                                        top: 10rpx;
                                        width: 30rpx;
                                        height: 30rpx;
                                        animation: myfirst 2s infinite;
                                    }
                                    @keyframes myfirst {
                                        0% {
                                            transform: translate(0px, 0px);
                                        }
                                        50% {
                                            transform: translate(0px, -8rpx);
                                        }
                                        100% {
                                            transform: translate(0px, 0px);
                                        }
                                    }
                                }
                            }
                            .price{
                                height: 30rpx;
                                line-height: 30rpx;
                                font-size: 30rpx;
                                color: #fd4346;
                                margin: 20rpx 0;
                                span{
                                    font-size: 24rpx;
                                    color: #888888;
                                    margin-left: 20rpx;
                                    text-decoration:line-through;
                                }
                            }
                        }
                        .buyBtn{
                            justify-content: flex-end;
                            .buy{
                                width: 120rpx;
                                height: 48rpx;
                                margin: 35rpx auto;
                                line-height: 48rpx;
                                color: #fd4346;
                                border: 2rpx solid #fd4346;
                                border-radius: 8rpx;
                                -webkit-border-radius: 8rpx;
                                overflow: hidden;
                                font-size: 22rpx;
                                text-align: center;
                            }
                        }
                    }
                }
            }
            .goosBg{
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                .goodsItem{
                    width: 372rpx;
                    height: 355rpx;
                    .goodsImg{
                        width: 372rpx;
                        height: 240rpx;
                        display: block;
                    }
                    .goodsLabel{
                        margin: 20rpx;
                        color: #1B1B1B;
                        font-size: 26rpx;
                        line-height: 26rpx;
                    }
                    .goodsPrice{
                        margin-left: 20rpx;
                        color: #FD4346;
                        font-size: 30rpx;
                    }
                }
                .goodsItem1{
                    width: 372rpx;
                    height: 355rpx;
                    margin-left: 6rpx;
                    .goodsImg{
                        width: 372rpx;
                        height: 240rpx;
                        display: block;
                    }
                    .goodsLabel{
                        margin: 20rpx;
                        color: #1B1B1B;
                        font-size: 26rpx;
                        line-height: 26rpx;
                    }
                    .goodsPrice{
                        margin-left: 20rpx;
                        color: #FD4346;
                        font-size: 30rpx;
                    }
                }
                .goodsItem:nth-child(2n){
                    margin-left: 6rpx;
                }
                .goodsItem:nth-child(2n+1){
                    margin: 0rpx;
                }
            }
            .collapse{
                position: relative;
                border-top: 2rpx solid #f1f1f1;
                border-bottom: 20rpx solid #f1f1f1;
                overflow: hidden;
                z-index: 50;
                .title{
                    display: block !important;
                    height: 110rpx;
                    line-height: 110rpx;
                    color: #1b1b1b;
                    font-size: 28rpx;
                    text-align: center;
                    border-bottom: 2rpx solid #F1F1F1;
                }
                ul{
                    li{
                        border-bottom: 2rpx solid #F1F1F1;
                        margin-left: 30rpx;
                        .line{
                            position: relative;
                            display: block;
                            padding:30rpx 40rpx 20rpx 0;
                            box-sizing: border-box;
                            -webkit-box-sizing: border-box;
                            /*overflow: hidden;*/
                            .smallBox{
                                position: absolute;
                                left: -15rpx;
                                width: 10rpx;
                                top: 26rpx;
                                height: 36rpx;
                                background: #FD4346;
                            }
                            .left{
                                position: relative;
                                margin:0 30rpx 0 0;
                                h5{
                                    font-size: 28rpx;
                                    line-height: 28rpx;
                                    color: #323232;
                                    font-weight: normal;
                                }
                            }
                            .right{
                                position: relative;
                                margin:0 20rpx 0 0;
                                font-size: 24rpx;
                                color: #727272;
                                .discription{
                                    margin-top:30rpx;
                                }
                            }
                            .icon-box{
                                position: absolute;
                                top: 0;
                                width: 20rpx;
                                height: 20rpx;
                                right: -40rpx;
                                bottom: 0;
                                .icon-child{
                                    width: 100%;
                                    height: 100%;
                                    img{
                                        display: block;
                                        width: 20rpx;
                                        height: 20rpx;
                                    }
                                }
                            }
                        }
                        .lineBottom{
                            padding-bottom: 10rpx;
                        }
                        .childModal{
                            border-top: 2rpx solid #f1f1f1;
                            .childDetail{
                                padding: 5rpx;
                                margin-left: 20rpx;
                                padding-right: 40rpx;
                                border-bottom: 2rpx solid #f1f1f1;
                                .left{
                                    h5{
                                        font-size: 24rpx;
                                        color:#323232;
                                        margin: 20rpx 0;
                                        font-weight: normal;
                                    }
                                }
                                .right{
                                    font-size: 24rpx;
                                    color: #727272;
                                    margin: 0 ;
                                    margin-left: 10rpx;
                                    margin-bottom: 20rpx;
                                }
                            }
                            .noBorder{
                                border:none !important;
                            }
                        }
                        .content{
                            border-top: 2rpx solid #ebedec;
                        }
                    }
                }
            }
            /*base code*/
            .animated {
                -webkit-animation-duration: 0.3s;
                animation-duration: 0.3s;
                -webkit-animation-fill-mode: both;
                animation-fill-mode: both;
            }
            .animated.infinite {
                -webkit-animation-iteration-count: infinite;
                animation-iteration-count: infinite;
            }
            .animated.hinge {
                -webkit-animation-duration: 0.3s;
                animation-duration: 0.3s;
            }
            /*the animation definition*/
            @-webkit-keyframes fadeInDownBig {
                0% {
                    opacity: 0;
                    -webkit-transform: translate3d(0, -500rpx, 0);
                    transform: translate3d(0, -500rpx, 0)
                }
                100% {
                    opacity: 1;
                    -webkit-transform: none;
                    transform: none
                }
            }
            @keyframes fadeInDownBig {
                0% {
                    opacity: 0;
                    -webkit-transform: translate3d(0, -500rpx, 0);
                    -ms-transform: translate3d(0, -500rpx, 0);
                    transform: translate3d(0, -500rpx, 0)
                }
                100% {
                    opacity: 1;
                    -webkit-transform: none;
                    -ms-transform: none;
                    transform: none
                }
            }
            .fadeInDownBig {
                -webkit-animation-name: fadeInDownBig;
                animation-name: fadeInDownBig
            }
            .title{
                display: flex;
                .t-left,.t-right{
                    flex: 1;
                    text-align: center;
                    height: 80rpx;
                    line-height: 80rpx;
                }
            }
        }
    }
    .preventTouchMove{
        top: 0px ;
        left:   0px ;
        width:   100% ;
        height:   100% ;
        overflow:   hidden ;
        position:   fixed ;
        z-index:   0 ;
    }
</style>
