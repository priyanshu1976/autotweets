import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'http://backend.autotweets.in/api',
  withCredentials: true,
})
