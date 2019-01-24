<template>
    <div class="phonemodal" v-if="showBindPhone" >
        <div class="content">
            <div class="showModal">
                <div class="title">
                    核实信息，领取健康金
                    <img @click="senMsgToParent" src="../image/close.png">
                </div>
                <div class="text">
                    <div class="box">
                        <div class="name">
                            <div class="left">姓名</div>
                            <div class="right">
                                <input v-on:input="getNameValue" @blur="getUserName()" placeholder-style="line-height:40rpx" placeholder-class="placeClass"  placeholder="请输入全名"/>
                            </div>
                        </div>
                        <div class="telephone">
                            <div class="left">手机号</div>
                            <div class="right">
                                <input v-on:input="getPhoneValue"  @blur="verifyPhone()" placeholder="请输入11位手机号"/>
                            </div>
                        </div>
                        <div class="code">
                            <div class="codeNum">
                                <div class="left">验证码</div>
                                <div class="right">
                                    <input  v-on:input='getCodeValue' @blur="verifyCode()" placeholder="请输入验证码"/>
                                </div>
                            </div>
                            <div class="time">
                                <div v-if="countTime==60" @click="getCode" class="timeBtn">获取验证码</div>
                                <div v-else class="timeBtn send">重新发送<span>({{countTime}}s)</span></div>
                            </div>
                        </div>
                        <div class="login1" @click="saveMsg">确定</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  // import {
  //     encodeUrlParam
  // } from '@/utils/urlTool'
  import * as API from '@/service/api'
  import fetch from '@/service/fetch'
  // import {
  //     login,
  //     setStorage
  // } from '@/utils/wechat'
  // import Config from '@/utils/config'
  export default {
      // name: 'bindphone',
      props: [
          'showBindPhone'
      ],
      data () {
          return {
              countTime: 60
          }
      },
      methods: {
          verifyCode() {
              if (this.phoneCode.length > 6) {
                  let err = '输入验证码有误'
                  this.errMsg(err)
              } else if (!this.phoneCode) {
                  let err = '请输入验证码'
                  this.errMsg(err)
              }
          },
          getUserName() { // 获取用户名称
              let name = this.userName
              if (name === '') {
                  let err = '请输入姓名'
                  this.errMsg(err)
              } else if (name > 16) {
                  let err = '用户名最长不能超过16个字符'
                  this.errMsg(err)
              }
          },
          verifyPhone() { // 验证手机号码
              let phone = this.phoneNumber;
              if (!(/^1[34578]\d{9}$/.test(phone))) {
                  this.right = false
                  if (phone === '') {
                      let err = '请输入手机号码'
                      this.errMsg(err)
                  } else {
                      let err = '手机号有误'
                      this.errMsg(err)
                  }
              } else {
                  this.right = true
              }
          },
          getCode() {
              if (this.phoneNumber && this.userName) {
                  if (this.countTime === 0) {
                      this.countTime = 60;
                      return false
                  } else {
                      if (this.countTime === 60) {
                          this.getPhoneCode()
                      }
                      this.countTime = this.countTime - 1;
                  }
                  setTimeout(() => {
                      this.getCode()
                  }, 1000)
              } else {
                  if (!this.userName) {
                      let err = '请输入姓名'
                      this.errMsg(err)
                  } else if (!this.phoneNumber) {
                      let err = '请输入手机号'
                      this.errMsg(err)
                  }
              }
          },
          getPhoneCode() {
              let params = {
                  'version': '1.0',
                  'head': {
                      'firstresult': 0,
                      'maxresults': 10,
                      'bodytype': 'flat',
                      'sortfields': []
                  },
                  'body': [
                      {
                          'value': this.phoneNumber
                      }
                  ]
              }
              fetch({
                  method: 'POST',
                  baseUrl: API.baseUrl,
                  api: API.phoneCode,
                  contentType: 'application/json; charset=UTF-8',
                  params: params
              }).then(res => {
                  console.log(res)
                  if (res.data.head.faultcode === 'ok') {
                      this.classList = res.data.body
                      console.log(this.classList)
                  }
              }, err => {
                  console.log(err)
                  this.errMsg()
              })
          },
          saveMsg() { // 保存用户信息
              if (this.userName && this.phoneNumber && this.phoneCode) {
                  let params = {
                      'version': '1.0',
                      'head': {
                          'firstresult': 0,
                          'maxresults': 10,
                          'bodytype': 'flat',
                          'sortfields': []
                      },
                      'body': [
                          {
                              username: this.userName,
                              mobile: this.phoneNumber,
                              code: this.phoneCode
                          }
                      ]
                  }
                  fetch({
                      method: 'POST',
                      baseUrl: API.baseUrl,
                      api: API.userInfo,
                      contentType: 'application/json; charset=UTF-8',
                      params: params
                  }).then(res => {
                      console.log(res)
                      if (res.data.head.faultcode === 'ok') {
                          this.senMsgToParent(false)
                      }
                  }, err => {
                      console.log(err)
                      this.errMsg()
                  })
              } else {
                  if (!this.userName) {
                      let err = '请输入姓名'
                      this.errMsg(err)
                  } else if (!this.phoneNumber) {
                      let err = '请输入手机号'
                      this.errMsg(err)
                  } else if (!this.phoneCode) {
                      let err = '请输入验证码'
                      this.errMsg(err)
                  }
              }
          },
          errMsg(text) {
              wx.showToast({
                  title: text || '请求超时，稍后重试',
                  icon: 'none',
                  duration: 2000
              })
          },
          getNameValue(val) {
              this.userName = val.mp.detail.value
              console.log(this.userName)
          },
          getPhoneValue(val) {
              this.phoneNumber = val.mp.detail.value
              console.log(this.phoneNumber)
          },
          getCodeValue(val) {
              this.phoneCode = val.mp.detail.value
              console.log(this.phoneCode)
          },
          senMsgToParent(ev) {
              // this.loginModal = false
              // this.isModal = false
              // this.notScroll = false
              console.log('请求成功,调用关闭方法', ev)
              this.$emit('listenToChildCloseModal', ev)
          }
      }
  };
</script>

<style lang="scss">
    .phonemodal{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0,0,0, .6);
        z-index: 20000;
        .content{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            .showModal{
                position: relative;
                width: 70%;
                height: 550rpx;
                margin-top: 30%;
                background: #fff;
                border-radius: 10rpx;
                -webkit-border-radius: 10rpx;
                padding: 0 20rpx;
                overflow: hidden;
                .title{
                    position: relative;
                    height: 80rpx;
                    font-size: 28rpx;
                    line-height: 80rpx;
                    text-align: left;
                    border-bottom: 2rpx solid #F6E8F1;
                    img{
                        position: absolute;
                        top: 20rpx;
                        right: 0;
                        width: 30rpx;
                        height: 30rpx;
                    }
                }
                .text{
                    position: absolute;
                    top: 82rpx;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    .box{
                        position: relative;
                        height: 100%;
                        width: 100%;
                        overflow: hidden;
                    }
                    ul{
                        width: 100%;
                        height: 100%;
                        overflow: auto;
                        li{
                            margin: 0 20rpx;
                            font-size: 24rpx;
                        }
                        .childDetail{
                            border-bottom: 2rpx solid #f1f1f1;
                            overflow: hidden;
                            padding: 10rpx 0;
                            .left{
                                float: left;
                                width: 30%;
                            }
                            .right{
                                float: right;
                                width: 70%;
                            }
                        }
                    }
                    .name,.telephone,.code{
                        position: relative;
                        height: 80rpx;
                        margin: 20rpx;
                        display: block;
                        overflow: hidden;
                        .left{
                            float: left;
                            height: 80rpx;
                            width: 120rpx;
                            padding-left: 20rpx;
                            line-height: 80rpx;
                            font-size: 28rpx;
                            color: #1b1b1b;
                            text-align: left;
                            box-sizing: border-box;
                            -webkit-box-sizing: border-box;
                        }
                        .right{
                            margin-left: 120rpx;
                            height: 80rpx;
                            overflow: hidden;
                            input{
                                height: 40rpx !important;
                                min-height: 40rpx;
                                max-height: 40rpx;
                                background:none;
                                outline:none;
                                border:0px;
                                margin: 20rpx 0;
                                width: 100%;
                                /*line-height: 40rpx;*/
                                font-size: 28rpx;
                            }
                            .placeClass{
                                font-size: 28rpx;
                                line-height: 40rpx;
                                height: 40rpx;
                            }
                        }
                        .codeNum{
                            display: block;
                            margin-right: 200rpx;
                            background: #f1f1f1;
                        }
                        .time{
                            position: absolute;
                            width: 200rpx;
                            height: 80rpx;
                            right: 0;
                            top: 0;
                            .timeBtn{
                                margin-left: 10rpx;
                                height: 100%;
                                line-height: 80rpx;
                                text-align: center;
                                font-size: 28rpx;
                                background: #fd4346;
                                color: #fff;
                            }
                            .send{
                                background: rgba(253,67,70,.7);
                            }
                        }
                    }
                    .name,.telephone{
                        background: #f1f1f1;
                    }
                    .login1{
                        width: 60%;
                        height: 80rpx;
                        line-height: 80rpx;
                        color: #fff;
                        border-radius: 8rpx;
                        -webkit-border-radius: 8rpx;
                        margin: 40rpx auto;
                        text-align: center;
                        background: #fd4346;
                    }
                }
            }
        }
    }

</style>
