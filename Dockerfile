# 镜像集成
FROM node:18-slim

# 设置工作区间
WORKDIR /xiaoju-survey

# 复制文件到工作区间
COPY . /xiaoju-survey

# 安装nginx
RUN apt-get update && apt-get install -y nginx

RUN npm config set registry https://registry.npmjs.org/

# 安装项目依赖
RUN cd /xiaoju-survey/web && npm install && npm run build-only

# 覆盖nginx配置文件
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

RUN cd /xiaoju-survey/server && npm install && npm run build

# 暴露端口 需要跟nginx的port一致
EXPOSE 80

# docker入口文件,启动nginx和运行pm2启动,并保证监听不断
CMD ["sh","docker-run.sh"]
