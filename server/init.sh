#!/bin/bash
npm install
for appDir in `ls src/apps`
do
    cd src/apps/$appDir
    # 进行安装依赖
    npm install
    cd ../../../
done
cd ..
