'use strict'
var speakeasy=require('speakeasy') //基于一系列安全算法，生成随机数字的工具库

//生成验证码
exports.getCode=function(){
    var code=speakeasy.totp({
        secret:'learnJap', //加密
        digits:4 //验证码是4位
    })
    return code
}
//生成随机电话号码
exports.getPhone=function(){
    var phone=speakeasy.totp({
        secret:'learnJap', //加密
        digits:11 //电话号码是11位
    })
    return phone
}