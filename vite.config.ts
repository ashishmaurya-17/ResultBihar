import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,         // Platform container proxy bypass karne ke liye
    port: 3000,         // Locked port to conform to infrastructure and enable external routing
    strictPort: true,   // Ensure Vite always uses this port
    allowedHosts: true, // Fatal sharing errors aur cross-origin block hatane ke liye
    cors: true,
    hmr: {
      // Force secure websocket connection through the cloud proxy
      protocol: 'wss',
      clientPort: 443,
      // Prevent the Vite HMR overlay from crashing the entire React UI if connection drops
      overlay: false
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
});
