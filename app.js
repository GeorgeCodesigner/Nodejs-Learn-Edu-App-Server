/*
 * Created by chencz on 2017/3/26.
 */
'use strict';
/*var fs=require('fs')
var path=require('path')
//遍历数据库配置文件所在目录db，把所有js或者coffee文件require进来
var models_path=path.join(__dirname,'/db')
var walk=function(modelPath){
    fs
        .readdirSync(modelPath)//读出该文件夹下所有的文件
        .forEach(function(file){ //遍历该路径下所有的文件
            var filePath=path.join(modelPath,'/'+file)
            var stat=fs.statSync(filePath)
            if(stat.isFile()){ //如果是文件
                if(/(.*)\.(js|coffee)/.test(file)){
                    require(filePath)
                }
            }else if(stat.isDirectory()){
                walk(filePath) //不是文件，而是嵌套文件夹的情况
            }
        })
}
walk(models_path)*/
//koa开发后台
var koa=require('koa')
var logger=require('koa-logger')//开发环境下的日志中间件，建议放在应用最开始部分，也就是这里的app.js文件里面
var session=require('koa-session')//基于cookie的会话中间件，保持用户会话状态，这里用来存储当前会话的数据
var bodyParser=require('koa-bodyparser')//解析表单数据等，从而生成对象结构数据的中间件
var app=koa() //koa实例化

app.keys=['learnJap'] //基于cookie会话中间件session加密的key
//使用中间件
app.use(logger())
app.use(session(app))
app.use(bodyParser())

var router=require('./config/routes')()
app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen('1357')
console.log('listening:1357')


/*app.use(function *(next){
 console.log(this.href)
 console.log(this.method)
 this.body={
 	success:true //作为json数据返回呈现在网页上
 }
 	yield next
 })*/