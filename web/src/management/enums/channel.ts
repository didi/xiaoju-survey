// 投放方式
export enum CHANNEL_TYPE {
	SHORT_LINK = 'shop_link',
	INJECT_WEB = "inject_web",
	INJECT_APP = "inject_app",
	INJECT_MP = "inject_mp",
}
export const CHANNEL_TYPE_ICON = {
  [CHANNEL_TYPE.SHORT_LINK]: 'icon-a-icon_SDK2',
  [CHANNEL_TYPE.INJECT_WEB]: "icon-icon_qianrushi",
  [CHANNEL_TYPE.INJECT_APP]: "icon-icon_SDK",
  [CHANNEL_TYPE.INJECT_MP]: "icon-icon_xiaochengxu",
}
export const CHANNEL_TYPE_TEXT = {
  [CHANNEL_TYPE.SHORT_LINK]: '短链接',
  [CHANNEL_TYPE.INJECT_WEB]: "Web嵌入问卷",
  [CHANNEL_TYPE.INJECT_APP]: "App嵌入问卷",
  [CHANNEL_TYPE.INJECT_MP]: "小程序嵌入问卷",
}
// 投放状态，因为关闭后还可以开启所以这里的关闭对应暂停操作
export enum CHANNEL_STATUS {
  RECYCLING = 'recycling',
  PAUSE = 'pause'
}

export const CHANNEL_STATUS_TEXT = {
  [CHANNEL_STATUS.RECYCLING]: '回收中',
  [CHANNEL_STATUS.PAUSE]: '已暂停'
}

export interface IDeliverDataItem {
  _id: String;
  name: String;
  type: CHANNEL_TYPE;
  status: CHANNEL_STATUS;
  ownerId: String;
  count: Number
}