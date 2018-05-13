/**
 * Created by chencz on 2017/3/26.
 */
 'use strict'
var Router=require('koa-router')//路由中间件，为不同的url地址分配不同的规则
var User=require('../app/controllers/user')
var App=require('../app/controllers/app')
var My=require('../app/controllers/my')
var Guide=require('../app/controllers/guide')

module.exports=function(){
    var router=new Router({
        prefix:'/api'
    })
    //hasBody和hasToken就是中间件，在中间件里面做检查后，在User.xx里面就不需要检查了
    //下面?个位于文件夹controllers下面
    //guide
    router.get('/guide/getFlag',Guide.getFlag)//获取该设备是否进入过引导页的标记的接口
    router.get('/guide/setFlag',Guide.setFlag)//设置该设备已进入过引导页的接口
    //user
    router.post('/login/getcode',App.hasBody,User.getcode)//获取验证码接口
    router.post('/login/submit',App.hasBody,User.submit)//登录提交接口
    router.get('/login/noLogin',User.noLogin)//随便看看接口
    //my
    router.get('/my/abstraData',App.hasToken,My.abstraData)//获取概要信息数据接口
    router.get('/my/listenData',App.hasToken,My.listenData)//获取精听记录数据接口
    router.post('/my/saveInfo',App.hasBody,App.hasToken,My.saveInfo)//保存用户信息接口，同时也是更新用户头像接口
    //app
    router.post('/signature',App.hasBody,App.hasToken,App.signature) //获取七牛签名的接口

    return router //返回到app.js里面
}