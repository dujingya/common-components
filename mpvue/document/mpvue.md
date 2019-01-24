# mpVue 使用文档

- [gitHub](https://github.com/Meituan-Dianping/mpvue)
- [官方介绍](http://mpvue.com/)
- [快速上手](http://mpvue.com/mpvue/quickstart/)
- [使用手册](http://mpvue.com/mpvue/)
- [awesome-mpvue](https://github.com/mpvue/awesome-mpvue)
##mpvue简介
mpvue （github 地址请参见）是一个使用 Vue.js 开发小程序的前端框架。框架基于 Vue.js 核心，mpvue 修改了 Vue.js 的 runtime 和 compiler 实现，使其可以运行在小程序环境中，从而为小程序开发引入了整套 Vue.js 开发体验。除了 Vue 本身的生命周期外，mpvue 还兼容了小程序生命周期，这部分生命周期钩子的来源于微信小程序的 Page， 除特殊情况外，不建议使用小程序的生命周期钩子。
##框架原理
- mpvue 保留了 vue.runtime 核心方法，无缝继承了 Vue.js 的基础能力
- mpvue-template-compiler 提供了将 vue 的模板语法转换到小程序的 wxml 语法的能力
- 修改了 vue 的建构配置，使之构建出符合小程序项目结构的代码格式： json/wxml/wxss/js 文件
##构建项目
通过 Vue.js 命令行工具 vue-cli，你只需在终端窗口输入几条简单命令，即可快速创建和启动一个带热重载、保存时静态检查、内置代码构建功能的小程序项目：
```
# 全局安装 vue-cli
$ npm install --global vue-cli

# 创建一个基于 mpvue-quickstart 模板的新项目
$ vue init mpvue/mpvue-quickstart my-project

# 安装依赖
$ cd my-project
$ npm install
# 启动构建
$ npm run dev
```
接下来，你只需要启动微信开发者工具，引入项目中编译打包好的的dist目录即可预览到你的第一个 mpvue 小程序。
## 支持scss

第一：分别安装：

```shell
cnpm install sass-loader --save-dev

cnpm install node-sass --save-dev
```

第二： 改造style标签，增加属性lang="scss": 这样就可以愉快的在style内写sass了，webpack会自动编译输出

```html
<style lang="scss">
.page {
　　background: $nav-color;
    .test{
      color:red;
    }
}
</style>
```
第三： 当style标签上加上scoped的时候，page标签高度设置100%无效。如需设置page的高度为屏幕高度，则需去掉scoped

##Class 与 Style 绑定
为节约性能，我们将 Class 与 Style 的表达式通过 compiler 硬编码到 wxml 中，可以在也样式的编写过程中提供很多的遍历，支持语法和转换效果如下：

class 支持的语法:
```angular2
<p :class="{ active: isActive }">111</p>
<p class="static" v-bind:class="{ active: isActive, 'text-danger': hasError }">222</p>
<p class="static" :class="[activeClass, errorClass]">333</p>
<p class="static" v-bind:class="[isActive ? activeClass : '', errorClass]">444</p>
<p class="static" v-bind:class="[{ active: isActive }, errorClass]">555</p>

```
style 支持的语法:
```angular2
<p v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }">666</p>
<p v-bind:style="[{ color: activeColor, fontSize: fontSize + 'px' }]">777</p>
```
## 采坑注意：

- 列表中没有的原生事件也可以使用例如 bindregionchange 事件直接在 dom 上将bind改为@ @regionchange,同时这个事件也非常特殊，它的 event type 有 begin 和 end 两个，导致我们无法在handleProxy 中区分到底是什么事件，所以你在监听此类事件的时候同时监听事件名和事件类型既 <map @regionchange="functionName" @end="functionName" @begin="functionName"><map>
- 小程序能力所致，bind 和 catch 事件同时绑定时候，只会触发 bind ,catch 不会被触发，要避免踩坑。
- 事件修饰符：
   - .stop 的使用会阻止冒泡，但是同时绑定了一个非冒泡事件，会导致该元素上的 catchEventName 失效！
   - .prevent 可以直接干掉，因为小程序里没有什么默认事件，比如submit并不会跳转页面
   - .capture 支持 1.0.9
   - .self 没有可以判断的标识
   - .once 也不能做，因为小程序没有 removeEventListener, 虽然可以直接在 handleProxy 中处理，但非常的不优雅，违背了原意，暂不考虑
##表单控件绑定

建议开发过程中直接使用 微信小程序：表单组件 。用法示例：

select 组件用 picker 组件进行代替
```angular2
    <picker @change="bindPickerChange" :value="index" :range="array">
      <view class="picker">
        当前选择：{{array[index]}}
      </view>
    </picker>
```
表单元素 radio 用 radio-group 组件进行代替
```angular2
    <radio-group class="radio-group" @change="radioChange">
      <label class="radio" v-for="(item, index) in items" :key="item.name">
        <radio :value="item.name" :checked="item.checked"/> {{item.value}}
      </label>
    </radio-group>

```

## 小程序无法运行，提示找到不app.json文件

`npm run dev`后,将小程序的入口映射成./dist目录,运行后提示找不到app.json文件

解决方法:

1. 将project.config.json文件拷贝到./dist目录下
2. 删除project.config.json文件中的`"miniprogramRoot": "./dist/",`
3. 用npm重新安装依赖

```shell
npm set registry https://registry.npm.taobao.org/
npm install
```
##展示富文本内容
因为v-html 指令在mpvue不能用
当数据为富文本的时候可以使用插件mpvue-wxparse：

mpvue-wxparse：适用于 Mpvue 的微信小程序富文本解析自定义组件，支持 HTML 及 markdown 解析

使用方式：

安装： 
`npm i mpvue-wxparse --save`
```
<template>
  <div>
    <wxParse :content="article" />
  </div>
</template>
<script>
import wxParse from 'mpvue-wxparse'
export default {
  components: {
    wxParse
  },
  data () {
    return {
      article: '<div>我是HTML代码</div>'
    }
  }
}
</script>
<style>
@import url("~mpvue-wxparse/src/wxParse.css");
</style>
```

## 页面跳转时传递参数

**传递参数**

- [native](https://developers.weixin.qq.com/miniprogram/dev/api/ui-navigate.html)
- [mpvue](http://mpvue.com/mpvue/#_18)

传递参数时在url后面加上即可

例子如下:

```javascript
let queryParam = {
    code: this.routerParams.code
}
let url = ''
if (this.paramsStr && this.paramsStr.length > 0) {
    queryParam.params = this.paramsStr
    url = `../topic/main?code=${this.routerParams.code}&params=${this.paramsStr}`
} else {
    url = `../topic/main?code=${this.routerParams.code}`
}
wx.navigateTo({ url })
```

**获取参数**

使用`this.$root.$mp.query`获取参数

例子如下:

```javascript
mounted() {
    this.routerParams = this.$root.$mp.query
    console.log('this.routerParams', this.routerParams);
}
```

> 必须在mounted()方法中调用,在created()方法中会出错。

## 将数据渲染到视图上时,需去掉this,否则无法渲染出数据

例如:

```html
<div class="question" v-if="this.paging.curPage % 2 === 0">
    <single-topic v-for="(questionItem,index) in this.surveyQuestionList" :key="index" :questionItem="questionItem"></single-topic>
</div>
```

> 如`this.paging.curPage`是获取不到值的，去掉this即可

正确写法如下:

```html
<div class="question" v-if="paging.curPage % 2 === 0">
    <single-topic v-for="(questionItem,index) in surveyQuestionList" :key="index" :questionItem="questionItem"></single-topic>
</div>
```

## 页面跳转时传递参数有特殊字符串时，需要手动编码和解码

例如:

```javascript
  let url  = `../topic/main?code=1&*&23.0129`
  wx.navigateTo({ url })
```

> `&`是特殊字符会被分割，从而导致出错

**编码和解码工具函数**

编码:

```javascript
/**
 * [encodeUrlParam 编码参数]
 * @param  {[type]} url      [页面对应的url] 如 '../report/main'
 * @param  {[type]} paramObj [参数对象] 如 {code:100}
 * @return {[type]}          [description]
 */
function encodeUrlParam(url, paramObj = {}) {
    let params = ''
    if (paramObj) {
        let keys = Object.keys(paramObj)
        for (let key of keys) {
            let val = paramObj[key]
            if (val) {
                // console.log('key', val, typeof val)
                if (typeof val === 'object') {
                    val = JSON.stringify(val)
                }
                val = encodeURIComponent(val)
            }
            params += `${key}=${val}&`
        }
    }
    if (params) {
        params = params.substr(0, params.length - 1)
    }
    if (params) {
        return `${url}?${params}`
    }
    return url
}
```

解码:

```javascript
/**
 * [decodeUrlParam 解码参数]
 * @param  {[type]} paramObj [参数对象]
 * @return {[type]}          [description]
 */
function decodeUrlParam(paramObj = {}) {
    if (paramObj && typeof paramObj === 'object') {
        let keys = Object.keys(paramObj)
        for (let key of keys) {
            let val = paramObj[key]
            if (val) {
                // console.log('key', val, typeof val)
                let strVal = decodeURIComponent(val)
                try {
                    paramObj[key] = JSON.parse(strVal)
                } catch (ex) {
                    paramObj[key] = strVal
                }
            }
        }
    }
    return paramObj
}
```

**工具函数用法**

编码用法如下:

```javascript
let queryParam = {
    code: this.routerParams.code,
    test: '似懂非懂',
    ll: {
        age: 100
    },
    mk: ['mm', 'ss'],
    op: '1&*&23.0129'
}
let url = encodeUrlParam('../report/main', queryParam)
console.log('url', url)
wx.navigateTo({ url })
```

解码用法如下:

```javascript
mounted() {
    this.routerParams = decodeUrlParam(this.$root.$mp.query)
    console.log('this.routerParams', this.routerParams);
}
```

## 不支持{{method(param)}}语法

如下:

```html
<template>
    <div class="contain">
      {{getTitle()}}
    </div>
</template>
```

```javascript
export default {
  data(){
    return{
      report:{
        title:'睡眠报告'
      }
    }
  },
  method:{
    getTitle(){
      return this.report.title + new Date()
    }
  }
}
```

> 以上代码在微信小程序上无法显示

解决方法，使用计算属性代替，如下:

```html
<template>
    <div class="contain">
      {{getTitle}}
    </div>
</template>
```

```javascript
export default {
  data(){
    return{
      report:{
        title:'睡眠报告'
      }
    }
  },
  computed:{
    getTitle(){
      return this.report.title + new Date()
    }
  }
}
```

## mpvue的生命周期

例如：有A、B两个页面，先进入A页面再由A跳转到界面，生命周期方法如下：

```text
加载A页面时（A页面是入口页面）
先执行 A.created() => B.created() => A.onLoad() => A.onShow() => A.onReady() => A.mounted()

从A页面跳转到B页面
A.onHide() => B.onLoad() => B.onShow() => B.onReady() => B.mounted()

从B页面返回到A页面(调用小程序返回键功能,wx.navigateBack({ delta: 1 }))
B.onUnload() => A.onShow()

从B页面返回到A页面(路由跳转,wx.navigateTo({ url: '../cover/main?code=3' })
B.onHide() => A.onLoad() => A.onShow() => A.onReady() => A.mounted()

switchTab 的切换
如果页面已经加载过一次 那么 只走 onShow() 生命周期

组件的生命周期
非tab页面内的组件： 第一次加载 不走onshow(),走created(),onload(),mounted()；之后加载，走onload(),onshow()
tab页面内的组件： 第一次加载 不走onshow(),走created(),onload(),mounted()；之后加载，onshow()

关于调用 小程序扫码 触发的生命周期
1、扫码结束后 会自动调用 当前页面的 onshow
安卓手机和苹果手机的区别
 - 安卓手机 扫码成功后。先调用 onshow 再返回结果
 - 苹果手机 扫码成功后。先返回结果 再调用 onshow

 如果是在switchTab页面 等 必须在 onshow里面处理的 要防止重复调用
 解决方法

 onshow(){
    if(flag){
        flag=false;
        return
    }
    ....
 }

 onscan(){
    flag=false;
    wx.scanCode({
      success (res) {
          console.log(res)
        }
    })
 }


```

> `wx.navigateBack({ delta: 1 })`:将当前页面出栈

> `wx.navigateTo({ url: '../cover/main?code=3' })`:路由跳转

## tabBar不显示图片

- [wx tabBar](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html)

将images目录拷贝到dist目录下即可.

iconPath和selectedIconPath为图片路径，icon 大小限制为`40kb`，建议尺寸为 `81px * 81px`

## 引入外部css文件

- 因为小程序需要把css 转换层 wxss 文件所以不能把css文件放到static 文件夹中
- 在src 里面建个文件夹 例如 style 文件  里面有 common.css
- 要在main.js  里面 import '../style/common.css'    不需要定义变量。直接引入

## 变量使用需要手动重置
- 因为小程序对页面优化。在很短的时间内无论怎么进入该页面，页面的变量保留上次的数值。不会用data里面的初始值。
- 比如

```javascript
data(){
  sex:'girl',
  height:'50',
  name:'hlj'
}

```
再短时间内进入页面需要初始化数据
Object.assign(this.$data, this.$options.data())
在 mounted 里面调用

## 在swiper里面做单选自动切换
问题：单选后自动切换下一屏会出现数据选择。视图没有选中的现象 手动在选中事件里面对数据进行遍历赋值选中，然后自动切换数据视图选中了。但是又出现闪烁
解决：在选中事件里面进行选中值得赋值。在 radio 里面设置checked 如下
```javascript
<radio :id="optionItem.optionId" class="option-radio" type="radio" :name="questionItem.itemId" :value="optionItem.optionId" :checked="optionItem.optionId==questionItem.singelCheckId?true:false" />
<label :for="optionItem.optionId" class="radio option-label">{{optionItem.optionContent}}</label>
```
## 小程序的图表插件

- [wx-charts](https://github.com/xiaolin3303/wx-charts)
优点 :
1.体积小。
2.使用小程序原生的canvas实现 直接引入就可以使用
缺点：
1.可配置项比较少。简单的需求可采用

- [echarts-for-weixin](https://github.com/ecomfe/echarts-for-weixin)
优点 :
1.可配置项比较多。
2.echarts提供的小程序组件。和微信小程序团队打通。效果比较强大
缺点：
1.体积大 几百k但是可以按需定制减小体积
  [自由定制连接](http://echarts.baidu.com/builder.html)
2.组件是以小程序原生的组件存在
需要引入小程序原生组件 在mpvue里面需要其它工具辅助打包到dist
工具：
-[mport-weapp-component](https://github.com/JJJYY/import-weapp-component)
##最佳实践
- 精简 data 数据
    - 冗余数据不要挂在 data 里
- 优化长列表性能
    - 避免在 v-for 中嵌套子组件，这样可以优化大部分部分 setData 时的冗余数据。
    - 通过实践发现 wx:if 和 hidden 的优化肉眼不可见，所以或许可以试试直接通过样式 display 来展示和隐藏。
    - 如果列表过长，强烈建议产品思考更好的展示形态。比如只展示热门，多余的折叠等形式。
- 合理使用双向绑定 
    - mpvue 建议使用 v-model.lazy 绑定方式以优化性能，此外 v-model 在老基础库下输入框输入时可能存在光标重设的问题。
- 谨慎选择直接使用小程序的 API 
    - 如果你有小程序和H5复用代码的需要，业务代码需要保持对 WEB Vue.js 的兼容性。此时我们不建议在代码中直接调用小程序API 
## mpvue 引入小程序的原生组件方法
[引入小程序原生组件的例子](https://github.com/JJJYY/mpvue-iview)
[引入小程序原生组件的辅助工具](https://github.com/JJJYY/import-weapp-component)

## 小程序自定义返回按钮
小程序自带的导航返回按钮,不能直接监听到点击导航上的返回事件.如果需要此需求,要自定义导航.坑点,自定义导航需要是全局自定义,更换所有的导航.
## 图片加载优化
图片下载完成之后,通过@load监听,进行后续处理.
```
 <img :src="bottomImg" alt="" class="bottomImg" @load="imgOnLoad"/>
```
