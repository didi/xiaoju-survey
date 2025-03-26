import axios from 'axios';

const serverConfig: {
  host: string;
  port?: number;
  appId?: string;
  channelId?: string;
  appToken?: string;
} = {
  host: '',
  port: undefined,
};

export const setServerConfig = ({
  host,
  port,
  appId,
  channelId,
  appToken,
}: {
  host: string;
  port?: number;
  appId?: string;
  channelId?: string;
  appToken?: string;
}) => {
  serverConfig.host = host;
  serverConfig.port = port;
  serverConfig.appId = appId;
  serverConfig.channelId = channelId;
  serverConfig.appToken = appToken;
};

export const getServerConfig = () => {
  return serverConfig;
};

export interface IRequestConfig {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  params?: object;
  data?: any;
  headers?: object;
  useToken?: boolean;
}

axios.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (typeof data === 'object' && data.code !== 200) {
      const message = data.message || `业务错误：${data.code}`;
      return Promise.reject(new Error(message));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function request<T>(config: IRequestConfig) {
  const { host, port } = serverConfig;
  const { url, method, params, data, useToken = true } = config;
  if (!host) {
    throw Error('Base URL has not been set.');
  }
  const baseUrl = port ? `${host}:${port}` : host;
  const headers: any = {
    ...config.headers,
    'Content-Type': 'application/json',
  };
  if (useToken) {
    headers['x-app-id'] = serverConfig.appId;
    headers['x-app-token'] = serverConfig.appToken;
  }
  return axios.request<T>({
    baseURL: baseUrl,
    url,
    method,
    params,
    data,
    headers,
    timeout: 10000,
  });
}
