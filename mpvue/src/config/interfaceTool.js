/**
 * [getDiseaseByCodeUrl 根据code获取疾病描述接口]
 * @type {String}
 */
const getDiseaseByCodeUrl = 'https://lk-knowledge-api-pro.op.laikang.com/dictDisease/getDiseaseByCode' // nigix pro
// const getDiseaseByCodeUrl = 'http://k.api.pro.p.laikang.com/dictDisease/getDiseaseByCode' // pro


/**
 * 问卷报告地址
 * @type {String}
 */
const baseUrl = 'https://lk-mahout-api-pro.op.laikang.com' //  ngix pro
// const baseUrl = 'https://lk-mahout-api-dev.op.laikang.com' // 盐城paas dev



/**
 * 知识库接口[包括五养和健康计划]
 * @type {String}
 */
// const knowledgeLibUrl = 'https://k-api-pro.op.laikang.com' // ngix pro
// const knowledgeLibUrl = 'http://k.api.pro.p.laikang.com' // pro
// const knowledgeLibUrl = 'http://k.api.dev.p.laikang.com' // dev
const knowledgeLibUrl = 'https://lk-knowledge-api-pro.op.laikang.com/' // 盐城paas pro
// const knowledgeLibUrl = 'https://lk-knowledge-api-dev.op.laikang.com' // 盐城paas dev

export {
    getDiseaseByCodeUrl,
    baseUrl,
    knowledgeLibUrl
}
