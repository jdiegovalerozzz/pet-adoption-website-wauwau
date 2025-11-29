import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      '/api': {
        target: 'https://pet-adoption-website-wauwau.onrender.com/',
        changeOrigin: true,
        secure: false,
      }
    },
  },
});
