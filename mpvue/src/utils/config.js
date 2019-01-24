export default {
    // 组织代码
    orgCode: 'sanliao',
    orgCodeQX: 'qixiu',
    baseURL: 'https://mirror-test.v.laikang.com',
    // baseURL: 'https://mirror.laikang.com', // 正式环境
    // baseURL:'http://10.39.40.14:8080',
    // 客服电话
    TELL: '18533601059',
    // 是否跳转到有赞小程序
    toZan: false,
    md: {
        open: true, // 开关
        // appCode: '8000007', // 正式-用于埋点
        // appCode: 'qa_8000007', // 测试-用于埋点
        // appCode: 'dev_8000007', // 开发-用于埋点
        // appCode: 'billboardapp',
        sendNumber: 3,
        appCode: 'healthchkapp',
        url: '/api/user/addbehavior'
    }
}
