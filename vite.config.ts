import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // When building for GitHub Pages, set base to the repo name so assets resolve correctly.
  base: process.env.GITHUB_PAGES === 'true' ? '/bookworm-library/' : '/',
  plugins: [react()],
})
