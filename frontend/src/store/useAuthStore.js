import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLogingIn: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check')
      set({ authUser: res.data })
    } catch (error) {
      set({ authUser: null })
      console.log('error in check auth')
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post('/auth/signup', data)
      set({ authUser: res.data })
      toast.success('Account created successfully')
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isSigningUp: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout')
      set({ authUser: null })
      toast.success('Logged out successfully🎉')
      get.dicconnectSocket()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },

  login: async (data) => {
    try {
      set({ isLogingIn: true })
      const res = await axiosInstance.post('/auth/login', data)
      set({ authUser: res.data })
      toast.success('login successful')
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isLogingIn: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout')
      set({ authUser: null })
      toast.success('Logged out successfully🎉')
      get.dicconnectSocket()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },
}))
