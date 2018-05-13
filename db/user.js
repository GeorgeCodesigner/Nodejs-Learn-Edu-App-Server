'use strict'
var mysql=require('mysql');
var wrapper = require('co-mysql');
var co=require('co');
var options={
	host:'127.0.0.1',
	user:'root',
	password:'ma721111',
	database:'userschema',
	port:3306
};
var pool = mysql.createPool(options);
var userdb=wrapper(pool);
// //给userdb赋值一个叫query的方法,该方法接受两个参数，第一个参数是你查询数据时候的sql语句，第二个参数是获取查询结果的回调函数
// userdb.query=function sqlback(sqllan,fn){
// 	//设置操作mysql的配置,其赋予的值connection是我们接下来操作mysql的一个具体的对象
// 	var connection=mysql.createConnection({
// 		host:'localhost',
// 		user:'root',
// 		password:'1ba,2ma,3me,4mm.',
// 		database:'userschema',
// 		port:3306
// 	});
// 	//connect方法判断连接是否成功
// 	connection.connect(function(err){
// 		if(err){
// 			console.log(err);
// 			return
// 		}
// 	});
// 	var sql=sqllan;
// 	if(!sql) return
// 	/*query方法来直接向数据库发送sql语句，并且用回调函数返回结果。其中回调函数中有三个参数:
//        第一参数是错误对象，如果操作失败，则会停止并打印错误信息;
//        第二参数是具体的返回的结果，正常情况下是一个数组，里面包含很多json;
//        第三个参数也是一个数组，里面包含着最每个数据的解释，比如当前数据属于哪个库，那张表等等

// 	*/
// 	connection.query(sql,function(err,row,fields){
// 		if(err){
// 			console.log(err);
// 			return 
// 		}
// 		fn(row);
// 	});
// 	connection.end(function(err){
// 		if(err){
// 			console.log(err);
// 			return 
// 		}else{
// 			console.log("连接关闭")
// 		}
// 	});
// }
module.exports=userdb;