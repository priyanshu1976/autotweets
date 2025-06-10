import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'https://backend.autotweets.in/api',
  withCredentials: true,
})
