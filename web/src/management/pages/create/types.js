import { joinPath } from '@/common/utils/path'

export const SURVEY_TYPE_LIST = [
  {
    type: 'normal',
    title: '基础调查',
    img: joinPath(import.meta.env.VITE_BASE, 'imgs/create/normal-icon.webp'),
    desc: '市场调研 / 用户分析 / 产品测评 / 需求调研'
  },
  // {
  //   type: 'nps',
  //   title: 'NPS评分',
  //   img: '/imgs/create/nps-icon.png',
  //   desc: '司机评分 / 服务评价 / 满意评价 / 推荐指数',
  // },
  {
    type: 'vote',
    title: '投票评选',
    img: joinPath(import.meta.env.VITE_BASE, 'imgs/create/vote-icon.webp'),
    desc: '才艺比赛 / 优秀员工 / 最佳人气 / 投票选举'
  },
  {
    type: 'register',
    title: '在线报名',
    img: joinPath(import.meta.env.VITE_BASE, 'imgs/create/register-icon.webp'),
    desc: '活动报名 / 会议报名'
  }
]
