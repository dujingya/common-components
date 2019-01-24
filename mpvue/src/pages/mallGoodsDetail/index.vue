<template>
    <div class='package'>
        <div class="list">
            <div class="swiper-wrapper">
                <swiper  autoplay="true" interval="3000" duration="1000"  circular="true" current="currentSwiper" @change="swiperChange" class="swiperSet">
                    <div v-for="(item, index) in content.media" :index="index" :key="key">
                        <swiper-item>
                            <image :src="item.url" v-if="item.type == 'img'" class="slide-image" mode="aspectFill"/>
                            <image :src="item.logo" v-if="item.type != 'img'" class="slide-image" mode="aspectFill"/>
                        </swiper-item>
                    </div>
                </swiper>
                <div v-if="content.media&&(content.media.length > 1)" class="imageCount">
                    {{currentSwiper+1}} / {{content.media.length}}
                </div>
            </div>
            <div class="detail-title">
                <div class="left-content">
                    <div class="goods-name">{{data.name}}</div>
                    <div class="tag-list">
                        <div v-for="(data, v) in data.tags" :key="v" class="tag-btn" @click.stop="toMallTag(data)">
                            {{data}}
                        </div>
                    </div>
                    <div class="goods-money" v-if="showPriceInter">
                        ￥<span>{{data.prices}}</span>
                    </div>
                    <div class="goods-money" v-else>
                        ￥<span>{{data.prices[0]}}</span>~<span>￥{{data.prices[1]}}</span>
                    </div>
                    <div class='right-content' @click='shareModalToggle'>
                        <img  class="for-share" src="../../image/shareicon.jpg"></img>
                        <div class="share-text">分享</div>
                    </div>
                </div>
            </div>
            <div class="detail-info-flex" v-if="data.type == 'goods'">
                <div>运费:￥{{data.freight}}</div>
                <div>配送或自提</div>
                <div>剩余:{{remain}}</div>
            </div>
            <div class="detail-info-flex beishu'">
                <div>
                    <img src="../../image/qixiu/check.png" class='iconfont icon-kongxinduigou'></img>
                    企业认证
                </div>
                <div>
                    <img src="../../image/qixiu/check.png" class='iconfont icon-kongxinduigou'></img>
                    品牌认证
                </div>
                <div>
                    <img src="../../image/qixiu/check.png" class='iconfont icon-kongxinduigou'></img>
                    线下实体店
                </div>
            </div>
            <div class="info-tab">
                <div class="item">商品详情</div>
                <div style="position:relative;">
                    <div class='detail-html'>
                        <wxParse :content="content.goodsDetail"  @preview="preview" />
                        <!--<rich-text :nodes="detail"></rich-text>-->
                    </div>
                </div>
            </div>
            <div class="load-more">更多为您推荐</div>
            <div class="detail-flex">
                <div class='item' v-for="(item, k) in recommandList" @click="toRecommand(item)" :key="k">
                    <div class="item-area">
                        <div class="item-p-area">
                            <div class='p-tit'>{{item.name}}</div>
                        </div>
                        <img :src='item.logo'/>
                    </div>
                </div>
            </div>
            <div class="provider">来康提供技术支持</div>
        </div>
        <div class="footer-fixed-operate menu">
            <div class="left-icon">
                <navigator url='/pages/index/main' open-type="reLaunch" class='item'>
                    <img class="iconfont" src="../../image/qixiu/home.png"/>
                    <div class="text">首页</div>
                </navigator>
                <div class="item" @click="enshrine">
                    <img class="iconfont" v-if="data.favorite == 'false'" src="../../image/qixiu/shoucang.png"/>
                    <img class="iconfont" v-else src="../../image/qixiu/shoucang1.png"/>
                    <div class="text">{{data.favorite == 'false' ? '收藏' : '取消'}}</div>
                </div>
                <!--<div class="item">-->
                    <!--<img class="iconfont" src="../../image/qixiu/hongbao.png"/>-->
                    <!--<div class="text">红包</div>-->
                <!--</div>-->
            </div>
            <div class="red-item">
                <navigator v-if="data.state == 0" class='disabled' bindtap="handlerDisabled">
                    <text class='buy-text'>已下架</text>
                </navigator>
                <block v-if="data.state == 1">
                    <navigator v-if="data.type == 'goods' && kindDesc == true" @click="openBuy">
                        <img src="../../image/qixiu/detail/shopping.svg"/>
                        <div class="buy-text">购买</div>
                    </navigator>
                    <navigator v-if="data.link && data.type == 'goods' && kindDesc == false" open-type="navigate"
                               target="miniProgram" :app-id="wxf68d7e2a815f3faa" :path="'/'+data.link">
                        <img src="../../image/qixiu/detail/shopping.svg"/>
                        <div class="buy-text">购买</div>
                    </navigator>
                    <navigator v-if="data.link && data.type == 'course'" open-type="navigate" target="miniProgram"
                               :app-id="wx7867d9691b9d525e" :path="'/'+data.link">
                        <img src="../../image/qixiu/detail/shopping.svg"/>
                        <text class='buy-text'>预约</text>
                    </navigator>
                    <navigator v-else class='disabled'>
                        <img src="../../image/qixiu/detail/shopping.svg"/>
                        <text class='buy-text'>预约</text>
                    </navigator>
                </block>
            </div>
        </div>
        <!-- 选择商品规格弹出层 -->
        <div class="modal sku-modal" v-if="buyShow == true && data.type === 'goods'">
            <div class="sku-modal-content">
                <div class="sku-modal-header">
                    <img class='avatar' mode='scaleToFill' :src='data.suites[0].img'></img>
                    <div style="width:100%;display:inline-block;">
                        <div class="prop name">{{data.shortname}}</div>
                        <div class="prop money">¥
                            <text>{{data.suites[0].price}}</text>
                            <text class='yuanjia' v-if="data.suites[0].original">原价￥ {{data.suites[0].original}}</text>
                        </div>
                    </div>
                    <img class="close"  @click="closeBuyModal" src="../../image/qixiu/detail/close.svg"></img>
                </div>
                <div class="car-border"></div>
                <div class="sku-body">
                    <div id="popupSkuArea" v-if="data.suites.length>1&&data.suites[0].name !== ''">
                        <div class="sku_kind">{{suitename}}</div>
                        <div class="sku_choose">
                            <div v-for="(item, f) in data.suites" :key="f"  @click='seleGoods'
                                  class='item' :class="{active: item.name == data.name}">
                                {{item.name}}
                            </div>
                        </div>
                    </div>
                    <div class="car-border"></div>
                    <div class="count_choose" id="popupCount">
                        <div class="count">
                            <div>数量</div>
                            <div style="font-size:12px;color:#999;">剩余{{remain}}件</div>
                        </div>
                        <div class="num_wrap_v2">
                            <div class="minus" :class="{numDisab:showMinus == false}" @click="minus">
                                <div class="row"></div>
                            </div>
                            <div class="plus number" style="background-color:#fff;">{{purNum}}</div>
                            <div class="plus" :class="{numDisab: showPlus == false}" id="plus1" @click="plus">
                                <div class="row"></div>
                                <div class="col"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btns show">
                    <button v-if="purNum > 0" class="btn red" @getuserinfo="goOrder" open-type="getUserInfo">
                        下一步
                    </button>
                    <button v-if="purNum < 1" class="btn" style="background-color:#e0e0e0;">
                        下一步
                    </button>
                </div>
            </div>
        </div>
        <!-- 生成分享图片弹出层 -->
        <canvas canvas-id="ShareImg" class='canvas-dom' style='width:750px;height:1400px;'></canvas>

        <div class='modal hbmodal' v-if='shareImg.show' @click="shareImgModalClose">
            <div class='modal-content' >
                <div>
                    <img :src="shareImg.imgc" mode='widthFix'></img>
                </div>
                <div class='downImg'>
                    <button class='btn' @click='downImg'>下载图片</button>
                </div>
            </div>
        </div>
        <div class="modal bottom-select" v-if='shareModal' @click='shareModalToggle'>
            <div class='modal-content' style="display: block;">
                <div class="modal-header fanli-header" v-if="pgpscid">
                    <div class="title">分享赚 <text class="money">￥{{data.buyprofit}}</text> 现金</div>
                    <div style="color: #666;line-height: 1.6;margin-top: 5px;">
                        您通过直接分享给好友，或生成分享海报给好友，好友点击链接后购买，即可获得现金券，<text @click="handlerPgpscDetail">查看详情</text>
                    </div>
                </div>
                <div class="modal-body" style="width: 100%;display: flex;min-height: 0;">
                    <button class='btn' open-type="share">
                        <div>
                            <img class="footer-one" src="../../image/qixiu/detail/weixin.svg"></img>
                            <div v-if="!isFanLi">分享给好友</div>
                            <div v-else>分享返利</div>
                        </div>
                    </button>
                    <button class='btn' @click='openPoster'>
                        <div>
                            <img class="footer-one" src="../../image/qixiu/detail/poster.svg"></img>
                            <div>生成分享海报</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        <Navigation></Navigation>
        <bindingphone :showBindPhone="loginModal" @listenToChildCloseModal="closeModal"></bindingphone>
    </div>
</template>
<script>
    import {
        encodeUrlParam
    } from '@/utils/urlTool'
    import wxParse from 'mpvue-wxparse'
    import * as API from '@/service/api'
    import fetch from '@/service/fetch'
    import {
        htmlFormat,
        addFootmark
    } from '@/utils/index'
    import {
        login,
        getStorage,
        setStorage
    } from '@/utils/wechat'
    import initImg from '@/utils/getImg'
    import Config from '@/utils/config'
    import Navigation from '@/components/navigation'
    import bindingphone from '@/components/bindingphone'
    export default {
        components: {
            wxParse,
            Navigation,
            bindingphone
        },
        data() {
            return {
                currentSwiper: 0,
                shareModal: false,
                kindDesc: false,
                remain: 0, // 剩余数量
                buyShow: false,
                purNum: 1,
                pgpscid: '',
                loginModal: false,
                firstImage: '',
                suitename: '规格',
                showMinus: false,
                showPlus: true,
                shareImg: {
                    show: false,
                    imgc: ''
                },
                showPriceInter: true,
                data: {},
                content: {},
                recommandList: []
            };
        },
        methods: {
            preview(src, e) {
                console.log(src, e)
            },
            login() {
                getStorage('mobile').then((res) => {
                    if (!res.data) {
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
                        this.getGoodsMsg()
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
                            this.showLoading = false
                            console.log(res, '登录成功')
                            setStorage('token', res.header['Set-Cookie'])
                            setStorage('loginInfo', res.data.body[0])
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
            closeModal(e) {
                this.loginModal = false
                this.notScroll = false
            },
            toRecommand(item) { // 更多推荐跳转
                let url = encodeUrlParam('../mallGoodsDetail/main?id=' + item.id)
                wx.navigateTo({
                    url
                })
            },
            enshrine() {
                let id = this.data.id
                let url = ''
                if (this.data.favorite === 'true') {
                    url = API.cancelfavorite
                } else {
                    url = API.savefavorite
                }
                fetch({
                    method: 'POST',
                    baseUrl: API.baseUrl,
                    api: `${url}/${id}`,
                    contentType: 'application/json; charset=UTF-8',
                    params: []
                }).then(res => {
                    if (res.data.head.faultcode === 'ok') {
                        if (this.data.favorite === 'true') {
                            this.data.favorite = 'false'
                        } else {
                            this.data.favorite = 'true'
                        }
                    }
                }, err => {
                    console.log(err)
                })
            },
            getGoodsMsg() { // 获取商品信息
                let id = this.$root.$mp.query.id
                this.classList = []
                let params = {
                    'version': '1.0',
                    'head': {
                        'firstresult': 0,
                        'maxresults': 6,
                        'bodytype': 'flat',
                        'sortfields': []
                    },
                    'body': [{}]
                }
                this.showLoading = true
                fetch({
                    method: 'POST',
                    baseUrl: API.baseUrl,
                    api: `${API.goodsMsg}/${id}`,
                    contentType: 'application/json; charset=UTF-8',
                    params: params
                }).then(res => {
                    if (res.data.head.faultcode === 'ok') {
                        if (res.data.body.length > 0) {
                            this.data = res.data.body[0];
                            this.content = JSON.parse(this.data.content)
                            this.content.goodsDetail = htmlFormat(this.content.goodsDetail)
                            this.data.tags = this.data.tags.length ? this.data.tags.split(',') : []
                            console.log('tags', this.data.tags)
                            if (this.content.media.length > 0) {
                                this.firstImage = this.content.media[0].url
                            }
                            // 价格与价格区间
                            if (this.data.prices.indexOf('~') !== -1) {
                                this.data.prices = this.data.prices.split('~');
                                this.showPriceInter = false;
                            }
                            for (let i of this.data.suites) {
                                this.remain += parseInt(i.stock)
                            }
                            if (this.data.suites.length > 0) {
                                if (this.data.suites[0] === 0) {
                                    this.purNum = 0;
                                }
                            }
                            this.kindDesc = true
                            // 规格
                            if (this.data.suitename) {
                                this.suitename = this.data.suitename;
                            }
                            this.content.shareimg = this.data.shareimg
                            let obj = {
                                logo: this.data.logo,
                                id: this.data.id,
                                name: this.data.name,
                                type: this.data.type,
                                time: new Date().getTime()
                            }
                            wx.setNavigationBarTitle({
                                title: this.data.name
                            })
                            addFootmark(obj)
                            // 获取更多推荐
                            this.moreRecommand()
                        }
                    }
                }, err => {
                    console.log(err)
                })
            },
            minus() { // 选择数量减一
                if (this.purNum > 1) {
                    let num = this.purNum - 1;
                    if (num === 1) {
                        this.showMinus = false;
                    }
                    this.purNum = num
                }
            },
            plus() { // 选择数量加一
                if (this.purNum < parseInt(this.data.suites[0].stock)) {
                    let num = this.purNum + 1;
                    this.showPlus = true;
                    this.showMinus = true;
                    if (num === parseInt(this.data.suites[0].stock)) {
                        this.showPlus = false;
                    }
                    this.purNum = num
                }
            },
            moreRecommand() {
                let params = {
                    'version': '1.0',
                    'head': {
                        'firstresult': 0,
                        'maxresults': 6,
                        'bodytype': 'flat',
                        'sortfields': []
                    },
                    'body': [{
                        value: this.data.tags.join()
                    }]
                }
                fetch({
                    method: 'POST',
                    baseUrl: API.baseUrl,
                    api: `${API.recommended}/${Config.orgCode}`,
                    contentType: 'application/json; charset=UTF-8',
                    params: params
                }).then(res => {
                    if (res.data.head.faultcode === 'ok') {
                        this.recommandList = res.data.body[0].goods
                    }
                }, err => {
                    console.log(err)
                })
            },
            swiperChange(e) {
                console.log('swiper滑动', e.mp.detail.current)
                this.currentSwiper = e.mp.detail.current
            },
            closeBuyModal() {
                this.buyShow = false
            },
            shareModalToggle() {
                this.shareModal = !this.shareModal
            },
            shareImgModalClose() {
                this.shareImg.show = false
            },
            // 生成分享海报图片
            openPoster() {
                let firstImg = this.firstImage
                let QRUrl = `${Config.baseURL}/api/wxapp/qrcode/${Config.orgCode}/billboardapp?shape=circular&path=pages/mallGoodsDetail/main?id=${this.data.id}&pgpscid=${this.pgpscid}&isShare=true`

                let data = {
                    qrUrl: QRUrl,
                    goodsimg: firstImg,
                    autoimg: this.data.shareimg || 'https://laikang.oss-cn-beijing.aliyuncs.com/iqx/autoshare.jpg',
                    goodsname: this.data.name,
                    goodsmoney: '￥' + this.data.suites[0].price,
                    goodstype: this.data.suites[0].name
                }
                wx.showLoading({
                    title: '海报生成中'
                })
                initImg('ShareImg', data).then(res => {
                    console.log(res, '获取图片-=--------')
                    this.shareImg.show = true
                    this.shareImg.imgc = res.img
                    wx.hideLoading()
                }).catch(e => {
                    wx.hideLoading()
                })
            },
            // 下载海报
            downImg() {
                wx.saveImageToPhotosAlbum({
                    filePath: this.shareImg.imgc,
                    success: res => {
                        wx.showToast({
                            title: '保存成功'
                        })
                    }
                })
                // app.mdFn({
                //     eventId: '8118',
                //     eventDesc: '下载图片',
                //     eventValue: this.data.id
                // })
            },
            toMallTag(ev) {
                let param = {
                    tag: ev
                }
                let url = encodeUrlParam(`../mallTag/main?routeparam=${JSON.stringify(param)}`)
                console.log('跳转到tag的url', url)
                wx.navigateTo({ url })
            },
            openBuy() {
                this.buyShow = true
            },
            goOrder () {
                let param = {
                    goodsid: this.data.id,
                    img: this.data.suites[0].img,
                    name: this.data.name,
                    price: this.data.suites[0].price,
                    amount: this.purNum,
                    freight: this.data.freight,
                    suiteid: this.data.suites[0].id
                }
                let url = encodeUrlParam(`../mallClose/main?routeparam=` + JSON.stringify(param))
                console.log('跳转到下单页', url)
                wx.navigateTo({ url })
            }
        },
        onShow() {
        },
        /**
         * 用户点击右上角分享
         */
        onShareAppMessage() {
            let imgUrl = this.data.shareimg || this.firstImage
            let title = this.data.sharedesc || this.data.name;
            var obj = {
                title,
                path: `/pages/mallGoodsDetail/main?id=${this.data.id}&isShare=true`,
                imageUrl: imgUrl
            }
            return obj;
        },
        mounted() {
            // 获取商品信息
            this.purNum = 1
            this.buyShow = false
            this.recommandList = []
            this.data = {}
            this.content = {}
            let routeParam = this.$root.$mp.query
            if (routeParam.isShare) {
                this.isLogin()
            } else {
                this.getGoodsMsg()
            }
        }
    };
</script>
<style lang='scss'>
    @import url("~mpvue-wxparse/src/wxParse.css");
    page{
        height: 100%;
        background: #fafafa;
    }
    .wxParse .h1, .wxParse .h2, .wxParse .h3, .wxParse .h4, .wxParse .h5, .wxParse .h6, .wxParse .b, .wxParse .strong {
        font-weight:bolder;
        word-wrap:break-word;
        box-sizing: border-box;
        word-wrap:break-word;
    }
    .wxParse .i, .wxParse .cite, .wxParse .em, .wxParse .var, .wxParse .address {
        font-style:italic;
        word-wrap:break-word;
        box-sizing: border-box;
        word-wrap:break-word;
    }
    .wxParse .pre, .wxParse .tt, .wxParse .code, .wxParse .kbd, .wxParse .samp,.wxParse view{
        font-family:monospace;
        word-wrap:break-word;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }
    .wxParse view{
        word-wrap:break-word;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }

    .package{
       .list{
           .swiper-wrapper{
               position: relative;
               width: 100%;
               height: 750rpx;
               img{
                   width: 100%;
                   height: 100%;
               }
               .swiperSet{
                   width: 100%;
                   height: 750rpx;
                   .slide-image{
                       width: 100%;
                       height: 100%;
                   }
               }
               .imageCount {
                   width: 80rpx;
                   height: 40rpx;
                   line-height: 40rpx;
                   text-align: center;
                   color: #ffffff;
                   font-size: 26rpx;
                   border-radius: 8px;
                   display: block;
                   position: absolute;
                   right: 30rpx;
                   bottom: 30rpx;
                   background-color: #666;
                   opacity: 0.5;
               }
           }
           .detail-title{
               display:flex;
               justify-content:space-between;
               background-color:#fff;
               width:100%;
               box-sizing: border-box;
               -webkit-box-sizing: border-box;
               color:#000;
               font-size:32rpx;
               padding:30rpx 25rpx;
               border-bottom:2rpx solid #ececec;
               .left-content{
                   position: relative;
                   flex:1;
                   width: 100%;
                   line-height:40rpx;
                   word-break:break-all;
                   word-wrap:break-word;
                   display:flex;
                   flex-direction:column;
                   overflow: hidden;
                   .goods-name{
                       padding-right: 70rpx;
                       box-sizing: border-box;
                       -webkit-box-sizing: border-box;
                       overflow: hidden;
                       text-overflow:ellipsis;
                       white-space: nowrap;
                   }
                   .tag-list{
                       display:block;
                       font-size:28rpx;
                       color:#999;
                       margin-top:20rpx;
                       padding-right: 60rpx;
                       box-sizing: border-box;
                       -webkit-box-sizing: border-box;
                       .tag-btn{
                           display:inline-block;
                           padding:0 10rpx;
                           min-width:80rpx;
                           text-align:center;
                           margin:0 30rpx 15rpx 0;
                           height:40rpx;
                           line-height:38rpx;
                           font-size:24rpx;
                           border-radius:12rpx;
                           color:#fd4346;
                           white-space:nowrap;
                           border:2rpx solid #fd4346;
                           background-size:100% 100%;
                       }
                   }
                   .goods-money{
                       background-color:#fff;
                       color:#fd4346;
                       font-weight:800;
                       font-size:12px;
                       width:100%;
                       display:flex;
                       align-items:flex-end;
                       justify-content:flex-start;
                       height:37rpx;
                       line-height:1;
                       span{
                           font-weight:700;
                           font-size:36rpx;
                       }
                   }
                   .right-content{
                       position: absolute;
                       width: 60rpx;
                       height: 150rpx;
                       right: 0;
                       top: 0;
                       .for-share{
                           width: 40rpx;
                           height: 40rpx;
                           margin: 10rpx;
                       }
                       .share-text{
                           display: block;
                           margin-top:-12rpx;
                           font-size: 20rpx;
                           color: #999;
                           text-align: center;
                       }
                   }
               }
           }
           .detail-info-flex{
               background-color:#fff;
               font-size:24rpx;
               display:flex;
               color:#565656;
               justify-content:space-between;
               width:100%;
               box-sizing: border-box;
               -webkit-box-sizing: border-box;
               padding:20rpx 25rpx;
               div{
                   flex:1;
               }
               div:nth-child(2){
                   flex:0 0 6em;
                   text-align:center;
               }
               div:nth-child(3){
                   text-align:right;
               }
           }
           .beishu{
               position: relative;
               margin-top:20rpx;
               border:none;
               color:#999;
               overflow: hidden;
               div{
                   height: 24rpx;
                   line-height: 24rpx;
                   .iconfont{
                       display:inline-block;
                       font-family:iconfont;
                       speak:none;
                       font-style:normal;
                       width: 24rpx;
                       height: 24rpx;
                       vertical-align:top;
                   }
               }
           }
           .info-tab{
               background-color:#fff;
               margin-top:20rpx;
               color:#e3654c;
               font-size:32rpx;
               text-align:center;
               .item{
                   display: block;
                   padding:24rpx 0;
                   color: #fd4346;
                   cursor:pointer;
                   border-bottom:2rpx solid #fd4346;
               }
           }
           .load-more{
               margin:30rpx auto;
               width:280rpx;
               height:50rpx;
               line-height:50rpx;
               border:2rpx solid #fd4346;
               color:#fd4346;
               border-radius:20rpx;
               display:block;
               font-size:26rpx;
               text-align:center;
           }
           .detail-flex{
               display:flex;
               flex-wrap:wrap;
               padding:0;
               .item{
                   flex:0 0 33.33333%;
                   margin:0;
                   padding:0 10rpx 10rpx 0;
                   box-sizing: border-box;
                   -webkit-box-sizing: border-box;
                   .item-area{
                       display:block;
                       width:100%;
                       text-align:center;
                       background-color:#fff;
                       border-radius:6rpx;
                   }
                   .item-p-area{
                       display:block;
                       height:85rpx;
                       padding-top:20rpx;
                       .p-tit{
                           font-size:26rpx;
                           width:185rpx;
                           text-align:left;
                           overflow:hidden;
                           margin:0 auto;
                           display:-webkit-box;
                           -webkit-line-clamp:2;
                           -webkit-box-orient:vertical;
                           text-overflow:ellipsis;
                       }
                   }
                   img{
                       width:185rpx;
                       height:185rpx;
                       margin:10px 0 17px 0;
                   }
               }
           }
           .provider{
               width:100%;
               height:80rpx;
               line-height:80rpx;
               text-align:center;
               color:#959595;
               font-size:26rpx;
               margin-bottom:140rpx;
               padding:0 0 120rpx 0;

           }
       }
       .footer-fixed-operate{
           position:fixed;
           left:0;
           bottom:0;
           width:100%;
           height:100rpx;
           background:#fff;
           font-size:28rpx;
           display:flex;
           justify-content:space-between;
           z-index:70;
           overflow:hidden;
           .left-icon{
               flex:1;
               display:flex;
               .item{
                   position:relative;
                   text-align:center;
                   color:#666;
                   line-height:1;
                   font-size:32rpx;
                   cursor:pointer;
                   flex:0 0 100rpx;
                   height:100%;
                   width:100rpx;
                   padding:0;
                   display:flex;
                   flex-direction:column;
                   align-items:center;
                   justify-content:center;
                   .iconfont{
                       width: 35rpx;
                       height: 35rpx;
                   }
                   .text{
                       font-size:20rpx;
                       padding-top:10rpx;
                   }
               }
           }
           .red-item{
               position:relative;
               background-color:#fd4346;
               width:300rpx;
               flex:0 0 300rpx;
               height:100%;
               navigator{
                   height:100rpx;
                   width:100%;
                   display:flex;
                   align-items:center;
                   justify-content:center;
                   img{
                       display:inline-block;
                       margin:0;
                       margin-right:10rpx;
                       width:35rpx;
                       height:35rpx;
                   }
                   .buy-text{
                       color:#fff;
                       font-size:28rpx;
                       display:inline-block;
                       vertical-align:middle;
                   }
               }
               .disabled{
                   background-color:#ccc;
               }
           }
       }
       .sku-modal{
           position:fixed;
           top:0;
           bottom:0;
           left:0;
           right:0;
           z-index:90;
           background-color:rgba(0, 0, 0, 0.4);
           display:flex;
           align-items:flex-end;
           .sku-modal-content{
               width:100%;
               background-color:#fff;
               .sku-modal-header{
                   height:120rpx;
                   padding:0 0 0 200rpx;
                   background-color:#fff;
                   position:relative;
                   line-height:92rpx;
                   font-size:32rpx;
                   color:#333;
                   width:100%;
                   display:block;
                   box-sizing: border-box;
                   -webkit-box-sizing: border-box;
                   .avatar{
                       position:absolute;
                       left:20rpx;
                       top:-50rpx;
                       border-radius:4rpx;
                       width:160rpx;
                       height:160rpx;
                   }
                   .prop{
                       word-break:break-all;
                       font-size:28rpx;
                       color:#333;
                       line-height:36rpx;
                       padding-right:20rpx;
                       overflow:hidden;
                       text-overflow:ellipsis;
                       display:-webkit-box;
                       -webkit-line-clamp:1;
                       -webkit-box-orient:vertical;
                   }
                   .name{
                       margin-top:20rpx;
                       width:100%;
                       padding-right:76rpx;
                   }
                   .money{
                       color:#fd4346;
                       font-size:24rpx;
                       text{
                           font-size:28rpx;
                           margin-left:4rpx;
                       }
                       .yuanjia {
                           color: #999 !important;
                           text-decoration: line-through !important;
                           font-size: 10px !important;
                           font-weight: normal !important;
                           padding-left: 5px;
                       }
                   }
                   .close{
                       position:absolute;
                       top:20rpx;
                       right:20rpx;
                       width:38rpx;
                       height:38rpx;
                   }
               }
               .car-border{
                   height:0;
                   margin-left:20rpx;
                   display:block;
                   border-bottom:2rpx solid #eee;
               }
               .sku-body{
                   box-sizing:border-box;
                   padding-bottom:100rpx;
                   display:block;
                   width:100%;
                   #popupSkuArea{
                       .sku_kind{
                           font-size:26rpx;
                           color:#666;
                           margin:0 20rpx;
                           height:66rpx;
                           line-height:66rpx;
                       }
                       .sku_choose{
                           margin-bottom:6rpx;
                           width:100%;
                           display:flex;
                           flex-wrap:wrap;
                           .item{
                               display:block;
                               padding:0 12rpx;
                               height:44rpx;
                               line-height:44rpx;
                               margin-left:20rpx;
                               margin-bottom:20rpx;
                               color:#333;
                               background-color:#f7f7f7;
                               font-size:24rpx;
                           }
                           .active{
                               background-color:#fd4346;
                               color:#fff;
                           }
                       }
                       .car-border{
                           height:0;
                           margin-left:10px;
                           display:block;
                           border-bottom:1px solid #eee;
                       }
                   }
                   .count_choose{
                       font-size:24px;
                       width:100%;
                       display:flex;
                       justify-content:space-between;
                       padding:10rpx 20rpx 26rpx;
                       .count{
                           color:#666;
                           height:80rpx;
                           line-height:40rpx;
                           font-size:26rpx;
                           margin-left:10rpx;
                           display:flex;
                           flex-direction:column;
                           justify-content:flex-start;
                           text-align:left!important;
                           float:left;
                       }
                       .num_wrap_v2{
                           position:relative;
                           z-index:0;
                           width:220rpx;
                           float:right;
                           vertical-align:middle;
                           display:flex;
                           margin-right:36rpx;
                           margin-top:10rpx;
                           div{
                               position:relative;
                               width:100rpx;
                               height:50rpx;
                               line-height:50rpx;
                               border:2rpx solid #e0e0e0;
                               font-size: 24rpx;
                               text-align:center;
                               display:block;
                               cursor:pointer;
                           }
                           .numDisab{
                               /*border:none !important;*/
                               background-color:#e0e0e0 !important;
                           }
                           .row{
                               border-radius:40rpx;
                               position:absolute;
                               top:50%;
                               left:50%;
                               margin-left:-14rpx;
                               margin-top:-2rpx;
                               width:28rpx;
                               height:2rpx;
                               background-color:#999;
                           }
                           .plus{
                               border-top-right-radius:6rpx;
                               border-bottom-right-radius:6rpx;
                           }
                           .number{
                               border-radius:0;
                           }
                           div:nth-child(3){
                               border-left:none;
                           }
                           .plus{
                               border-top-right-radius:6rpx;
                               border-bottom-right-radius:6rpx;
                               .row{
                                   border-radius:40rpx;
                                   position:absolute;
                                   top:50%;
                                   left:50%;
                                   margin-left:-14rpx;
                                   margin-top:-4rpx;
                                   width:28rpx;
                                   height:2rpx;
                                   background-color:#999;
                               }
                               .col{
                                   border-radius:40rpx;
                                   position:absolute;
                                   top:50%;
                                   left:50%;
                                   margin-left:-2rpx;
                                   margin-top:-16rpx;
                                   width:2rpx;
                                   height:28rpx;
                                   background-color:#999;
                               }
                           }
                       }
                       .btns{
                           background-color:#fff;
                           width:100%;
                       }
                   }
               }
               .show{
                   position:absolute;
                   bottom:0;
                   display:flex;
                   width: 100%;
               }
               .btn{
                   border-radius:0;
                   height:100rpx;
                   line-height:100rpx;
                   color:#fff;
                   font-size:32rpx;
                   text-align:center;
                   width:100%;
                   display:block;
                   cursor:pointer;
               }
               .red{
                   background-color:#fd4346;
               }
           }
       }
       .modal{
           position:fixed;
           top:0;
           left:0;
           width:100%;
           height:100vh;
           z-index:100;
           display:flex;
           background:rgba(0, 0, 0, 0.4);
       }
       .bottom-select{
           background:rgba(0, 0, 0, 0.3);
           align-items:flex-end;
           .modal-content{
               width:100%;
               padding:0;
               background-color:#fff;
               display:flex;
               .fanli-header{
                   text-align:center;
                   font-size:26rpx;
                   padding:30rpx;
                   border-bottom:1px solid #eee;
                   .title{
                       font-size:30rpx;
                       margin-bottom:15rpx;
                       .money{
                           color:#ff5305;
                           text-decoration:none;
                       }
                       text{
                           padding:0 6rpx;
                           text-decoration:underline;
                           cursor:pointer;
                       }
                   }
               }
               .modal-body{
                   padding:0 20rpx;
                   min-height:170rpx;
                   box-sizing: border-box;
                   -webkit-box-sizing: border-box;
                   button{
                       position:relative;
                       display:block;
                       margin-left:auto;
                       margin-right:auto;
                       padding-left:14px;
                       padding-right:14px;
                       box-sizing:border-box;
                       font-size:18px;
                       text-align:center;
                       text-decoration:none;
                       line-height:2.55555556;
                       border-radius:5px;
                       -webkit-tap-highlight-color:transparent;
                       overflow:hidden;
                       color:#000000;
                       border: none;
                       outline: none;
                       background-color:#F8F8F8;
                   }
                   button::after{ border: none; }
                   button{
                       flex:1;
                       height:150rpx;
                       font-size:28rpx;
                       background-color:#fff;
                       border-radius:0;
                       display:flex;
                       align-items:center;
                       justify-content:center;
                       img{
                           display:block;
                           margin:0 auto;
                           width:50rpx;
                           height:50rpx;
                       }
                   }
                   .button-hover{
                       background:#e7e7e7;
                   }
               }
           }
       }
       .canvas-dom{
           position:fixed;
           top:99999999999999px;
           left:0;
           display:block;
       }
       .hbmodal{
           background:rgba(0, 0, 0, 0.5);
           .modal-content{
               width:70%;
               padding:40rpx 0 0 0;
               background-color:transparent;
               position:relative;
               margin:0 auto;
               img{
                   width:100%;
                   display:block;
               }
               .downImg{
                   padding-top:30rpx;
                   display:block;
                   button{
                       width:40%;
                       display:block;
                       border:1px solid #ef5725;
                       background-color:#ef5725;
                       color:#fff;
                       font-size:28rpx;
                       line-height:1;
                       padding:15rpx 0;
                       border-radius:5rpx;
                   }
               }
           }
       }
       button::after{ border: none; }
   }
</style>
