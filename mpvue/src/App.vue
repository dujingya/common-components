<script>
export default {
    created() {
        // 调用API从本地缓存中获取数据
        // const logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)
        //
        // console.log('app created and cache logs by setStorageSync')
    },
    //  获取小程序在 page onLoad 时候传递的 options
    //  在所有 页面 的组件内可以通过 this.$root.$mp.query 进行获取。
    //  获取小程序在 app onLaunch/onShow 时候传递的 options
    //  在所有的组件内可以通过 this.$root.$mp.appOptions 进行获取。
    onLaunch: function (ops) {
        console.log('进入小程序onLaunch:', ops)
        // if (ops.scene === 1044) {
        //     if (ops.shareTicket) {
        //         this.globalData.shareTicket = ops.shareTicket
        //     }
        //     console.log('appvue onLaunch显示ticket', ops.shareTicket)
        // }
    },
    onShow: function (options) {
        // this指向App对象
        // console.log('进入小程序onShow:', options)
        // if (options) {
        //     if (options.shareTicket) {
        //         this.globalData.shareTicket = options.shareTicket
        //     }
        // }
    }
}
</script>

<style>
page {
    /*height: 100%;*/
}

/* this rule will be remove */

* {
    transition: width 2s;
    -moz-transition: width 2s;
    -webkit-transition: width 2s;
    -o-transition: width 2s;
}
</style>
