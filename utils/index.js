import {
    login,
    setStorage,
    getStorage
} from '@/utils/wechat';
import Data from '@/utils/data'
import fetch from '@/service/fetch';
import * as API from '@/service/api';

function formatNumber (n) {
    const str = n.toString();
    return str[1] ? str : `0${str}`;
}

export function formatTime (date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const t1 = [year, month, day].map(formatNumber).join('/');
    const t2 = [hour, minute, second].map(formatNumber).join(':');

    return `${t1} ${t2}`;
};

export function formatDate (date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const t1 = [year, month, day].map(formatNumber).join('-');
    return `${t1}`;
}

export function getUrlParam (url, name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var regRewrite = new RegExp('(^|/)' + name + '/([^/]*)(/|$)', 'i');
    let urlNew = url.split('?')[1];
    var r = urlNew.match(reg);
    var q = urlNew.match(regRewrite);
    if (r !== null) {
        return unescape(r[2]);
    } else if (q !== null) {
        return unescape(q[2]);
    } else {
        return null;
    }
};
/*
/   获取openGId
    params:用户授权的信息
    cb: 登录成功的回调
 */

export function getOpenGId (params, cb) {
    console.log('传入需要解密信息====', params);
    let loginParams = {};
    loginParams.encryptedData = params.encryptedData;
    loginParams.ivstr = params.iv;
    login().then(res => {
        console.log('login成功', res);
        loginParams.logincode = res.code;
        console.log('API.login444解密信息参数拼接', loginParams);
        fetch({
            method: 'POST',
            baseUrl: API.baseUrl,
            api: API.getOpenGId,
            contentType: 'application/json; charset=UTF-8',
            params: loginParams,
            header: {
                'Content-Type': 'application/json',
                'UserToken': ''
            }
        }).then(res => {
            let resData = res.data;
            if (resData.code === 2000) {
                console.log('后台登录成功6667', res);
                if (cb && typeof cb === 'function') {
                    console.log('cb回传值')
                    let param = { 'openGId': resData.data }
                    cb(param);
                };
            } else {
                console.log(resData, '登录失败')
                // wx.showToast({
                //     title: resData.message,
                //     icon: 'none'
                // });
            };
        }, err => {
            console.log('后台登录失败', err);
        });
    }, (err) => {
        console.log('login 失败', err);
    });
};
/*
/   用户登录
    params:用户授权的信息
    cb: 登录成功的回调
 */

export function userLogin (params, cb) {
    console.log('userLogin====', params);
    let loginParams = {};
    loginParams.encryptedData = params.encryptedData;
    loginParams.ivstr = params.iv;
    let userInfo = params.rawData;
    setStorage('userInfo', userInfo).then(res => {
        console.log(res, '用户信息 存储成功');
    }, err => {
        console.log(err, '用户信息 存储失败');
    });
    login().then(res => {
        console.log('login成功', res);
        loginParams.logincode = res.code;
        console.log('API.login444', loginParams);
        fetch({
            method: 'POST',
            baseUrl: API.baseUrl,
            api: API.login,
            contentType: 'application/json; charset=UTF-8',
            params: loginParams,
            header: {
                'Content-Type': 'application/json',
                'UserToken': ''
            }
        }).then(res => {
            let resData = res.data;
            if (resData.code === 2000) {
                console.log('后台登录成功6667', res);
                console.log(API.baseUrl)
                resData.data.baseUrl = API.baseUrl; // 登录成功后存储当前域名
                console.log(' resData.data================', resData.data);
                setStorage('tokenInfo', resData.data).then(res => {
                    if (cb && typeof cb === 'function') {
                        cb(resData.data);
                    };
                    console.log(resData.data, 'tokenInfo 存储成功', res);
                }, err => {
                    console.log(err, 'tokenInfo 存储失败');
                });
            } else {
                console.log(resData, '登录失败')
                // wx.showToast({
                //     title: resData.message,
                //     icon: 'none'
                // });
            };
        }, err => {
            console.log('后台登录失败', err);
        });
    }, (err) => {
        console.log('login 失败', err);
    });
};
// 将对象元素转换成字符串以作比较
export function obj2key (obj, keys) {
    var n = keys.length
    var key = [];
    while (n--) {
        key.push(obj[keys[n]]);
    }
    return key.join('|');
}
// 去重操作
export function uniqeByKeys (array, keys) {
    var arr = [];
    var hash = {};
    for (var i = 0, j = array.length; i < j; i++) {
        var k = obj2key(array[i], keys);
        if (!(k in hash)) {
            hash[k] = true;
            arr.push(array[i]);
        }
    }
    return arr;
}
export function imageUtil(w, h) {
    var imageSize = {};
    var originalWidth = w;// 图片原始宽
    var originalHeight = h;// 图片原始高
    var originalScale = originalHeight / originalWidth;// 图片高宽比
    console.log('originalWidth: ' + originalWidth)
    console.log('originalHeight: ' + originalHeight)
    // 获取屏幕宽高
    wx.getSystemInfo({
        success: function (res) {
            var windowWidth = res.windowWidth;
            var windowHeight = res.windowHeight;
            console.log('windowWidth: ' + windowWidth)
            console.log('windowHeight: ' + windowHeight)
            // 图片缩放后的宽为屏幕宽
            imageSize.imageWidth = windowWidth;
            imageSize.imageHeight = windowWidth * originalScale
        }
    })
    console.log('缩放后的宽: ' + imageSize.imageWidth)
    console.log('缩放后的高: ' + imageSize.imageHeight)
    return imageSize;
}
export function promisify(fn) {
    return function(obj = {}) {
        return new Promise((resolve, reject) => {
            obj.success = function(res) {
                resolve(res)
            }
            obj.fail = function(res) {
                reject(res)
            }
            fn(obj)
        })
    }
}
/* 根据出生日期算出年龄 */
export function jsGetAge(strBirthday) {
    var returnAge;
    var strBirthdayArr = strBirthday.split('-');
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];
    var d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();

    if (nowYear === birthYear) {
        returnAge = 0; // 同年 则为0岁
    } else {
        var ageDiff = nowYear - birthYear; // 年之差
        if (ageDiff > 0) {
            if (nowMonth === birthMonth) {
                var dayDiff = nowDay - birthDay; // 日之差
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            } else {
                var monthDiff = nowMonth - birthMonth; // 月之差
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            }
        } else {
            returnAge = -1; // 返回-1 表示出生日期输入错误 晚于今天
        }
    }
    return returnAge; // 返回周岁年龄
}
export function setScrollTop(id, index, data) {
    let preId = ''
    const query = wx.createSelectorQuery()
    if (index > 0) {
        preId = data[index - 1].id
        query.select('#bg' + preId).boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function (res) {
            console.log(res, '非第一个套餐')
            if (res[0] !== null) {
                let scrollTop = res[0].top + res[1].scrollTop
                wx.pageScrollTo({
                    scrollTop: scrollTop,
                    duration: 0
                })
            } else {
                const querySelf = wx.createSelectorQuery()
                querySelf.select('#pg' + id).boundingClientRect()
                querySelf.selectViewport().scrollOffset()
                querySelf.exec(function (res) {
                    console.log(res, '非第一个套餐折叠')
                    let scrollTop = res[0].top + res[1].scrollTop
                    wx.pageScrollTo({
                        scrollTop: scrollTop,
                        duration: 0
                    })
                })
            }
        })
    } else {
        query.select('#pg' + id).boundingClientRect((res) => {
            console.log(res, 33333)
        })
        query.selectViewport().scrollOffset()
        query.exec(function (res) {
            console.log(res, '第一个套餐')
            let scrollTop = res[0].top + res[1].scrollTop
            wx.pageScrollTo({
                scrollTop: scrollTop,
                duration: 0
            })
        })
    }
}
export function htmlFormat (text) {
    let newContent = text.replace(/<img[^>]*>/gi, (match, capture) => {
        // return match.replace(/style=\"(.*)\"/gi, 'style=""');
        if (match.includes('style=')) {
            return match.replace(/style="\(.*\)"/gi, 'style="width:100%;display:block;"');
        } else {
            return match.replace(/<img/gi, '<img class="img" style="width:100%;display:block;" ');
        }
    })
    newContent = text.replace(/<br>/gi, (match, capture) => {
        return match.replace(/<br>/gi, '<div style="height: 15px;"></div>');
    })
    return newContent;
    // return text.replace(/style=\"(.*)\"/gi, 'style=""')
    // return text;
}
// 添加足迹
export function addFootmark(obj) {
    let time = Data.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
    let param = {
        logo: obj.logo,
        id: obj.id,
        name: obj.name,
        type: obj.type,
        time: time
    }
    getStorage('footmark').then((res) => {
        console.log('getStorage res', res)
        let footprintObj = res.data.filter((item) => {
            return item.id !== param.id
        })
        if (footprintObj.length === 50) {
            footprintObj.splice(0, 1)
        }
        footprintObj.push(param)
        setStorage('footmark', footprintObj)
        console.log('getStorage res', res)
    }).catch((err) => {
        console.log('getStorage footmark', err)
        if (err.errMsg === 'getStorage:fail data not found') {
            setStorage('footmark', [param])
        }
    })
}
export default {
    formatNumber,
    htmlFormat,
    setScrollTop,
    formatTime,
    formatDate,
    promisify,
    getUrlParam,
    jsGetAge,
    addFootmark
};
