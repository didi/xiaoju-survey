export enum DOWNLOAD_TASK_STATUS {
  WAITING = 'waiting', // 排队中
  COMPUTING = 'computing', // 计算中
  SUCCEED = 'succeed', // 导出成功
  FAILED = 'failed', // 导出失败
}
