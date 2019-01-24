// baseUrl
export let baseUrl = 'https://mirror-test.v.laikang.com'; // dev环境
// export let baseUrl = 'http://10.4.105.123:8080'; // dev环境
// export let baseUrl = 'http://10.4.109.59:8080'; // dev环境
// export let baseUrl = 'https://mirror.laikang.com'; // 生产环境
// export let qiuxiuUrl = 'https://mirror-test.v.laikang.com/api/actions' // 七修商城域名

if (process.env.NODE_ENV === 'qualityAssurance') {
    baseUrl = 'https://lk-xchx-api-qa.op.laikang.com'; // qa环境
} else if (process.env.NODE_ENV === 'production') {
    baseUrl = 'https://lk-xchx-pinghengcheng-pro.op.laikang.com'; // pro环境
}
console.log(baseUrl);


/* openGId解码 */
export const getOpenGId = '/api/v1/xchx/getOpenGId';
// 登录
export const login = '/api/login/wxappcode';
// 检测是否登录
export const isLogin = '/api/user/info';
// 获取套餐或则商品列表 type 可选值healthcheck，goods
export const getPackageList = '/api/billboard/search/sanliao';
// 个人体检金列表
export const getCashList = '/api/account/getUnclaimes';
// 领取体检金
export const getCashTicket = '/api/account/getAccountByAccountid';
// 是否有可领取健康金
export const getHasCashTicket = '/api/account/existUnclaimes';
// 套餐子项查询
export const getPackageChild = '/api/healthcheck/group/getChildInfo';
// 套餐加项查询
export const getPackageAdd = '/api/healthcheck/group/getPlusInfo/';
// 子项信息查询/api/healthcheck/group/getGroupItemByGId/{orgcode}/{gid}
// 套餐订单/提交订单
export const getOrderSubmit = '/api/healthcheck/order/submit';
// 套餐订单支付
export const getOrderPay = '/api/healthcheck/order/pay';
// 订单/获取全部订单
export const getOrderListAll = '/api/boardorder/alllist';
// 订单/获取状态订单
export const getOrderState = '/api/boardorder/list';
// 订单/获取订单详情
export const orderDetail = '/api/boardorder/infos';
// 体检/预约时间列表查询
export const getCheckDay = '/api/healthcheckday/list';
// 获取套餐或商品分类 type 可选值healthcheck，goods
export const getPackagekinds = '/api/billboard/kinds/sanliao';
// 获取套餐子项内容
export const getChildInfo = '/api/healthcheck/group/getChildInfo';
// 根据分类查询套餐列表
export const listbykind = '/api/billboard/listbykind';
// 获取验证码
export const phoneCode = '/api/user/sendverifcode';
// 保存用户名，手机号
export const userInfo = '/api/user/saveusermobile';
// 获取套餐详情
export const packageDetail = '/api/healthcheck/group/getBillboardAndChildInfo';
// 个人信息查询
export const getUserInfo = '/api/user/getuserinfo';
// 子项信息查询
export const getGroupItemByGId = '/api/healthcheck/group/getGroupItemByGId';
// 根据套餐查询健康金
export const selectHealthCashById = '/api/account/getReceivedAccount';
// 查询预约时间
export const selectAppointDate = '/api/healthcheckday/list/sanliao';
// 体检预约发起
export const creatAppointOrder = '/api/healthcheck/appo/destine';
// 查询已预约列表
export const appointList = '/api/healthcheck/appo/list';
// 我已到店
export const arrive = '/api/healthcheck/appo/arrive';
// 获取预约详情
export const appointDetail = '/api/healthcheck/appo/load';
// 获取体检报告
export const getReportList = '/api/healthcheck/report/list';
// 体检金使用范围
export const getMealNamesByTaskid = '/api/account/getMealNamesByTaskid';
// 适用体检金的套餐分类查询（点击体检金进入的下一个页面）
export const getMealClassByTaskid = '/api/billboard/searchWithTaskid';
// ****************************************************商城相关接口*******************************************************
// 分类接口
export const getMallGoodsKinds = '/api/billboard/kinds';
// 搜索接口
export const getMallGoodsSearch = '/api/billboard/search';
// 七修api
export const find = '/api/mallfrontpage/find';
// 按活动查询商品列表
export const querybykind = '/api/mallfrontpage/querybykind';
// 获取商品信息
export const goodsMsg = '/api/billboard/load';
// 更多推荐
export const recommended = '/api/billboard/tagrelated';
// 收藏
export const savefavorite = '/api/billboard/savefavorite';
// 取消收藏
export const cancelfavorite = '/api/billboard/cancelfavorite';
// 我的收藏
export const goodsCollect = '/api/billboard/listfavorite';
// 根据轮播查询商品
export const querybybannerpromid = '/api/mallfrontpage/querybybannerpromid';
// 按活动查询商品列表
export const querybyprom = '/api/mallfrontpage/querybyprom';
// 商品订单提交
export const goodsOrderSubmit = '/api/boardorder/submit';
// 商品订单支付信息查询接口
export const getGoodsOrderPay = '/api/billboard/pay';
// 商品订单申请退款
export const getGoodsOrderRefund = '/api/boardorder/refund';
// 查询地址
export const getMallAddress = '/api/boardorder/address';
// 取消订单
export const cancelOrder = '/api/boardorder/cancel';
// 取消预约单
export const cancerAppoint = '/api/healthcheck/appo/cancel';
// 申请退款
export const orderRefund = '/api/boardorder/healthcheckrefund';


