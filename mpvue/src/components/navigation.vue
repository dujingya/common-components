<template>
    <div class="quickNavigation" :style="{marginRight: showLeft}">
        <div @click="showIn" class="showOrClose">
            <div class="showBar">
                <img v-if="isShow" :src="right">
                <img v-else :src="left">
                <div class="navigation">快速导航</div>
            </div>
        </div>
        <div class="selection">
            <div class="homePage" @click="toHome">
                <img src="../tabBarImage/tab1Normal.png">
                <p>首页</p>
            </div>
            <div class="homePage" @click="toShop">
                <img src="../tabBarImage/tab3Normal.png">
                <p>商城</p>
            </div>
            <div class="myHome" @click="toMyHome">
                <img src="../tabBarImage/tab2Normal.png">
                <p>我的</p>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'navigation',
        data() {
            return {
                showLeft: '-351rpx',
                right: require('../image/right.png'),
                left: require('../image/left.png'),
                isShow: false
            }
        },
        methods: {
            showIn() {
                console.log(11111)
                if (this.isShow) {
                    this.isShow = false
                    this.showLeft = '-351rpx'
                } else {
                    this.isShow = true
                    this.showLeft = '0'
                }
            },
            toHome() {
                let url = '/pages/index/main'
                wx.reLaunch({
                    url
                })
                this.showIn()
            },
            toMyHome() {
                let url = '/pages/userCenter/main'
                wx.reLaunch({
                    url
                })
                this.showIn()
            },
            toShop() {
                let url = '/pages/mall/main'
                wx.reLaunch({
                    url
                })
                this.showIn()
            }
        },
        created() {
        },
        mounted() {
        }
    }
</script>
<style lang="scss" scoped>
    .quickNavigation{
        position: fixed;
        right: 0;
        bottom: 180rpx;
        width: 441rpx;
        height: 88rpx;
        background: transparent;
        overflow: hidden;
        z-index: 10000;
        .showOrClose{
            float: left;
            height: 64rpx;
            width: 84rpx;
            margin: 10rpx 0;
            border-top-left-radius: 10rpx;
            -webkit-border-top-left-radius: 10rpx;
            -webkit-border-bottom-left-radius: 10rpx;
            background: rgba(0,0,0, .6);
            overflow: hidden;
            .showBar{
                height: 64rpx;
                width: 84rpx;
                display: flex;
                flex-direction: row;
                align-items: center;
                img{
                    width: 24rpx;
                    height: 24rpx;
                    margin: 20rpx 5rpx;
                }
                .navigation{
                    width: 40rpx;
                    font-size: 20rpx;
                    color: #e5e5e5;
                    margin: 0 5rpx;
                }
            }
        }
        .selection{
            float: right;
            height: 84rpx;
            width: 351rpx;
            background: rgba(255,255,255, .7);
            box-shadow: 0 5px 15px 0 rgba(78,24,2,0.12);
            border: 2rpx solid #f1f1f1;
            overflow: hidden;
            border-top-left-radius: 10rpx;
            -webkit-border-top-left-radius: 10rpx;
            -webkit-border-bottom-left-radius: 10rpx;
            .homePage,.myHome{
                float: left;
                width: 117rpx;
                height: 84rpx;
                img{
                    display: block;
                    width: 30rpx;
                    height: 30rpx;
                    margin: 10rpx auto 6rpx;
                }
                p{
                    font-size: 22rpx;
                    color: #353535;
                    text-align: center;
                    margin: 6rpx 0 10rpx;
                }
            }
        }
    }
</style>
