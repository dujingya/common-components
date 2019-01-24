<template>
    <div>
        <div class="modal-box" v-if="modalShow">
            <div class="modal-photo">
                <canvas class="share-canvas" canvas-id="modalCanvas"></canvas>
            </div>
            <div class="share-buttons">
                <button class="save-button" @click="saveAsImage">保存图片分享</button>
                <button class="share-button" open-type='share'>发送给好友</button>
            </div>
            <canvas class="shareButton" canvas-id="shareButton"></canvas>
        </div>
        <Navigation></Navigation>
    </div>

</template>

<script>
import {
    promisify
} from '@/utils/index'
import Navigation from '@/components/navigation'
export default {
    components: {
        Navigation
    },
    data () {
        return {
            modalShow: true,
            shareImgSrc: '',
            imgPath: ''
        }
    },
    methods: {
        share() {
            this.modalShow = true
        },
        startBtn() {
            console.log('startBtn======')
            const wxGetImageInfo = promisify(wx.getImageInfo)
            console.log('start======')
            Promise.all([
                wxGetImageInfo({
                    src: 'https://lk-upload-api-pro.op.laikang.com/common/fileDownload/lk-upload/ce40b813-4b69-4f3a-a135-9148f66fa680.jpg'
                })
            ]).then(res => {
                console.log('开始绘制', res)
                const ctx = wx.createCanvasContext('modalCanvas')
                ctx.drawImage(res[0].path, 0, 0, 250, 150)
                ctx.setTextAlign('center')
                ctx.setFillStyle('#000000')
                ctx.setFontSize(18)
                ctx.fillText('作者：来康', 100, 100)
                // const qrImgSize = 180
                // ctx.drawImage(res[1].path, (600 - qrImgSize) / 2, 530, qrImgSize, qrImgSize)
                ctx.stroke()
                ctx.draw()
            })
        },
        saveAsImage() {
            const wxCanvasToTempFilePath = promisify(wx.canvasToTempFilePath)
            const wxSaveImageToPhotosAlbum = promisify(wx.saveImageToPhotosAlbum)
            wxCanvasToTempFilePath({
                canvasId: 'modalCanvas',
                x: 0,
                y: 0,
                width: 600,
                height: 800,
                destWidth: 600,
                destHeight: 800
            }, this).then(res => {
                return wxSaveImageToPhotosAlbum({
                    filePath: res.tempFilePath
                })
            }).then(res => {
                wx.showToast({
                    title: '已保存到相册'
                })
            })
        },
        shareImage() {
            wx.saveImageToPhotosAlbum({
                filePath: this.shareImgSrc,
                success(res) {
                    wx.showModal({
                        title: '存图成功',
                        content: '图片成功保存到相册了，去发圈噻~',
                        showCancel: false,
                        confirmText: '好哒',
                        confirmColor: '#72B9C3',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                            }
                        }
                    })
                }
            })
        }
    },
    created() {
    },
    onShow() {
    },
    mounted() {
        this.startBtn()
    },
    onShareAppMessage(res) {
        return {
            title: '1111',
            path: 'pages/share/mian',
            imageUrl: this.imgPath
        }
    }
}
</script>

<style lang="scss" scoped>
    .modal-box {
        width:100%;
        height:100%;
        position:absolute;
        z-index:99;
        top:0;
        left:0;
        background-color:rgba(0,0,0,0.6);
    }
    .modal-photo{
        width: 250px;
        height: 350px;
        position:relative;
        margin:0 auto;
        margin-top:calc(50% - 130px);
    }
    .modal-close {
        position:absolute;
        z-index:100;
        top:10px;
        right:10px;
    }
    .save-button, .share-button {
        width:100px;
        height:35px;
        border-radius:6px;
        float:left;
        font-size:15px;
        line-height:35px;
        text-align: center;
        margin:0 8px;
    }
    .share-button{
        background-color:#E6B57D;
        color: #ffffff;
    }
    .save-button{
        background-color:#ffffff;
        color:#E6B57D;
    }
    .share-buttons {
        width:234px;
        height:35px;
        position:relative;
        margin:0 auto;
        margin-top:25px;
    }
    .share-canvas {
        width: 500rpx;
        height: 700rpx;
        background-color: #fff;
        border-radius: 10rpx;
    }
    .modal-close {
        position:absolute;
        z-index:100;
        top:10px;
        right:10px;
    }
    .modal-close .closeImage {
        width: 35rpx;
        height: 35rpx;
    }
</style>
