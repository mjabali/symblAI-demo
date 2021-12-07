import axios from 'axios';

let API_URL = process.env.REACT_APP_API_URL_DEVELOPMENT;
if (process.env.NODE_ENV === 'production') {
  API_URL = `${process.env.REACT_APP_API_URL_PRODUCTION}`;
}

export const getSentimentAPI = async (conversationId, token) => {
  return axios.get(
    `https://api.symbl.ai/v1/conversations/${conversationId}/messages?sentiment=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `application/json`,
      },
    }
  );
};
