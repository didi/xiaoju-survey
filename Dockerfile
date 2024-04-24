# 镜像集成
FROM node:16

# 设置工作区间
WORKDIR /xiaoju-survey

# 复制文件到工作区间
COPY . /xiaoju-survey

# 安装nginx
RUN apt-get update && \
    apt-get install -y nginx

RUN npm config set registry https://registry.npmjs.org/

# 安装项目依赖
RUN cd /xiaoju-survey/web && npm install && npm run build
# 用了后端服务代理启动，建议使用nginx启动
#RUN cd /xiaoju-survey && cp -af ./web/dist/* ./server/public/
# 覆盖nginx配置文件
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

RUN cd /xiaoju-survey/server && npm install && npm run build

# 暴露端口 需要跟server的port一致
# EXPOSE 3000
EXPOSE 8080


# docker入口文件,启动nginx和运行pm2启动,并保证监听不断
CMD ["sh","docker-run.sh"]
