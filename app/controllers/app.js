'use strict'
var mysql=require('../../db/user')
var xss=require('xss') //对用户输入内容进行过滤，避免XSS恶意攻击的模块
var robot=require('../service/robot')
//判断post接口是否有post的body数据
exports.hasBody=function *(next){
    var body=this.request.body||{}
    if(Object.keys(body).length===0){ //body是空的或者里面一个key值都没有
        this.body={
            success:false,
            msg:'是不是忘记post数据了？'
        }
        return //直接返回
    }
    yield next //继续往下执行
}
//判断post接口是否有post的accessToken数据
exports.hasToken=function *(next){
    var accessToken=this.query.accessToken;//如果是get请求，query表示从参数串上获取accessToken
    if(!accessToken){
        accessToken=xss(this.request.body.accessToken);//如果是post请求，直接从body获取accessToken
        if(!accessToken){
            this.body={
                success:false,
                msg:'accessToken丢了'
            }
            return //直接返回
        }
    }
    //有了accessToken，开始查是否有该用户
    var user=yield mysql.query("SELECT * FROM userschema.userlist WHERE accessToken='"+accessToken+"'")
    if(!user){
        this.body={
            success:false,
            msg:'没有该用户信息！'
        }
        return //直接返回
    }else{
        console.log("有该用户的信息！")
        this.session=this.session || {} //用户信息user交给会话
        this.session.user=user
        yield next
    }
}
//获取七牛签名的接口实现
exports.signature=function *(next){
    var body=this.request.body;
    var cloud=body.cloud;
    var data;
    if(cloud=="qiniu"){
        data=robot.getQiniuToken(body)
        this.body={
            success:true,
            data:data
        }
        return
    }else{
        this.body={
            success:false,
            msg:'cloud不是七牛！'
        }
        return
    }
}