# 镜像集成
FROM ubuntu:latest

# 安装依赖
RUN apt-get -y update  
RUN apt-get -y install wget gcc

# 安装node环境
ENV NODE_VERSION v18.17.1
RUN mkdir -p /node/$NODE_VERSION
RUN wget https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-x64.tar.gz
RUN tar xzf node-$NODE_VERSION-linux-x64.tar.gz -C /node/
ENV PATH  /node/node-$NODE_VERSION-linux-x64/bin:$PATH

# 设置工作区间
WORKDIR /xiaoju-survey

# 复制文件到工作区间
COPY . /xiaoju-survey

RUN npm config set registry https://registry.npmjs.org/

# 安装项目依赖
RUN cd /xiaoju-survey/web && npm install
RUN cd /xiaoju-survey/server && sh init.sh

# 构建项目,并把产物推送到服务公共目录
RUN cd /xiaoju-survey/web && npm run build
RUN cd /xiaoju-survey && cp -af ./web/dist/ ./server/src/apps/ui/public/

# 暴露端口
EXPOSE 8080

# docker入口文件,运行pm2启动,并保证监听不断
CMD ["sh","docker-run.sh"]
# 构建镜像
# docker build -t xiaoju-survey-app .
# 运行容器
# docker run --rm --name running-xiaoju-survey-app -p 8080:8080 xiaoju-survey-app
# 进入容器
# docker exec -it running-xiaoju-survey-app bash
# 停止容器
# docker stop running-xiaoju-survey-app
# 查看日志
# docker logs running-xiaoju-survey-app