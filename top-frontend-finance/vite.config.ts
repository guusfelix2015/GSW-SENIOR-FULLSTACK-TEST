import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'topFrontendFinance',
      filename: 'remoteEntry.js',
      exposes: {
        './FinanceList': './src/components/FinanceList.tsx',
        './FinanceForm': './src/components/FinanceForm.tsx',
        './FinanceDetail': './src/components/FinanceDetail.tsx',
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
    port: 5175,
    cors: true,
    fs: {
      allow: ['..'],
    },
    middlewareMode: false,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
