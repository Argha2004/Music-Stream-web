import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Tailwind v4 runs as a Vite plugin — there is no postcss.config.js and no
  // tailwind.config.js any more; theme tokens live in src/index.css (@theme).
  plugins: [react(), tailwindcss()],
  build: {
    // Split vendor chunks so the initial bundle stays small (perf: bundle-splitting).
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
          heroui: ['@heroui/react'],
        },
      },
    },
  },
})
