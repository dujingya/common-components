const setShareImg = (id, a, b, c, goodsname, goodsmoney, goodstype) => {
    const ctx = wx.createCanvasContext(id);
    // 设置背景为白色
    ctx.setFillStyle('#fff');
    ctx.fillRect(0, 0, 750, 1400);
    // 生成商品图片
    ctx.drawImage(a, 0, 0, 750, 750);
    ctx.setFontSize(34);
    // 生成标题
    ctx.fillStyle = '#000';
    let str = goodsname;
    const len = str.length;
    let strStart = str;
    let strEnd = '';
    const maxNum = 19;
    if (len > maxNum) {
        strStart = str.substring(0, maxNum);
        const stl = str.substring(maxNum, len);

        if (stl.length > 14) {
            strEnd = '...'.padStart(13, stl);
        } else {
            strEnd = stl;
        }
        console.log(strEnd);
    }
    // let textW = ctx.measureText(str).width / 4  // 设置文字居中
    ctx.fillText(strStart, 50, 820);
    ctx.fillText(strEnd, 50, 870);
    // 生成价格
    ctx.setFontSize(30);
    ctx.fillStyle = '#f65f26';
    ctx.fillText('￥', 50, 1010);
    ctx.setFontSize(50);
    ctx.fillText(goodsmoney.split('￥')[1], 80, 1010);
    // 生成规格
    ctx.setFontSize(30);
    ctx.fillStyle = '#707070';
    // ctx.fillText(goodstype, 420, 860)
    // 广告语
    ctx.setFontSize(28);
    const bannerStr = '七修良品  一种健康的生活方式';
    ctx.fillText(bannerStr, 50, 1100);
    // 生成二维码
    ctx.drawImage(b, 470, 870, 250, 250);
    // 遮盖二维码底部文字
    // ctx.setFillStyle('#fff')
    // ctx.fillRect(488, 1105, 350, 60)
    // 绘制新的文字
    ctx.fillStyle = '#626262';
    ctx.setFontSize(20);
    // ctx.fillText('长按二维码进入小程序', 493, 1130)
    // 写入自定义图片 自定义图片大小 350 * 217
    // ctx.drawImage(c, 320, 906, 350, 217)
    const imgurl = '/static/detail/share-img-bottom.jpg';
    ctx.drawImage(imgurl, 50, 1150, 650, 160);
    return new Promise((resolve, reject) => {
        ctx.draw(true, () => {
            wx.canvasToTempFilePath({
                width: 750,
                heght: 1400,
                destWidth: 750,
                destHeight: 1400,
                canvasId: id,
                fileType: 'jpg',
                quality: 1,
                success: (res) => {
                    resolve({
                        img: res.tempFilePath
                    });
                },
                fail: (e) => {
                    console.error('draw方法生成图片错误', e);
                    reject(e);
                }
            });
        });
    });
};

const init = (id, options = {}) => {
    let {
        qrUrl, // 小程序码地址
        goodsimg, // 商品图片
        autoimg, // 自定义图片
        goodsname, // 商品名称
        goodsmoney, // 商品金额
        goodstype // 小商品规格
    } = options;
    // 缓存网络图片到本地
    let promise1 = new Promise(function(resolve, reject) {
        wx.getImageInfo({
            src: goodsimg,
            success: function(res) {
                // console.log(res)
                resolve(res);
            },
            fail: e => {
                console.error('缓存商品首图出现错误', e);
                reject(e);
            }
        });
    });
    let promise2 = new Promise(function(resolve, reject) {
        wx.getImageInfo({
            src: qrUrl,
            success: function(res) {
                // console.log(res)
                resolve(res);
            },
            fail: e => {
                console.error('缓存小程序码图片出现错误', e);
                reject(e);
            }
        });
    });
    let promise3 = new Promise(function(resolve, reject) {
        wx.getImageInfo({
            src: autoimg,
            success: function(res) {
                // console.log(res)
                resolve(res);
            },
            fail: e => {
                console.error('缓存自定义图片出现错误', e);
                reject(e);
            }
        });
    });
    // let promise4 = new Promise(function(resolve, reject) {
    //     wx.getImageInfo({
    //         src: '/static/detail/share-img-bottom.jpg',
    //         success: function(res) {
    //             // console.log(res)
    //             resolve(res);
    //         },
    //         fail: e => {
    //             console.error('缓存自定义图片出现错误', e);
    //             reject(e);
    //         }
    //     });
    // });

    return new Promise((resolve, reject) => {
        Promise.all([promise1, promise2, promise3]).then(res => {
            // 开始生成图片
            console.log(res);
            setShareImg(id, res[0].path, res[1].path, res[2].path, goodsname, goodsmoney, goodstype)
                .then(res => {
                    resolve(res);
                })
                .catch(e => {
                    reject(e);
                });
        }).catch(e => {
            console.error('缓存网络图片出现错误', e);
            reject(e);
        });
    });
};

export default init;
