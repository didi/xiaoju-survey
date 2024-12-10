// 投放方式
// 投放方式
export enum DELIVER_TYPE {
	SHORT_LINK = 'shop_link',
	INJECT_WEB = "inject_web",
	INJECT_APP = "inject_app",
	INJECT_MP = "inject_mp",
}
export enum DELIVER_TYPE_TEXT {
	SHORT_LINK = '短链接',
	INJECT_WEB = "Web嵌入问卷",
	INJECT_APP = "App嵌入问卷",
	INJECT_MP = "小程序嵌入问卷",
}
// 投放状态，因为关闭后还可以开启所以这里的关闭对应暂停操作
export enum DELIVER_STATUS {
    RECYCLING = '回收中',
    PAUSE = '已暂停'
}

export interface IDeliverDataItem {
  _id: String;
  name: String;
  type: DELIVER_TYPE;
  status: DELIVER_STATUS;
  ownerId: String;
  count: Number
}