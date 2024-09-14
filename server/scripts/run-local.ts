import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'child_process';
// import { RedisMemoryServer } from 'redis-memory-server';

async function startServerAndRunScript() {
  // 启动 MongoDB 内存服务器
  const mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();

  console.log('MongoDB Memory Server started:', mongoUri);

  // const redisServer = new RedisMemoryServer();
  // const redisHost = await redisServer.getHost();
  // const redisPort = await redisServer.getPort();

  // 通过 spawn 运行另一个脚本，并传递 MongoDB 连接 URL 作为环境变量
  const tsnode = spawn(
    'cross-env',
    [
      `XIAOJU_SURVEY_MONGO_URL=${mongoUri}`,
      // `XIAOJU_SURVEY_REDIS_HOST=${redisHost}`,
      // `XIAOJU_SURVEY_REDIS_PORT=${redisPort}`,
      'NODE_ENV=development',
      'SERVER_ENV=local',
      'npm',
      'run',
      'start:dev',
    ],
    {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    },
  );
  tsnode.stdout?.on('data', (data) => {
    console.log(data.toString());
  });

  tsnode.stderr?.on('data', (data) => {
    console.error(data);
  });

  tsnode.on('close', async (code) => {
    console.log(`Nodemon process exited with code ${code}`);
    await mongod.stop(); // 停止 MongoDB 内存服务器
    // await redisServer.stop();
  });
}

startServerAndRunScript().catch((err) => {
  console.error('Error starting server and script:', err);
});
