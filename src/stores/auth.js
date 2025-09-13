import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessKey: localStorage.getItem('accessKey') || null
  }),
  actions: {
    setAccessKey(key) {
      this.accessKey = key
      localStorage.setItem('accessKey', key) // persist in browser
    },
    clearAccessKey() {
      this.accessKey = null
      localStorage.removeItem('accessKey')
    },
    isLoggedIn() {
      return !!this.accessKey
    }
  }
})
