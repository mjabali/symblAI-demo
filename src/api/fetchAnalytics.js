import axios from 'axios';

export const getAnalytics = async (conversationId, token) => {
    return axios.get(
        `https://api.symbl.ai/v1/conversations/${conversationId}/analytics`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': `application/json`,
            },
        }
    );
};
