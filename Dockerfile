# 镜像集成
FROM node:16

# 设置工作区间
WORKDIR /xiaoju-survey

# 复制文件到工作区间
COPY . /xiaoju-survey

RUN npm config set registry https://registry.npmjs.org/

# 安装项目依赖
RUN cd /xiaoju-survey/web && npm install && npm run build
# 用了后端服务代理启动，建议使用nginx启动
RUN cd /xiaoju-survey && cp -af ./web/dist/* ./server/public/

RUN cd /xiaoju-survey/server && npm install && npm run build

# 暴露端口 需要跟server的port一致
EXPOSE 3000

# docker入口文件,运行pm2启动,并保证监听不断
CMD ["sh","docker-run.sh"]
