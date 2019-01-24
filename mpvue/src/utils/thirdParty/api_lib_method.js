import api from './api';

/* 唤起支付
 *  @param data {Object} default null 必传
 * */
const awakePay = data => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: 'prepay_id=' + data.prepayId,
            signType: data.signType,
            paySign: data.paySign,
            success: res => {
                console.log(res);
                resolve({
                    success: true,
                    message: '支付成功',
                    detail: res
                });
            },
            fail: (e) => {
                console.error('支付失败', e);
                reject(e);
            }
        });
    });
};

/* 获取订单支付所需参数
 *  @param orderId {String} default null 必传
 * */
const getPayOption = orderId => {
    return new Promise((resolve, reject) => {
        let openid = wx.getStorageSync('loginInfo').openid;
        console.log('获取openid', openid);
        let url = '/api/billboard/pay/' + orderId + '/' + openid;
        api.get(url).then(res => {
            console.log(res[0]);
            if (res[0].needpay === 'false') {
                resolve({
                    success: true,
                    nopay: true,
                    message: '这笔订单不需要支付',
                    detail: res[0]
                });
                return;
            }
            awakePay(res[0]).then(res => {
                resolve(res);
            }).catch(e => {
                reject(e);
            });
        }).catch(e => {
            console.error(e);
            reject(e);
        });
    });
};

export default {
    // 获取物流列表
    apiGetWuliu(orderId) {
        if (!orderId) {
            return Promise.reject(new Error());
        }
        return new Promise((resolve, reject) => {
            api.get(`/api/boardorder/logistics/` + orderId).then(res => {
                let list = res[0].progress.reverse();
                if (list.length === 0) {
                    resolve(list);
                    return;
                }
                for (let i of list) {
                    i.a = i.time.substring(5, 10);
                    i.b = i.time.substring(11, 16);
                }
                resolve(list);
            }).catch(e => {
                console.error(e);
                reject(e);
            });
        });
    },
    // 确认收货和取消订单
    apiOkOrderShAndQxdd(options = {
        url: null,
        text: null
    }) {
        let {
            url,
            text
        } = options;
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: `提示`,
                content: `您确定要${text}吗？`,
                success: res => {
                    if (res.confirm) {
                        api.get(url).then(res => {
                            console.log(res);
                            wx.showToast({
                                title: `${text}成功!`
                            });
                            resolve(res);
                        }).catch(e => {
                            console.log(e);
                            wx.showToast({
                                icon: 'none',
                                title: `${text}失败!`
                            });
                            reject(e);
                        });
                    }
                }
            });
        });
    },
    // 支付订单
    apiOrderPay: getPayOption
};
