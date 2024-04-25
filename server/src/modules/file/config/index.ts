const SERVER_LOCAL_CONFIG = {
  LOCAL_STATIC_RENDER_TYPE: 'server', // nginx
  IS_PRIVATE_READ: false,
  FILE_KEY_PREFIX: 'userUpload', // 存储路径
  NEED_AUTH: true,
};

const QINIU_CONFIG = {
  FILE_STORAGE_PROVIDER: 'qiniu',
  IS_PRIVATE_READ: false,
  FILE_KEY_PREFIX: 'userUpload/{surveyPath}', // 文件key的前缀，会根据此处配置校验body的参数
  NEED_AUTH: true, // 是否需要登录
  LINK_EXPIRY_TIME: '2h',

  // minio、oss或者七牛云配置
  ACCESS_KEY: '', // your_access_key
  SECRET_KEY: '', // your_secret_key
  BUCKET: '', // your_bucket
  ENDPOINT: '', // endpoint
  USE_SSL: false, // useSSL
};

const ALI_OSS_CONFIG = {
  FILE_STORAGE_PROVIDER: 'ali-oss',
  IS_PRIVATE_READ: false,
  FILE_KEY_PREFIX: 'userUpload/{surveyPath}', // 文件key的前缀，会根据此处配置校验body的参数
  NEED_AUTH: true, // 是否需要登录
  LINK_EXPIRY_TIME: '2h',

  ACCESS_KEY: '', // your_access_key
  SECRET_KEY: '', // your_secret_key
  BUCKET: '', // your_bucket
  REGION: '',
  ENDPOINT: '', // endpoint
  USE_SSL: false, // useSSL
};

export const MINIO_CONFIG = {
  FILE_STORAGE_PROVIDER: 'minio',
  IS_PRIVATE_READ: false,
  FILE_KEY_PREFIX: 'userUpload/{surveyPath}', // 文件key的前缀，会根据此处配置校验body的参数
  NEED_AUTH: true, // 是否需要登录
  LINK_EXPIRY_TIME: '2h',

  ACCESS_KEY: '', // your_access_key
  SECRET_KEY: '', // your_secret_key
  BUCKET: '', // your_bucket
  REGION: '',
  ENDPOINT: '', // endpoint
  USE_SSL: true, // useSSL
};

export const channels = {
  upload: 'SERVER_LOCAL_CONFIG',
};

export const uploadConfig = {
  SERVER_LOCAL_CONFIG,
  QINIU_CONFIG,
  ALI_OSS_CONFIG,
  MINIO_CONFIG,
};
