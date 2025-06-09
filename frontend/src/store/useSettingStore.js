import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

export const useSettingStore = create((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get('profile/setting')
      // console.log(response.data)
      set({ settings: response.data })
    } catch (error) {
      set({ error: error.message })
      toast.error('Failed to fetch settings')
    } finally {
      set({ isLoading: false })
    }
  },
}))
