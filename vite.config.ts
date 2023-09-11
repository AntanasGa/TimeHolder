import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('.css')) {
            return 'index';
          }
          if (id.includes('src/components/formFunctions')) {
            return 'formComponents';
          }
          if (id.includes('src/components/Icons')) {
            return 'icons';
          }
          if (id.includes('src/routes/Index.vue') || id.includes('src/routes/Task.vue')) {
            return 'pg-task';
          }
          if (id.includes('src/routes/entities/')) {
            return 'pg-entities';
          }
        }
      }
    }
  }
})
