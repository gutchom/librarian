import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { readFileSync } from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    https: {
      key: readFileSync('../cert/chombook.local-key.pem'),
      cert: readFileSync('../cert/chombook.local.pem'),
    },
  },
});
