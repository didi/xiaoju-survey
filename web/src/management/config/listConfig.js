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
  createdAt: {
    title: '创建时间',
    key: 'createdAt',
    minWidth: 200
  }
}

export const groupListConfig = {
  name: {
    title: '分组名称',
    key: 'name',
    width: 200
  },
  surveyTotal: {
    title: '问卷数',
    key: 'surveyTotal',
    width: 150,
    tip: true
  },
  createdAt: {
    title: '创建时间',
    key: 'createdAt',
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
  updatedAt: {
    title: '更新时间',
    key: 'updatedAt',
    minWidth: 200
  },
  createdAt: {
    title: '创建时间',
    key: 'createdAt',
    minWidth: 200
  }
}

export const recycleBinFieldConfig = {
  title: {
    title: '标题',
    key: 'title',
    width: 240,
    tip: true
  },
  createdAt: {
    title: '创建时间',
    key: 'createdAt',
    minWidth: 200
  },
  deletedAt: {
    title: '删除时间',
    key: 'deletedAt',
    minWidth: 200
  },
  owner: {
    title: '所有者',
    key: 'owner',
    width: 140
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
  title: '没有满足该查询条件的团队空间',
  desc: '可以更换条件查询试试',
  img: '/imgs/icons/list-empty.webp'
}
export const noGroupDataConfig = {
  title: '您还没有创建问卷分组',
  desc: '赶快点击右上角立即创建问卷分组吧！',
  img: '/imgs/icons/list-empty.webp'
}
export const noGroupSearchDataConfig = {
  title: '没有满足该查询条件的问卷分组哦',
  desc: '可以更换条件查询试试',
  img: '/imgs/icons/list-empty.webp'
}
export const noSearchDataConfig = {
  title: '没有满足该查询条件的问卷',
  desc: '可以更换条件查询试试',
  img: '/imgs/icons/list-empty.webp'
}
export const noDownloadTaskConfig = {
  title: '没有下载任务',
  desc: '可以在数据分析进行下载',
  img: '/imgs/icons/list-empty.webp'
}

export const curStatus = {
  new: {
    value: 'new',
    label: '未发布'
  },
  published: {
    value: 'published',
    label: '已发布'
  },
  editing: {
    label: '修改中',
    value: 'editing'
  }
}

// 子状态
export const subStatus = {
  pausing: {
    label: '暂停中',
    value: 'pausing'
  }
}

export const statusMaps = {
  ...Object.fromEntries(Object.keys(curStatus).map((key) => [key, curStatus[key].label])),
  ...Object.fromEntries(Object.keys(subStatus).map((key) => [key, subStatus[key].label]))
}

export const curStatusKey = 'curStatus.status'
export const subStatusKey = 'subStatus.status'

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
    curStatus.new,
    curStatus.published,
    curStatus.editing,
    subStatus.pausing
  ],
  default: ''
}

export const selectOptionsDict = Object.freeze({
  surveyType: surveyTypeSelect,
  status: curStatusSelect
})

export const buttonOptionsDict = Object.freeze({
  updatedAt: {
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
  createdAt: {
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
