/**
 * Created by chencz on 2017/4/11.
 */
'use strict'
var qiniu=require('qiniu')
var config=require('../../config/config')
var sha1=require('sha1') //hash算法库，加密数据用
var uuid=require('uuid') //生成唯一的ID
var Promise=require('bluebird')
//七牛上传方式
qiniu.conf.ACCESS_KEY = config.qiniu.AK;
qiniu.conf.SECRET_KEY = config.qiniu.SK;

exports.getQiniuToken=function(body){
    var type=body.type
    var key=uuid.v4()
    var putPolicy
    /*var options={
        persistentNotifyUrl:config.notify //?
    }*/
    if(type==='avatar'){
        //putPolicy.callbackUrl = 'http://your.domain.com/callback';
        //putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
        key+='.jpeg'
        putPolicy = new qiniu.rs.PutPolicy("gougouavatar:"+key);
    }else if(type==='mp3'){
        key+='.mp3'
        options.scope='gougouavatar:'+key
        options.persistentOps='avthumb/mp3/an/1'
        putPolicy=new qiniu.rs.PutPolicy2(options)
    }else if(type==='audio'){
        //audio实现
    }
    var token=putPolicy.token();
    return {
        token:token,
        key:key
    }
}

/*
exports.saveToQiniu=function(url,key){
    var client=new qiniu.rs.Client() //?
    return new Promise(function(resolve,reject){
        client.fetch(url,'gougouvideo',key,function(err,ret){
            if(!err){
                resolve(ret)
            }else{
                reject(err)
            }
        })
    })
}
exports.uploadToCloudinary=function(url){
    return new Promise(function(resolve,reject){
        cloudinary.uploader.upload(url,function(result){
            if(result && result.public_id){
                resolve(result)
            }else{
                reject(result)
            }
        },{
            resource_type:'video',
            folder:'video'
        })
    })
}*/
