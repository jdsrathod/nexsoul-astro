import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    // Base needs to be relative for some hosting environments, but '/' is standard for Vercel
    base: '/',
    define: {
      // This ensures process.env.API_KEY is replaced by the actual value during build
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY)
    }
  };
});