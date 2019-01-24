/**
 * [install 全局函数模块]
 * 使用node模块导出法exports.install 或者 es6模块导出法 export default
 * @param  {[type]} Vue     [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
// exports.install = function (Vue, options) {
export default function install(Vue, options) {
    /**
     * [showLoadMsg 显示加载框]
     * @param  {[type]} msg         [description]
     * @param  {Number} [time=2000] [延时,不设置默认为2000ms]
     * @return {[type]}             [description]
     */
    Vue.prototype.showLoadMsg = function (msg, time = 2000) {
        wx.showToast({
            title: msg,
            icon: 'none',
            duration: time
        })
    }

    /**
     * [setTitle 设置小程序的Title]
     * @param {[type]} title [description]
     */
    Vue.prototype.setTitle = function (title) {
        if (title) {
            wx.setNavigationBarTitle({
                title: title
            })
        }
    }

    /**
     * [checkEmptyStr 校验字符串是否为['',null,undefined]]
     * @param  {[type]} strValue [需要校验的字符串]
     * @return {[type]}          [当前字符串不为空直接返回,否则返回空字符串]
     */
    Vue.prototype.checkEmptyStr = function (strValue) {
        if (strValue) {
            return strValue
        }
        return ''
    }
}
