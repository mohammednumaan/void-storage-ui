    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    // https://vitejs.dev/config/
    export default defineConfig({
      base: 'https://void-storage-frontend-bgr2qnilw-mohammednumaans-projects.vercel.app/',
      plugins: [react()],
    })
