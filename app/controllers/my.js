'use strict'
var mysql=require('../../db/user')
var xss=require('xss') //对用户输入内容进行过滤，避免XSS恶意攻击的模块
//获取概要信息数据接口的实现
exports.abstraData=function *(next){
	var accessToken=this.session.user[0].accessToken;
	var atAbstra;//存放myabstra表中找到的用户标识
	var result;//存放执行查询后的结果
	var data={
		listenTime:null,
		vocab:null
	}
	try{
		//在myabstra表中找到相应的accessToken或者插入accessToken
		atAbstra=yield mysql.query("SELECT * FROM userschema.myabstra WHERE accessToken='"+accessToken+"'")
		console.log("atAbstra:"+atAbstra)
		console.log("atAbstra.length:"+atAbstra.length)
		if(atAbstra.length==0){
			yield mysql.query("INSERT INTO userschema.myabstra(accessToken,listenTime,vocab,createAt,updateAt) VALUES('"+accessToken+"',0,0,now(),now())");
			console.log("已添加一条概要信息数据")
			result=yield mysql.query("SELECT * FROM userschema.myabstra WHERE accessToken='"+accessToken+"'")
			console.log("result "+result)
			data.listenTime = result[0].listenTime;
			data.vocab = result[0].vocab;
		}else{
			if(atAbstra.length==1){
				data.listenTime = atAbstra[0].listenTime;
				data.vocab = atAbstra[0].vocab;
			}else{
				yield mysql.query("INSERT INTO userschema.myabstra(accessToken,listenTime,vocab,createAt,updateAt) VALUES('"+accessToken+"',0,0,now(),now())");
				console.log("已添加一条概要信息数据");
				result=yield mysql.query("SELECT * FROM userschema.myabstra WHERE accessToken='"+accessToken+"'")
				console.log("result "+result)
				data.listenTime = result[0].listenTime;
				data.vocab = result[0].vocab;
			}
		}
		this.body = {
			success: true,
			data: data
		}
		return
	}catch(e){
		console.log(e)
        this.body={
            success:false,
            msg:"获取概要信息数据失败"
        }
        return
	}
}
//获取精听记录数据接口的实现
exports.listenData=function *(next){
	var result;//存放执行查询后的结果
	var accessToken=this.session.user[0].accessToken;
	var atListen;//存放mylisten表中找到的用户标识
	var data=new Array();//存放返回前端的数据
	try{
		//在mylisten表中找到相应的accessToken或者插入accessToken
		atListen=yield mysql.query("SELECT * FROM userschema.mylisten WHERE accessToken='"+accessToken+"'")
		console.log("atListen:"+atListen)
		console.log("atListen.length:"+atListen.length)
		if(atListen.length==0){
			data[0]={ //初始化data
				finishTime:null,
				vocab:null,
				image:null,
				title:null
			}
			yield mysql.query("INSERT INTO userschema.mylisten(accessToken,finishTime,image,title,vocab,createAt,updateAt) VALUES('"+accessToken+"',0,'http://dummyimage.com/80x80/c2f1dc)','示例',0,now(),now())");
			console.log("已添加一条精听记录数据")
			result=yield mysql.query("SELECT * FROM userschema.mylisten WHERE accessToken='"+accessToken+"'");
			console.log("result "+result)
			data[0].finishTime = result[0].finishTime;
			data[0].vocab = result[0].vocab;
			data[0].image = result[0].image;
			data[0].title = result[0].title;
		}else{
			if(atListen.length>=1){
				for(var i=0;i<atListen.length;i++){
					data[i]={  //初始化data
						finishTime:null,
						vocab:null,
						image:null,
						title:null
					}
					data[i].finishTime = atListen[i].finishTime;
					data[i].vocab = atListen[i].vocab;
					data[i].image = atListen[i].image;
					data[i].title = atListen[i].title;
				}
			}else{
				data[0]={  //初始化data
					finishTime:null,
					vocab:null,
					image:null,
					title:null
				}
				yield mysql.query("INSERT INTO userschema.mylisten(accessToken,finishTime,image,title,vocab,createAt,updateAt) VALUES('"+accessToken+"',0,'http://dummyimage.com/80x80/c2f1dc)','示例',0,now(),now())");
				console.log("已添加一条精听记录数据")
				result=yield mysql.query("SELECT * FROM userschema.mylisten WHERE accessToken='"+accessToken+"'");
				console.log("result "+result)
				data[0].finishTime = result[0].finishTime;
				data[0].vocab = result[0].vocab;
				data[0].image = result[0].image;
				data[0].title = result[0].title;
			}
		}
		this.body = {
			success: true,
			data: data,
			total:data.length
		}
		return
	}catch(e){
		console.log(e)
		this.body={
			success:false,
			msg:"获取精听记录数据失败"
		}
		return
	}
}
//保存用户信息接口的实现
exports.saveInfo=function *(next){
	var phoneNumber=xss(this.request.body.phone);
	var avatar=xss(this.request.body.avatar);
	var briefIntro=xss(this.request.body.briefIntro);
	var district=xss(this.request.body.district);
	var nickname=xss(this.request.body.nickname);
	var sex=this.request.body.sex;

	var result;//存放执行查询后的结果
	var accessToken=this.session.user[0].accessToken;
	var infoData=new Array();//存放返回前端的数据
	try{
		//在userlist表中找到相应的accessToken或者插入accessToken
		result=yield mysql.query("SELECT * FROM userschema.userlist WHERE accessToken='"+accessToken+"'")
		console.log("result:"+result)
		console.log("result.length:"+result.length)
		if(result.length==0){
			this.body={
				success:false,
				msg:"没有该用户信息！"
			}
			return
		}else{
			if(result.length==1){
					console.log("找到该用户信息，开始更新！")
					console.log(sex)
					console.log("UPDATE userschema.userlist SET phoneNumber='"+phoneNumber+"',avatar='"+avatar+"',briefIntro='"+briefIntro+"',district='"+district+"',nickname='"+nickname+"',sex="+sex+" WHERE accessToken='"+accessToken+"'")
					yield mysql.query("UPDATE userschema.userlist SET phoneNumber='"+phoneNumber+"',avatar='"+avatar+"',briefIntro='"+briefIntro+"',district='"+district+"',nickname='"+nickname+"',sex="+sex+" WHERE accessToken='"+accessToken+"'");
					console.log("更新完成")
					infoData=yield mysql.query("SELECT * FROM userschema.userlist WHERE accessToken='"+accessToken+"'");
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
					msg:"有重复accessToken出现！请检查数据库"
				}
				return
			}
			//找不到对应的accessToken
			this.body={
				success:false,
				msg:"没找到这个accessToken哦~"
			}
		}
	}catch(e){
		console.log(e)
		this.body={
			success:false,
			msg:"更新用户信息失败"
		}
		return
	}
}
