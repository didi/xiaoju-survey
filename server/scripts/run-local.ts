import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'child_process';

async function startServerAndRunScript() {
  // 启动 MongoDB 内存服务器
  const mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();

  console.log('MongoDB Memory Server started:', mongoUri);

  // 通过 spawn 运行另一个脚本，并传递 MongoDB 连接 URL 作为环境变量
  const tsnode = spawn('cross-env', [`xiaojuSurveyMongoUrl="${mongoUri}"`, 'npx', 'ts-node-dev', './src/index.ts'])
  tsnode.stdout?.on('data', (data) => {
    console.log(data.toString());
  });

  tsnode.stderr?.on('data', (data) => {
    console.error(data);
  });

  tsnode.on('close', (code) => {
    console.log(`Nodemon process exited with code ${code}`);
    mongod.stop(); // 停止 MongoDB 内存服务器
  });
}

startServerAndRunScript().catch((err) => {
  console.error('Error starting server and script:', err);
});