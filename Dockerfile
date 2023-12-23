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
RUN cd /xiaoju-survey/server && npm install

# 构建项目,并把产物推送到服务公共目录
RUN cd /xiaoju-survey/web && npm run build
RUN cd /xiaoju-survey && cp -af ./web/dist/* ./server/src/apps/ui/public/

RUN cd /xiaoju-survey/server && npm run copy && npm run build

# 暴露端口 需要跟server的port一致
EXPOSE 3000

# docker入口文件,运行pm2启动,并保证监听不断
CMD ["sh","docker-run.sh"]
