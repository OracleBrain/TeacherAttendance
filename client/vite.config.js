import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Custom plugin for SPA history fallback
function historyFallback() {
  return {
    name: 'vite-plugin-history-fallback',
    configureServer(server) {
      // Return index.html when requesting paths that don't exist as files
      return () => {
        server.middlewares.use((req, res, next) => {
          const { url } = req;
          
          // Skip assets
          if (url.includes('.')) {
            return next();
          }
          
          // Handle all other routes by rewriting to /
          req.url = '/';
          next();
        });
      };
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    historyFallback(), // Add the history fallback plugin
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    port: 5000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
    },
    // Important for client-side routing
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /^\/.*/, to: '/index.html' }
      ]
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'wouter'],
  },
  // This is a crucial setting for SPA with client-side routing
  // It ensures that all routes are handled by index.html
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  // We need this for wouter to work properly on refresh
  base: '/',
})