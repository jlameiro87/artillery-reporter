import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ReactCompilerConfig = { /* ... */ };

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [
        ["babel-plugin-react-compiler", ReactCompilerConfig],
      ],
    }
  })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendors': ['react', 'react-dom'],
          'mui-vendors': ['@mui/material', '@mui/icons-material'],
          'recharts-vendors': ['recharts'],
          // add more as needed
        }
      }
    },
    chunkSizeWarningLimit: 700 // increase warning threshold (optional)
  }
})
