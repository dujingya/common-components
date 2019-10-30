<template>
    <div>
        <view class="weeks box">
            <view class="week fs28" v-for="(item, k) in weeksCh" :class="{weekend: k==0,weekend: k==6}" :key="k">
                {{item}}
            </view>
        </view>
        <block v-for="(object, index) in dateList" :key="index">
            <view class="date-area" style="">
                <view class="title">{{object.year || "--"}} 年 {{object.month || "--"}} 月</view>
            </view>
            <view class="days">
                <view v-if="object.hasEmptyGrid" class="grid white-color" v-for="(item, m) in object.empytGrids" :key="m" ></view>
                <view class="grid white-color" :class="[{pinkBg:item.status==3}]" v-for="(item, n) in object.days" :key="n"  @click="selectAction(object,item)">
                    <view :class="[{disable:item.status==0,enable:item.status!=0,borderRadius:item.status==3,day: true,lastWeek: item.weekIndex==6,lastWeek: item.weekIndex==0}]">
                        {{item.day}}
                    </view>
                    <view v-if="item.status!=0" class="status">{{item.data?item.data.rest+'人':''}}</view>
                </view>
            </view>
        </block>
    </div>
</template>
<script>
    // 日期选择组件
    import Data from '@/utils/data'
    import {
        setStorage
    } from '@/utils/wechat'
    import * as API from '@/service/api'
    import fetch from '@/service/fetch'
    export default {
        data () {
            return {
                checkMan: true,
                orgYear: '',
                orgMonth: '',
                orgDay: '',
                weeksCh: '',
                startDate: '',
                endDate: '',
                allDays: [],
                dateList: []
            }
        },
        methods: {
            initData(curYear, curMonth) {
                // 计算最近三个月的对象
                let year = curYear
                let month = curMonth
                var mObject0 = this.calculateDays(year, month);
                if (month + 1 > 12) {
                    year = year + 1;
                    month = 1;
                } else {
                    month = month + 1;
                }
                var mObject1 = this.calculateDays(year, month);
                if (month + 1 > 12) { // 月不能大于12
                    year = year + 1;
                    month = 1;
                } else {
                    month = month + 1;
                }
                var mObject2 = this.calculateDays(year, month);
                this.allDays = [mObject0, mObject1, mObject2]
                this.requestAppointDate()
            },
            getThisMonthDays(year, month) {
                return new Date(year, month, 0).getDate();
            },
            getFirstDayOfWeek(year, month) {
                return new Date(Date.UTC(year, month - 1, 1)).getDay();
            },
            calculateEmptyGrids(year, month) {
                const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
                let empytGrids = [];
                if (firstDayOfWeek > 0) {
                    for (let i = 0; i < firstDayOfWeek; i++) {
                        empytGrids.push(i);
                    }
                }
                return empytGrids;
            },
            calculateDays(year, month) {
                var mObject = {};// 月对象
                mObject['year'] = year;
                mObject['month'] = month;
                // 计算当前年月空的几天
                var empytGrids = this.calculateEmptyGrids(year, month);
                if (empytGrids.length > 0) {
                    mObject['hasEmptyGrid'] = true;
                    mObject['empytGrids'] = empytGrids;
                } else {
                    mObject['hasEmptyGrid'] = false;
                    mObject['empytGrids'] = [];
                }
                var days = [];
                var thisMonthDays = this.getThisMonthDays(year, month);// 这个月有多少天
                // 现在的时间
                var cusDate = new Date(this.orgYear, this.orgMonth, this.orgDay);
                var startDate;
                var endDate;
                if (this.startDate && this.endDate) {
                    startDate = Data.stringToDate(this.startDate);
                    endDate = Data.stringToDate(this.endDate);
                }
                if (this.startDate) {
                    startDate = Data.stringToDate(this.startDate);
                }
                for (let i = 1; i <= thisMonthDays; i++) {
                    var day = {};
                    // 加入的时间
                    var date = new Date(year, month - 1, i);
                    var weekIndex = date.getDay()
                    // console.log(date)
                    // status 0-不可选择 1-当前时间 2-可选择 3-被选中
                    day['day'] = i;
                    // 比现在的时间比较是大于还是小于，小于则不可点击
                    var time = parseInt(Data.calculateTime(date, cusDate));
                    day['weekIndex'] = weekIndex
                    day['date'] = Data.formatDate(date, 'yyyy-MM-dd')
                    if (time < 0) {
                        day['status'] = 0;
                    } else if (time === 0) {
                        day['status'] = 1;
                    } else {
                        day['status'] = 2;
                    }
                    var stime = ''
                    if (this.startDate && this.endDate) {
                        stime = parseInt(Data.calculateTime(date, startDate));
                        var etime = parseInt(Data.calculateTime(date, endDate));
                        if (stime >= 0 && etime <= 0) {
                            day['status'] = 3;
                        }
                    } else if (this.startDate) {
                        stime = parseInt(Data.calculateTime(date, startDate));
                        if (stime === 0) {
                            day['status'] = 3;
                        }
                    }
                    days.push(day);
                }
                mObject['days'] = days;
                return mObject;
            },
            selectAction(e, d) {
                var year = e.year;
                var month = e.month;
                var day = d.day;
                var weekIndex = d.weekIndex
                var selectDate = new Date(year, month - 1, day);
                // 现在的时间
                var cusDate = new Date(this.orgYear, this.orgMonth, this.orgDay);
                var time = parseInt(Data.calculateTime(selectDate, cusDate));
                if (time < 0) {
                    wx.showToast({
                        title: '请选择合理的时间',
                        icon: 'error',
                        duration: 2000
                    })
                    return;
                }
                this.startDate = Data.formatDate(selectDate, 'yyyy-MM-dd');
                this.endDate = Data.formatDate(selectDate, 'yyyy-MM-dd');
                let dateInfo = {
                    date: this.startDate,
                    weekIndex: weekIndex
                }
                setStorage('dateInfo', dateInfo)
                this.initData(this.orgYear, this.orgMonth + 1);
                wx.navigateBack({
                    delta: 1, // 回退前 delta(默认为1) 页面
                    success: function(res) {
                        // success
                    },
                    fail: function(res) {
                        // fail
                    }
                })
            },
            // 请求预约日期
            requestAppointDate() {
                let start = this.allDays[0].days[0].date
                let index = this.allDays[2].days.length - 1;
                let end = this.allDays[2].days[index].date
                let query = this.$root.$mp.query
                let params = {
                    'version': '1.0',
                    'head': {
                        'firstresult': 0,
                        'maxresults': 100,
                        'bodytype': 'flat',
                        'sortfields': []
                    },
                    'body': [
                        {
                            'startday': start || '',
                            'endday': end || '',
                            'suiteid': query.id
                        }
                    ]
                }
                fetch({
                    method: 'POST',
                    baseUrl: API.baseUrl,
                    api: API.selectAppointDate,
                    contentType: 'application/json; charset=UTF-8',
                    params: params
                }).then(res => {
                    if (res.data.head.faultcode === 'ok') {
                        if (res.data.body.length > 0) {
                            let data = res.data.body;
                            for (let i = 0; i < data.length; i++) {
                                for (let n = 0; n < this.allDays.length; n++) {
                                    for (let m = 0; m < this.allDays[n].days.length; m++) {
                                        let date = this.allDays[n].days
                                        // console.log(data[i].date, date[m].date)
                                        if (data[i].date === date[m].date) {
                                            console.log(data[i].date, date[m].date, '匹配到')
                                            date[m].data = data[i]
                                        }
                                    }
                                }
                            }
                            this.dateList = this.allDays
                            console.log(this.dateList)
                        }
                    }
                }, err => {
                    console.log(err)
                })
            },
            getDateList() {
                let query = this.$root.$mp.query
                if (query.startDate && query.endDate) {
                    this.startDate = query.startDate;
                    this.endDate = query.endDate;
                }
                var date = new Date();
                // 获取当前的年月
                var curYear = date.getFullYear();
                var curMonth = date.getMonth() + 1;
                var curDay = date.getDate();
                const weeksCh = ['日', '一', '二', '三', '四', '五', '六'];
                // 设置数据
                this.orgYear = date.getFullYear()
                this.orgMonth = date.getMonth()
                this.orgDay = curDay
                this.weeksCh = weeksCh
                this.initData(curYear, curMonth);
            }
        },
        created() {
        },
        onShow() {
            this.getDateList()
        },
        mounted() {
            this.getDateList()
        }
    }
</script>
<style lang='scss' scoped>
        .box {
            display: flex;
            align-content: center;
            align-items: center;
            background: #F5F4F5;
        }

        .pink-color {
            color: rgb(64, 70, 128);
        }
        .white-color {
            color: #fff;
        }
        .fs24 {
            font-size: 24rpx;
        }
        .fs28 {
            font-size: 28rpx;
            font-weight: bold;
        }
        .weekend{
            color: #FD4346;
        }
        .fs32 {
            font-size: 32rpx;
        }
        .fs36 {
            font-size: 36rpx;
        }
        /* pages/calendar/calendar.wxss ====================================*/

        .date-area {
            width: 100%;
            padding: 10px 0;
            text-align: center;
            .title{
                font-size: 32rpx;
                font-weight: bold;
            }
        }
        .weeks {
            padding: 10px 0;
            height: 50rpx;
            line-height: 50rpx;
        }
        .week {
            flex: 1;
            text-align: center;
        }
        .days {
            display: flex;
            flex-wrap: wrap;
            align-content: center;
            align-items: center;
        }
        .grid {
            display: flex;
            width: 107.1428571429rpx;
            flex-direction: column;
            align-items: center;
            align-content: center;
            text-align: center;
            padding: 10rpx 0 20rpx;
            border-radius: 6rpx;
            -webkit-border-radius: 6rpx;
            .status{
                display: block;
                color: gray;
                height: 28rpx;
                line-height: 28rpx;
                font-size: 24rpx;
                text-align:center
            }
        }
        .day {
            width: 65rpx;
            color: black;
            font-size: 28rpx;
            font-weight: bold;
            text-align: center;
        }
        .borderRadius {
            border-radius: 50%;
            position: relative;
            left: 0;
            top: 0;
            color: #fff;
        }
        .disable {
            color: #888 !important;
        }
        .lastWeek{
            color: #fd4346;
        }
        .pinkBg {
            background-color: #fd4346;
            .day{
                color: #fff;
            }
            .status{
                color: #fff;
            }
        }
        .purple-bg {
            background-color: #b8b8f1;
        }
</style>
