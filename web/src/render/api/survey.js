import axios from './base';

export const getPublishedSurveyInfo = ({ surveyPath }) => {
  return axios.get('/surveyPublish/getSurveyPublish', {
    params: {
      surveyPath,
    },
  });
};

export const submitForm = (data) => {
  return axios.post('/surveyPublish/submit', data);
};

export const queryVote = ({ surveyPath, voteKeyList }) => {
  return axios.get('/surveyPublish/queryVote', {
    params: {
      surveyPath,
      voteKeyList,
    },
  });
};

export const getEncryptInfo = () => {
  return axios.get('/surveyPublish/getEncryptInfo');
};
