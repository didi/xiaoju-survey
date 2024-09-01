export enum RECORD_STATUS {
  NEW = 'new', // 新建 | 未发布
  PUBLISHED = 'published', // 发布
  CLOSE = 'close', // 关闭
}

export const enum RECORD_SUB_STATUS {
  DEFAULT = '', // 默认
  EDITING = 'editing', // 编辑
  PAUSING = 'pausing', // 暂停
  REMOVED = 'removed', // 删除
  FORCE_REMOVED = 'forceRemoved', // 从回收站删除
  FINISH = 'finish', // 结束
}

export enum HISTORY_TYPE {
  DAILY_HIS = 'dailyHis', //保存历史
  PUBLISH_HIS = 'publishHis', //发布历史
}
