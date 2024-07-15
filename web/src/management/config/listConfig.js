export const type = {
  normal: '基础调查',
  vote: '投票评选',
  nps: 'NPS评分',
  register: '在线报名'
}

export const spaceListConfig = {
  name: {
    title: '空间名称',
    key: 'name',
    width: 200
  },
  surveyTotal: {
    title: '问卷数',
    key: 'surveyTotal',
    width: 150,
    tip: true
  },
  memberTotal: {
    title: '成员数',
    key: 'memberTotal',
    width: 150
  },
  owner: {
    title: '所有者',
    key: 'owner',
    width: 150
  },
  createDate: {
    title: '创建时间',
    key: 'createDate',
    minWidth: 200
  }
}

export const fieldConfig = {
  type: {
    title: '类型',
    key: 'type',
    width: 150,
    comp: 'TagModule'
  },
  title: {
    title: '标题',
    key: 'title',
    width: 240,
    tip: true
  },
  remark: {
    title: '备注',
    key: 'remark',
    width: 200,
    tip: true
  },
  state: {
    title: '状态',
    key: 'state',
    width: 140,
    comp: 'StateModule'
  },
  owner: {
    title: '所有者',
    key: 'owner',
    width: 140
  },
  updateDate: {
    title: '更新时间',
    key: 'curStatus.date',
    minWidth: 200
  },
  createDate: {
    title: '创建时间',
    key: 'createDate',
    minWidth: 200
  }
}

export const noListDataConfig = {
  title: '您还没有创建问卷',
  desc: '赶快点击右上角立即创建问卷吧！',
  img: '/imgs/icons/list-empty.webp'
}

export const noSpaceDataConfig = {
  title: '您还没有创建团队空间',
  desc: '赶快点击右上角立即创建团队空间吧！',
  img: '/imgs/icons/list-empty.webp'
}
export const noSpaceSearchDataConfig = {
  title: '没有满足该查询条件的团队空间哦',
  desc: '可以更换条件查询试试',
  img: '/imgs/icons/list-empty.webp'
}
export const noSearchDataConfig = {
  title: '没有满足该查询条件的问卷哦',
  desc: '可以更换条件查询试试',
  img: '/imgs/icons/list-empty.webp'
}

export const statusMaps = {
  new: '未发布',
  editing: '修改中',
  published: '已发布',
  removed: '',
  pausing: ''
}

// 问卷类型
export const surveyTypeSelect = {
  label: '问卷类型',
  value: [
    {
      value: '',
      label: '全部类型'
    },
    {
      value: 'normal',
      label: '基础调查'
    },
    // {
    //   value: 'exam',
    //   label: '在线考试'
    // },
    // {
    //   value: 'nps',
    //   label: 'NPS评分'
    // },
    {
      value: 'vote',
      label: '投票评选'
    },
    {
      value: 'register',
      label: '在线报名'
    }
  ],
  default: ''
}

// 问卷状态
export const curStatusSelect = {
  label: '问卷状态',
  value: [
    {
      value: '',
      label: '全部状态'
    },
    {
      value: 'new',
      label: '未发布'
    },
    {
      value: 'published',
      label: '已发布'
    },
    {
      value: 'editing',
      label: '修改中'
    }
  ],
  default: ''
}

export const selectOptionsDict = Object.freeze({
  surveyType: surveyTypeSelect,
  'curStatus.status': curStatusSelect
})

export const buttonOptionsDict = Object.freeze({
  'curStatus.date': {
    label: '更新时间',
    icons: [
      {
        name: 'el-icon-sort',
        effectValue: '',
        isDefaultValue: true,
        icon: 'sort'
      },
      {
        name: 'el-icon-sort-up',
        effectValue: 1,
        icon: 'sort-up'
      },
      {
        name: 'el-icon-sort-down',
        effectValue: -1,
        icon: 'sort-down'
      }
    ]
  },
  createDate: {
    label: '创建时间',
    icons: [
      {
        name: 'el-icon-sort',
        effectValue: '',
        icon: 'sort'
      },
      {
        name: 'el-icon-sort-up',
        effectValue: 1,
        icon: 'sort-up'
      },
      {
        name: 'el-icon-sort-down',
        effectValue: -1,
        isDefaultValue: true,
        icon: 'sort-down'
      }
    ]
  }
})
