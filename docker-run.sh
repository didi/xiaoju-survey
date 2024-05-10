#! /bin/bash 

# 启动nginx
nginx -g 'daemon on;'
# 启动后端服务
cd /xiaoju-survey/server
npm run start:prod