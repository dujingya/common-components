// ！！！！！！！！！
// 是否为测试环境版本，发版前必须确认
const TEST = false;

// 此中内容都是正式环境数据
let config = {
    // 组织代码
    orgCode: 'qixiu',
    baseURL: 'https://mirror.laikang.com', // 正式环境
    // 客服电话
    TELL: '18533601059',
    // 是否跳转到有赞小程序
    toZan: false,
    md: {
        open: false, // 开关
        appCode: '8000007', // 正式-用于埋点
        sendNumber: 3,
        url: '/api/user/addbehavior'
    }
};

if (TEST) {
    config.baseURL = 'https://mirror-test.v.laikang.com';
    // config.baseURL = 'http://10.2.121.249:8080'
    // config.baseURL = 'http://10.2.122.107:8080'
    // 测试-用于埋点
    config.md.appCode = 'qa_8000007';
}

export default config;
