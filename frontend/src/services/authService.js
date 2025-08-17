import axiosClient from '../api/axiosClient';

export const loginUser = async (email, password) => {
  return await axiosClient.post('/users/login', { email, password });
};
