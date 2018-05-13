'use strict'
var mysql=require('../../db/user')

//获取该设备是否进入过引导页的标记接口的实现
exports.getFlag=function *(next){
	var ip=this.query.ip;//query表示从参数串上获取ip
	var result;
	var infoData;
	try{
		result=yield mysql.query("SELECT * FROM userschema.guideList WHERE ip='"+ip+"'");
		console.log("result.length:"+result.length)
		if(result.length==0){ //数据表里没有这条数据
			//执行插入数据命令
			yield mysql.query("INSERT INTO userschema.guideList(ip,flag,createAt,updateAt,image1,image2,image3) VALUES('"+ip+"',0,now(),now(),'http://dummyimage.com/375x667/f8036b)','http://dummyimage.com/375x667/03e010)','http://dummyimage.com/375x667/b4321e)')");
		}
		infoData=yield mysql.query("SELECT * FROM userschema.guideList WHERE ip='"+ip+"'");
		this.body={
			success:true,
			flag:infoData[0].flag,
			data:[
				{
					'image':infoData[0].image1
				},
				{
					'image':infoData[0].image2
				},
				{
					'image':infoData[0].image3
				}
			]
		}
	}catch(e){
		console.log(e)
        this.body={
            success:false,
            msg:"获取标记失败"
        }
        return
	}
}
//设置该设备已进入过引导页接口的实现
exports.setFlag=function *(next){
	var ip=this.query.ip;//query表示从参数串上获取ip
	var result;
	var infoData;
	try{
		result=yield mysql.query("SELECT * FROM userschema.guideList WHERE ip='"+ip+"'");
		console.log("result.length:"+result.length)
		if(result.length==0){ //数据表里没有这条数据
			this.body={
				success:false,
				msg:"没找到该标记，数据库数据有误！"
			}
			return
		}
		yield mysql.query("UPDATE userschema.guideList SET flag=1,updateAt=now() WHERE ip='"+ip+"'");
		infoData=yield mysql.query("SELECT * FROM userschema.guideList WHERE ip='"+ip+"'");
		this.body={
			success:true,
			flag:infoData[0].flag
		}
	}catch(e){
		console.log(e)
		this.body={
			success:false,
			msg:"设置标记失败"
		}
		return
	}
}