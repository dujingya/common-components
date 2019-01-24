import api from '../service/api.js'
import CONFIG from './config.js'

let req = []
const submitFn = () => {
    return new Promise((reslove, reject) => {
        api.post(CONFIG.md.url, {
            data: req
        }).then(res => {
            console.log('埋点数据发送成功，清空储存数组')
            req = []
        }).catch(e => {
            console.log('埋点数据发送失败')
        })
    })
}

/*
 * @params data.eventDesc {String} @default '' 事件描述
 * @params data.eventId {String} @default '' 事件Id
 * @params data.eventSort {number} @default 1 事件顺序(用来标识同一事件的先后顺序（1/2/3）)
 * @params data.eventValue {String} @default '' 事件代表特征(如浏览文章的id，某一条记录的id等)
 * @params data.advanced {Boolean} @default false 是否立刻发送埋点报告
 */
export default (data) => {
    if (!CONFIG.md.open) {
        return
    }
    if (!data.eventId) {
        throw ('请填写时间ID')
    }
    let obj = {
        appcode: CONFIG.md.appCode,
        datatime: Date.now(),
        duration: data.duration || 0,
        eventdesc: data.eventDesc || '',
        eventid: data.eventId,
        eventsort: data.eventSort || 1,
        eventvalue: data.eventValue || '',
        userid: wx.getStorageSync('userid')
    }
    req.push(obj)
    console.log(req)
    // 是否提前发送
    if (data.advanced) {
        console.log('选择提前发送埋点数据')
        return submitFn()
    }
    // 发送到接口
    if (req.length > CONFIG.md.sendNumber) {
        console.log(`存储的数据已达到上限${CONFIG.md.sendNumber}条，直接发送埋点数据`)
        return submitFn()
    }
}
