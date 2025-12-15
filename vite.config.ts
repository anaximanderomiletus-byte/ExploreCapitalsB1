import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// NOTE: Since this is a static site (GitHub Pages), the key must be bundled.
// Ensure you have restricted this key to 'explorecapitals.com' in Google Cloud Console.
const API_KEY = "AIzaSyB89-8rjw3tX8wBVCwJ5COB2xCCM9I0MUc"; 

export default defineConfig({
  base: './', // Required for custom domains on GitHub Pages
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  define: {
    // This injects the key into the app wherever 'process.env.API_KEY' is used
    'process.env.API_KEY': JSON.stringify(API_KEY),
    'process.env.GEMINI_API_KEY': JSON.stringify(API_KEY)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
