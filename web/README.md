## 环境
node版本推荐>=v16.15.0

## 项目启动
1、安装依赖
```
npm install
```
2、启动
```
npm run serve
```
3、访问问卷管理端
```bash
http://localhost:8080/management
```
会自动重定向到问卷列表页，也就是问卷管理端系统的首页
```bash
http://localhost:8080/management/survey
```
问卷管理端所有的页面都需要登陆，需要自行注册账号

4、访问问卷投放端
创建一份问卷并且编辑好之后，需要点击发布，发布后会跳转到问卷投放页面
投放页面能看到问卷的问卷投放端的链接，点击打开即可访问
或者如果你知道问卷配置的surveyPath字段，也可以通过下面的路径直接访问某张问卷
```bash
http://localhost:8080/render/:surveyPath
```

5、编译
执行下面的命令即可编译项目
```
npm run build
```
编译结果会产出两个html：management.html和render.html

6、部署和访问
前端的部署和访问依赖服务端
需要先将整个dist文件夹里面的内容移动到后端的静态文件夹下面
需要后端做一层代理：
当访问路径由/management开头的时候，读取management.html的内容返回
当访问路径由/render开头的时候，读取render.html的内容返回
此功能已经实现，做一个简单了解即可
