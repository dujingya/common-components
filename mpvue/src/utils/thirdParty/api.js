import CONFIG from './config';

const baseURL = CONFIG.baseURL;

function formatData(data, head = false) {
    const page = head.firstresult || 1;
    const max = head.maxresults;
    if (head) {
        head = {};
        head.bodytype = 'flat';
        head.maxresults = max || 6;
        head.firstresult = (page - 1) * head.maxresults;
    } else {
        head = {
            firstresult: 0,
            maxresults: 5,
            bodytype: 'flat'
        };
    }
    let body;
    if (Array.isArray(data)) {
        body = data;
    } else {
        body = [data];
    }
    return {
        version: '1.0',
        head,
        body
    };
}

function formatMedia(url) {
    // if (url) {
    //   return baseURL + url.replace(/\/api/, '')
    // } else {
    //   return url
    // }
    return url;
}

function formatImage(url) {
    /* if (url) {
      return 'http://mirror.laikang.com' + url.replace(/\/api/, '')
    } else {
      return url
    } */
    return url;
}

let setHeads = {
    Cookie: ''
};
export default {
    baseURL,
    formatMedia,
    formatImage,
    get: (url, options = {
        data: {},
        head: {}
    }, ishead = false) => {
        setHeads.Cookie = wx.getStorageSync('token') || '';
        return new Promise((resolve, reject) => {
            wx.request({
                url: baseURL + url,
                data: options.data,
                header: { ...setHeads },
                success: res => {
                    let data = res.data;
                    if (res.statusCode !== 200) {
                        reject(data);
                    }
                    if (data.head) {
                        if (data.head.faultcode === 'ok') {
                            for (let i of data.body) {
                                i.logo = formatMedia(i.logo);
                            }
                            if (ishead) {
                                resolve({
                                    data: data.body,
                                    head: res.header
                                });
                            } else {
                                resolve(data.body);
                            }
                        } else {
                            reject(data.head);
                        }
                    }
                },
                fail: e => {
                    reject(e);
                }
            });
        });
    },
    post: (url, options = {
        data: {},
        head: {}
    }, ishead = false) => {
        setHeads.Cookie = wx.getStorageSync('token') || '';
        return new Promise((resolve, reject) => {
            wx.request({
                url: baseURL + url,
                data: formatData(options.data, options.head),
                header: setHeads,
                method: 'POST',
                success: res => {
                    const data = res.data;
                    if (res.statusCode !== 200) {
                        reject(data);
                    }
                    if (data.head) {
                        if (data.head.faultcode === 'ok') {
                            for (let i of data.body) {
                                i.logo = formatMedia(i.logo);
                            }
                            if (ishead) {
                                resolve({
                                    data: data.body,
                                    head: res.header
                                });
                            } else {
                                resolve(data.body);
                            }
                        } else {
                            reject(data.head);
                        }
                    }
                },
                fail: e => {
                    console.log(e);
                    reject(e);
                }
            });
        });
    }
};
