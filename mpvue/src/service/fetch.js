/**
 * [exports 将wx.request Promise化]
 * @param  {[String]} options.contentType 请求类型包括 {application/json,application/x-www-form-urlencoded} 默认值application/json
 * @param {[String]}  options.method 请求method包括 {POST,GET} 默认值 GET
 * @param {[String]}  options.baseUrl 请求baseUrl例如:http://www.baidu.com
 * @param {[String]}  options.api 请求baseUrl例如:/map
 * @param {[Object]}  options.params 请求参数例如:{age；100,name:'lisi'} 默认值{}
 */

import {
    getStorage
} from '@/utils/wechat';
import * as API from '@/service/api';
export default function (options) {
    return new Promise((resolve, reject) => {
        let baseUrl = '';
        let method = 'GET';
        let header = {
            'Content-Type': 'application/json',
            'Cookie': ''
        };
        if (options.contentType) {
            header['Content-Type'] = options.contentType;
        };

        getStorage('token').then((resolve) => {
            header.Cookie = resolve.data
        }).catch(err => {
            console.log(err)
        });

        if (options.method) {
            method = options.method;
        };
        let params = {};
        if (options.params) {
            params = options.params;
        };
        getStorage('baseUrl').then(res => {
            baseUrl = res.data.baseUrl; // 从缓存里面获取到baseUrl
            if (baseUrl && (options.baseUrl !== baseUrl) && (options.api !== API.login)) { // 域名不相同
                console.log('域名不相同重新获取=1');
                wx.request({
                    url: `${options.baseUrl}${options.api}`,
                    data: Object.assign({}, params),
                    header: header,
                    method: method,
                    dataType: 'json',
                    success: resolve,
                    fail: reject
                });
            } else {
                // 域名相同
                wx.request({
                    url: `${options.baseUrl}${options.api}`,
                    data: Object.assign({}, params),
                    header: header,
                    method: method,
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code === 40002) {
                            wx.request({
                                url: `${options.baseUrl}${options.api}`,
                                data: Object.assign({}, params),
                                header: header,
                                method: method,
                                dataType: 'json',
                                success: resolve,
                                fail: reject
                            })
                        } else {
                            resolve(res);
                        }
                    },
                    fail: reject
                });
            }
        }, err => {
            console.log('登录的时候params=', params, err);
            wx.request({
                url: `${options.baseUrl}${options.api}`,
                data: Object.assign({}, params),
                header: header,
                method: method,
                dataType: 'json',
                success: resolve,
                fail: reject
            });
        });
    });
}
