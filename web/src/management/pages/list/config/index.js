export const type = {
  normal: '调查问卷',
  vote: '投票评选',
  nps: 'NPS评分',
  register: '在线报名',
};

export const thead = {
  type: '类型',
  title: '标题',
  remark: '备注',
  state: '状态',
  owner: '所有者',
  creator: '创建人',
  tags: '标签',
  updateDate: '更新时间',
  createDate: '创建时间',
  collectCount: '回收数',
};

export const fieldConfig = {
  type: {
    key: 'type',
    width: 150,
    comp: 'tag',
  },
  title: {
    key: 'title',
    width: 240,
    tip: true,
  },
  remark: {
    key: 'remark',
    width: 200,
    tip: true,
  },
  state: {
    key: 'state',
    width: 140,
    comp: 'state',
  },
  creator: {
    key: 'creator',
    width: 140,
  },
  updateDate: {
    key: 'updateDate',
    minWidth: 200,
  },
  createDate: {
    key: 'createDate',
    minWidth: 200,
  },
};

export const noListDataConfig = {
  title: '您还没有创建问卷',
  desc: '赶快点击右上角立即创建问卷吧！',
  img: '/imgs/icons/list-empty.png',
};

export const noSearchDataConfig = {
  title: '没有满足该查询条件的问卷哦',
  desc: '可以更换条件查询试试',
  img: '/imgs/icons/list-empty.png',
};

export const statusMaps = {
  new: '未发布',
  editing: '修改中',
  published: '已发布',
  removed: '',
  pausing: '',
};
