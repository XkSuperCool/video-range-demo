import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/test': {
        target: 'http://localhost:4000',
        rewrite(path) {
          return path.replace(/^\/test/, '')
        },
      },
    },
  },
})
