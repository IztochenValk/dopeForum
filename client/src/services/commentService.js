import axios from 'axios';

const API_URL = '/api/comments';

export const fetchComments = async (threadId) => {
  const response = await axios.get(`${API_URL}/${threadId}`, { withCredentials: true });
  return response.data;
};

export const addComment = async (threadId, content) => {
  const response = await axios.post(`${API_URL}/${threadId}`, { content }, { withCredentials: true });
  return response.data;
};
