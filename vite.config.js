// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,  // change to your preferred port (not 3000)
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',   // ✅ ensures assets are served from root on Render
  plugins: [react()],
  server: {
    port: 5173, // used only for local dev
  }
})
