# 镜像集成 - 完整版 (包含更多开发工具和调试能力)
FROM node:18 AS builder

WORKDIR /builder

# 复制文件到工作区间
COPY web/ /builder/web/
COPY server/ /builder/server/

RUN sed -i 's/deb.debian.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list.d/debian.sources && \
    npm config set registry https://registry.npmmirror.com && \
    cd /builder/web && npm install && npm run build-only && \
    cd /builder/server && npm install && npm run build


FROM node:18

# 设置工作区间
WORKDIR /xiaoju-survey

# 安装nginx和开发工具
RUN apt-get update && apt-get install -y nginx curl vim git && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 仅复制运行需要的文件到工作区间
COPY --from=builder /builder/web/dist/ /xiaoju-survey/web/dist/
COPY --from=builder /builder/server/dist/ /xiaoju-survey/server/dist/
COPY --from=builder /builder/server/node_modules/ /xiaoju-survey/server/node_modules/
COPY --from=builder /builder/server/public/ /xiaoju-survey/server/public/
COPY --from=builder /builder/server/package*.json /builder/server/.env* /xiaoju-survey/server/
COPY docker-run.sh /xiaoju-survey/docker-run.sh
# 覆盖nginx配置文件
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# 暴露端口 需要跟nginx的port一致
EXPOSE 8080

# docker入口文件,启动nginx和运行pm2启动,并保证监听不断
CMD ["sh","docker-run.sh"]
