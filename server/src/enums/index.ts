// 状态类型
export enum RECORD_STATUS {
  NEW = 'new', // 新建
  EDITING = 'editing', // 编辑
  PAUSING = 'pausing', // 暂停
  PUBLISHED = 'published', // 发布
  REMOVED = 'removed', // 删除
  FORCE_REMOVED = 'forceRemoved', // 从回收站删除
  COMPUTING = 'computing', // 计算中
  FINISHED = 'finished', // 已完成
  ERROR = 'error', // 错误
}

// 历史类型
export enum HISTORY_TYPE {
  DAILY_HIS = 'dailyHis', //保存历史
  PUBLISH_HIS = 'publishHis', //发布历史
}
