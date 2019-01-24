export function postData(data) {
    var url = data.url;
    var param = data.param;
    var back = data.back;

    wx.request({
        url: getUrl() + url,
        data: param,
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        complete: function(res) {
        },
        fail: function(res) {
            wx.showToast({
                title: '请求错误',
                icon: 'error',
                mask: true,
                duration: 2000
            });
            back(false);
        },
        success: function(res) {
            if (res.data.status === 500) {
                wx.showToast({
                    title: '请求成功',
                    icon: 'success',
                    mask: true,
                    duration: 2000
                });
                back(res.data.data);
                return;
            } else if (res.data.length > 0) {
                wx.showToast({
                    title: res.data.data,
                    icon: 'error',
                    mask: true,
                    duration: 2000
                });
            }
            back(false);
        }
    })
}
export function getData(data) {
    var url = data.url;
    var param = data.param;
    var back = data.back;
    console.log(url + '++++' + param);
    wx.request({
        url: getUrl() + url,
        data: param,
        method: 'GET',
        success: function(res) {
            console.log(res);
            if (res.data.status === 500) {
                wx.showToast({
                    title: '请求成功',
                    icon: 'success',
                    mask: true
                });
                back(res.data.data);
            } else {
                wx.showToast({
                    title: res.data.data,
                    icon: 'error',
                    mask: true
                });
            }
            back(false);
        },
        fail: function(res) {
            back(false);
        },
        complete: function(res) {
        }
    })
}
export function getUrl() {
    return 'https://xcx.uzhizhu.com';
}
export function getUserId(data) {
    wx.getStorage({
        key: getUserKey(), // 'userInfo',
        fail: function(res) {
            data.back(false);
        },
        success: function(res) {
            var userData = res.data;
            console.log(userData);
            data.back(userData.usrid);
        }
    });
}
// 获取user的登录信息
export function getUser(data) {
    wx.getStorage({
        key: getUserKey(), // 'userInfo',
        fail: function(res) {
            data.back(false);
        },
        success: function(res) {
            var userData = res.data;
            console.log(userData);
            data.back(userData);
        }
    });
}
// 本地保存数据的key==============
// 保存登录的用户信息
export function getUserKey() {
    return 'userInfo';
}
// 保存开门的钥匙
export function getOpenPwKey() {
    return 'openpw';
}

/**
* 字符串转时间（yyyy-MM-dd HH:mm:ss）
* result （分钟）
*/
export function stringToDate(fDate) {
    var fullDate = fDate.split('-');
    return new Date(fullDate[0], fullDate[1] - 1, fullDate[2], 0, 0, 0);
}

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式化样式,例如yyyy-MM-dd HH:mm:ss E
 * @return 格式化后的金额
 */
export function formatDate(date, format) {
    var v = '';
    if (typeof date === 'string' || typeof date !== 'object') {
        return;
    }
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var weekDay = date.getDay();
    var ms = date.getMilliseconds();
    var weekDayString = '';

    if (weekDay === 1) {
        weekDayString = '星期一';
    } else if (weekDay === 2) {
        weekDayString = '星期二';
    } else if (weekDay === 3) {
        weekDayString = '星期三';
    } else if (weekDay === 4) {
        weekDayString = '星期四';
    } else if (weekDay === 5) {
        weekDayString = '星期五';
    } else if (weekDay === 6) {
        weekDayString = '星期六';
    } else if (weekDay === 7) {
        weekDayString = '星期日';
    }

    v = format;
    // Year
    v = v.replace(/yyyy/g, year);
    v = v.replace(/YYYY/g, year);
    v = v.replace(/yy/g, (year + '').substring(2, 4));
    v = v.replace(/YY/g, (year + '').substring(2, 4));

    // Month
    var monthStr = ('0' + month);
    v = v.replace(/MM/g, monthStr.substring(monthStr.length - 2));

    // Day
    var dayStr = ('0' + day);
    v = v.replace(/dd/g, dayStr.substring(dayStr.length - 2));

    // hour
    var hourStr = ('0' + hour);
    v = v.replace(/HH/g, hourStr.substring(hourStr.length - 2));
    v = v.replace(/hh/g, hourStr.substring(hourStr.length - 2));
    // minute
    var minuteStr = ('0' + minute);
    v = v.replace(/mm/g, minuteStr.substring(minuteStr.length - 2));
    // Millisecond
    v = v.replace(/sss/g, ms);
    v = v.replace(/SSS/g, ms);
    // second
    var secondStr = ('0' + second);
    v = v.replace(/ss/g, secondStr.substring(secondStr.length - 2));
    v = v.replace(/SS/g, secondStr.substring(secondStr.length - 2));
    // weekDay
    v = v.replace(/E/g, weekDayString);
    return v;
}
/**
 * 计算两个日期相差几天
 * cusDate 当前时间
 * oriDate  比较时间
 * 返回 正数为cusDate>oriDate
 */
export function calculateTime(cusDate, oriDate) {
    var cusTime = cusDate.getTime();
    var oriTime = oriDate.getTime();
    return (cusTime - oriTime) / (1000 * 60 * 60 * 24)
}
export function getWeek(week) {
    var a = ['日', '一', '二', '三', '四', '五', '六']
    var str = '星期' + a[week];
    return str
}
function getWeekDay(dateString) {
    var date;
    if (isNull(dateString)) {
        date = new Date();
    } else {
        var dateArray = dateString.split('-');
        date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
    }
    return '星期' + '日一二三四五六'.charAt(date.getDay());
};
function isNull(object) {
    if (object === null || typeof object === 'undefined') {
        return true;
    }
    return false;
};
// 提供接口
export default {
    getUserKey, // 保存登录的用户信息
    getOpenPwKey, // 保存开门的钥匙
    getUrl, // host接口
    postData,
    getData,
    getUserId,
    getUser,
    getWeek,
    getWeekDay,
    formatDate, // 格式化日期
    stringToDate, // 字符串转日期
    calculateTime // 比较时间差
}
