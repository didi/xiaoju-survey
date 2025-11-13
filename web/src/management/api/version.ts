import axios from './base'

const baseURL = '/survey/version';

/**
 * 获取问卷的版本历史列表
 */
export const getVersionHistory = (surveyId) => {
  return axios.get(`${baseURL}/history/${surveyId}`);
};

/**
 * 获取特定版本的详细信息
 */
export const getVersionDetail = (versionId) => {
  return axios.get(`${baseURL}/detail/${versionId}`);
};

/**
 * 创建新版本
 */
export const createVersion = (surveyId, data) => {
  return axios.post(`${baseURL}/create/${surveyId}`, data);
};

/**
 * 恢复到指定版本
 */
export const restoreVersion = (surveyId, data) => {
  return axios.post(`${baseURL}/restore/${surveyId}`, data);
};

/**
 * 对比两个版本
 */
export const compareVersions = (surveyId, data) => {
  return axios.post(`${baseURL}/compare/${surveyId}`, data);
};

/**
 * 标记版本
 */
export const tagVersion = (surveyId, versionId, data) => {
  return axios.post(`${baseURL}/tag/${surveyId}/${versionId}`, data);
};

/**
 * 删除版本
 */
export const deleteVersion = (surveyId, versionId) => {
  return axios.post(`${baseURL}/delete/${surveyId}/${versionId}`);
};

/**
 * 获取版本统计信息
 */
export const getVersionStats = (surveyId) => {
  return axios.get(`${baseURL}/stats/${surveyId}`);
};
