export default [
  {
    label: '头图配置（默认尺寸：750*260）',
    type: 'Customed',
    key: 'bannerConfig',
    labelStyle: {
      fontWeight: 'bold',
    },
    content: [
      {
        label: '顶部图片地址',
        type: 'Input',
        key: 'bannerConfig.bgImage',
        direction: 'horizon',
      },
      {
        label: '顶部视频地址',
        type: 'Input',
        key: 'bannerConfig.videoLink',
        direction: 'horizon',
      },
      {
        label: '视频海报地址',
        type: 'Input',
        key: 'bannerConfig.posterImg',
        direction: 'horizon',
      },
    ],
  },
  {
    label: '头图跳转',
    type: 'Customed',
    key: 'bannerConfig-Jump',
    labelStyle: {
      fontWeight: 'bold',
    },
    content: [
      {
        label: '图片支持点击',
        type: 'CustomedSwitch',
        direction: 'space_between',
        key: 'bannerConfig.bgImageAllowJump',
      },
      {
        label: '跳转链接',
        type: 'Input',
        direction: 'horizon',
        key: 'bannerConfig.bgImageJumpLink',
        relyFunc: (data) => {
          return !!data?.bannerConfig?.bgImageAllowJump;
        },
      },
    ],
  },
];
