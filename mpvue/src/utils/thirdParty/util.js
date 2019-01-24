// 时间格式化
const formatTime = (date = new Date()) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};
const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n;
};

module.exports = {
    formatTime,
    store: {
        get: key => {
            const data = wx.getStorageSync(key);
            try {
                return JSON.parse(data);
            } catch (e) {
                return data;
            }
        },
        set: (key, data) => {
            if (typeof (data) === 'object') {
                wx.setStorageSync(key, data);
            }
        }
    },
    // 富文本格式化
    htmlFormat: text => {
        let newContent = text.replace(/<img[^>]*>/gi, (match, capture) => {
            // return match.replace(/style=\"(.*)\"/gi, 'style=""');
            if (match.includes('style=')) {
                return match.replace(/style=\\"(.*)\\"/gi, 'style="width:100%;display:block;"');
            } else {
                return match.replace(/<img/gi, '<img class="img" style="width:100%;display:block;" ');
            }
        });
        newContent = text.replace(/<br>/gi, (match, capture) => {
            return match.replace(/<br>/gi, '<div style="height: 15px;"></div>');
        });
        return newContent;

        // return text.replace(/style=\"(.*)\"/gi, 'style=""')
        // return text;
    },
    imgReg: str => {
        var imgReg = /<img.*?(?:>|\/>)/gi;
        // 匹配src属性
        var srcReg = /src=[\\'\\"]?([^\\'\\"]*)[\\'\\"]?/i;
        var arr = str.match(imgReg);
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                var src = arr[i].match(srcReg);
                // 获取图片地址
                if (src[1]) {
                    var regHttp = new RegExp('^http');
                    if (!regHttp.test(src[1])) {
                        console.log('已匹配的图片地址' + (i + 1) + '：' + src[1]);
                        let url = 'http://mirror.laikang.com' + src[1];
                        str = str.replace(src[1], url);
                    }
                    ;
                }
            }
        }
        return str;
    },
    fileType: name => {
        const img = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bpg'];
        const video = ['avi', 'wmv', 'mpeg', 'mp4', 'mov', 'mkv', 'flv', 'f4v', 'm4v', 'rmvb', 'rm', '3gp', 'dat', 'ts', 'mts', 'vob'];
        const audio = ['ogg', 'mp3', 'wav', 'mp3pro', 'wma', 'asf'];
        if (name) {
            let na = name.split('?')[0].split('.');
            const len = na.length;
            let t = na[len - 1].toLowerCase();
            const types = {
                img,
                video,
                audio
            };
            for (let i in types) {
                if (types[i].includes(t)) {
                    return i;
                }
            }
        } else {
            return 'none';
        }
    }
};
