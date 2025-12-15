import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(AIzaSyB89-8rjw3tX8wBVCwJ5COB2xCCM9I0MUc),
        'process.env.GEMINI_API_KEY': JSON.stringify(AIzaSyB89-8rjw3tX8wBVCwJ5COB2xCCM9I0MUc)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
