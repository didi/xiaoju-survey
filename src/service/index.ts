import { request, getServerConfig, setServerConfig } from '../utils/http';

import type {
  IResponse,
  SurveyChannelData,
  SurveySchemaData,
  SurveyRecoveryParams,
  SurveyRecoveryData,
} from '../models';

// 获取appToken
export const asyncGetAppToken = ({ appId }: { appId: string }) => {
  return request<IResponse<string>>({
    url: `/api/appManager/getToken`,
    method: 'post',
    data: {
      appId,
    },
    useToken: false,
  });
};

// 获取渠道状态
export const asyncGetChannelStatusApi = ({
  channelId,
}: {
  channelId: string;
}) => {
  return request<IResponse<SurveyChannelData>>({
    url: `/api/channel/find?channelId=${channelId}`,
    method: 'get',
  });
};

// 获取问卷配置
export const asyncGetSurveyConfigApi = ({
  activityId,
}: {
  activityId: string;
}) => {
  return request<IResponse<SurveySchemaData>>({
    url: `api/responseSchema/getSchema?surveyPath=${activityId}`,
    method: 'get',
  });
};

// 回收问卷
export const asyncSurveyRecoveryApi = (data: SurveyRecoveryParams) => {
  return request<IResponse<SurveyRecoveryData>>({
    url: `/api/surveyResponse/createResponseWithOpen`,
    method: 'post',
    data,
  });
};

// 获取问卷前置检查
export const asyncCheckSurveyValid = async (): Promise<{
  data?: SurveyChannelData;
  error?: Error;
}> => {
  const config = getServerConfig();
  try {
    const { appId = '', channelId = '', appToken } = config;
    if (!appToken) {
      // console.log('appToken: ', appToken);
      const { data: tokenResp } = await asyncGetAppToken({
        appId,
      });
      // console.log('tokenResp: ', tokenResp);
      if (tokenResp.data) {
        setServerConfig({ ...config, appToken: tokenResp.data });
      } else {
        return { error: new Error('get appToken faild') };
      }
    }
    const { data: channelResp } = await asyncGetChannelStatusApi({
      channelId,
    });
    // console.log('channelResp: ', channelResp);
    if (channelResp.data) {
      return { data: channelResp.data };
    } else {
      const errorMessage = channelResp.message || 'get channel status faild';
      return {
        error: new Error(errorMessage),
      };
    }
  } catch (error: any) {
    // console.error('asyncCheckSurveyValid error: ', error);
    return { error };
  }
};
