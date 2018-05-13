'use strict'
var xss=require('xss') //对用户输入内容进行过滤，避免XSS恶意攻击的模块
var mysql=require('../../db/user')
var sms=require('../service/sms')
var uuid=require('uuid') //生成唯一的不会重复的ID,用来生成accessToken

//获取验证码接口的实现
exports.getcode=function *(next){
	var phoneNumber=xss(this.request.body.phone);
    var verifyCode=sms.getCode(); //需要存到数据库里面以便后面登录验证时候用到
	var result;//存放执行查询后的结果
	console.log(verifyCode)
	try{
		result=yield mysql.query('SELECT phoneNumber FROM userschema.userlist');
		console.log(result)
			if(result.length==0){ //数据表里没有数据
				//执行插入默认数据的命令
				var accessToken=uuid.v4()
				console.log(accessToken)
				yield mysql.query("INSERT INTO userschema.userlist(phoneNumber,avatar,verifycode,verified,accessToken,district,nickname,sex,createAt,updateAt,briefIntro) VALUES('"+phoneNumber+"','http://dummyimage.com/80x80/c2f1dc)','"+verifyCode+"',0,'"+accessToken+"','','好好学习',0,now(),now(),'')");
				this.body={
					success:true,
					verifycode:verifyCode
				}
			}else{ //数据表里有数据
				for(var i=0;i<result.length;i++){
					if(result[i].phoneNumber==phoneNumber){ //数据表里找到对应的phoneNumber
						console.log("找到啦!")
						yield mysql.query("UPDATE userschema.userlist SET verifycode='"+verifyCode+"',updateAt=now() WHERE phoneNumber='"+phoneNumber+"'");
						this.body={
							success:true,
							verifycode:verifyCode
						}
						return 
					}
				}
				//找不到对应的phoneNumber，执行插入默认数据的命令
				var accessToken=uuid.v4()
				console.log(accessToken)
				yield mysql.query("INSERT INTO userschema.userlist(phoneNumber,avatar,verifycode,verified,accessToken,district,nickname,sex,createAt,updateAt,briefIntro) VALUES('"+phoneNumber+"','http://dummyimage.com/80x80/c2f1dc)','"+verifyCode+"',0,'"+accessToken+"','','好好学习',0,now(),now(),'')");
				this.body={
					success:true,
					verifycode:verifyCode
				}
			}		 
	}catch(e){
		console.log(e)
        this.body={
            success:false,
			msg:"获取验证码失败！"
        }
        return
	}
}
//登录提交接口的实现
exports.submit=function *(next){
	var phoneNumber=xss(this.request.body.phone);
	var verifyCode=xss(this.request.body.verifycode);
	var result;//存放执行查询后的结果
	var infoData;//存放执行查询后返回的具体用户信息数据
	try{
		result=yield mysql.query("SELECT phoneNumber,verifycode FROM userschema.userlist WHERE phoneNumber='"+phoneNumber+"'");
		console.log(result)
		if(result.length==0){
			this.body={
				success:false,
				msg:"没有该用户信息！"
			}
		}else{
			if(result.length==1){
				console.log(result[0].phoneNumber)
				console.log(result[0].phoneNumber==phoneNumber&&result[0].verifycode==verifyCode)
				if(result[0].phoneNumber==phoneNumber&&result[0].verifycode==verifyCode){ //数据表里找到对应的phoneNumber和verifycode
					console.log("号码和验证码都正确！")
					yield mysql.query("UPDATE userschema.userlist SET verified=1 WHERE phoneNumber='"+phoneNumber+"'");
					console.log("验证完成！")
					infoData=yield mysql.query("SELECT * FROM userschema.userlist WHERE phoneNumber='"+phoneNumber+"'");
					//返回前台的数据
					this.body={
						success:true,
						data:{
							phoneNumber:infoData[0].phoneNumber,
							avatar:infoData[0].avatar,
							briefIntro:infoData[0].briefIntro,
							district:infoData[0].district,
							accessToken:infoData[0].accessToken,
							nickname:infoData[0].nickname,
							sex:infoData[0].sex
						}
					}
					return
				}else{
					this.body={
						success:false,
						msg:"验证错误！"
					}
					return
				}
			}else{
				this.body={
					success:false,
					msg:"有重复号码出现！请检查数据库"
				}
				return
			}
			//找不到对应的phoneNumber
			this.body={
				success:false,
				msg:"没找到这个电话号码哦~"
			}
		}		
	}catch(e){
		console.log(e)
        this.body={
            success:false,
            msg:"登录失败"
        }
        return
	}
}
//随便看看接口的实现
exports.noLogin=function *(next){
	var infoData;//存放执行查询后返回的具体用户信息数据
	var atAbstra;//存放myabstra表中找到的用户标识
	var atListen;//存放mylisten表中找到的用户标识
	try{
		var phoneNumber=sms.getPhone();
		var accessToken=uuid.v4()
		yield mysql.query("INSERT INTO userschema.userlist(phoneNumber,avatar,verifycode,verified,accessToken,district,nickname,sex,createAt,updateAt,briefIntro) VALUES('"+phoneNumber+"','http://dummyimage.com/80x80/a8988f)','',0,'"+accessToken+"','','好好学习',0,now(),now(),'')");
		infoData=yield mysql.query("SELECT * FROM userschema.userlist WHERE phoneNumber='"+phoneNumber+"'");
		this.body={
			success:true,
			data:{
				phoneNumber:infoData[0].phoneNumber,
				avatar:infoData[0].avatar,
				briefIntro:infoData[0].briefIntro,
				district:infoData[0].district,
				accessToken:infoData[0].accessToken,
				nickname:infoData[0].nickname,
				sex:infoData[0].sex
			}
		}
	}catch(e){
		console.log(e)
        this.body={
            success:false,
            msg:"进入失败"
        }
        return
	}
}