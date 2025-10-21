import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'top-frontend',
      filename: 'remoteEntry.js',
      remotes: {
        topFrontendUsers: 'http://localhost:5174/assets/remoteEntry.js',
        topFrontendFinance: 'http://localhost:5175/assets/remoteEntry.js',
      },
      exposes: {
        './Layout': './src/components/Layout.tsx',
        './useApi': './src/hooks/useApi.ts',
      },
      shared: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        '@mui/material',
        '@emotion/react',
        '@emotion/styled',
        '@tanstack/react-query',
        '@tanstack/react-query-devtools',
      ],
    }),
  ],
  server: {
    port: 5173,
    cors: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
