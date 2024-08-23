export default [
  {
    label: '顶部图片地址',
    type: 'InputSetter',
    key: 'bgImage',
    labelStyle: { width: '120px' }
  },
  {
    label: '顶部视频地址',
    type: 'InputSetter',
    key: 'videoLink',
    labelStyle: { width: '120px' }
  },
  {
    label: '视频海报地址',
    type: 'InputSetter',
    key: 'postImg',
    labelStyle: { width: '120px' }
  },
  {
    label: '图片支持点击',
    type: 'CustomedSwitch',
    labelStyle: { width: '120px' },
    key: 'bgImageAllowJump'
  },
  {
    label: '跳转链接',
    type: 'InputSetter',
    labelStyle: { width: '120px' },
    key: 'bgImageJumpLink',
    relyFunc: (data) => {
      return !!data?.bgImageAllowJump
    }
  }
]
