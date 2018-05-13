# Nodejs-Learn-Edu-App-Server
Ionic1-Learn-Edu-App的后台项目：基于nodejs的koa框架开发的App后台
# 项目简介
该后台项目是Ionic1-Learn-Edu-App的本地后台项目，Ionic1-Learn-Edu-App的GitHub地址：https://github.com/GeorgeCodesigner/Ionic1-Learn-Edu-App
主要实现的接口有(由于时间关系，只实现了部分接口)：
1. 获取该设备是否进入过App引导页的标记的接口
2. 设置该设备已进入过App引导页的接口
3. App登录页面获取验证码接口
4. App登录页面登录提交接口
5. App登录页面随便看看接口
6. App"我的"页面获取概要信息数据接口
7. App"我的"页面获取精听记录数据接口
8. App"我的"页面保存用户信息接口，同时也是更新用户头像接口
# 技术栈
nodejs+koa+mysql
# 运行
1. 把项目clone到本地：git clone https://github.com/GeorgeCodesigner/Nodejs-Learn-Edu-App-Server.git
2. 确保已经安装了nodejs，版本至少6.2.0以上。
3. 打开终端，cd到该项目的根目录下，执行npm install安装依赖包。
4. 依赖包安装好后，运行node app，可以在本地跑起这个项目，同时还应该启动MySQL服务。App端调用接口打印的信息会在该终端里看到。
# 其他注意事项
1. db/user.js文件：mysql服务配置文件


