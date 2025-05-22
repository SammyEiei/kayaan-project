import axios from 'axios';


const API = 'http://localhost:8080/api/auth';

export const login = async (payload) => {
  return axios.post(`${API}/login`, payload);
};

export const register = async (payload) => {
  return axios.post(`${API}/register`, payload);
};
