import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'topFrontendUsers',
      filename: 'remoteEntry.js',
      exposes: {
        './UserList': './src/components/UserList.tsx',
        './UserForm': './src/components/UserForm.tsx',
        './UserDetail': './src/components/UserDetail.tsx',
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
    port: 5174,
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
