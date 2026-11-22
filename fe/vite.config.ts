import path from 'node:path';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawInternal = (
    env.INTERNAL_API_BASE_URL || 'http://127.0.0.1:5000'
  ).replace(/\/api(?:\/v1)?\/?$/, '');

  return {
    envPrefix: ['VITE_', 'PUBLIC_'],
    plugins: [
      tailwindcss(),
      sveltekit({
        adapter: adapter(),
      }),
    ],
    resolve: {
      alias: {
        $lib: path.resolve('./src/lib'),
      },
    },
    server: {
      host: '127.0.0.1',
      port: 1234,
      strictPort: true,
      ws: {
        protocol: 'ws',
        host: '127.0.0.1',
        port: 24678,
        clientPort: 24678,
      },
      proxy: {
        '/api': {
          target: rawInternal,
          changeOrigin: true,
          timeout: 300_000,
          proxyTimeout: 300_000,
        },
      },
    },
    preview: {
      host: '127.0.0.1',
      port: 1234,
      strictPort: true,
      proxy: {
        '/api': {
          target: rawInternal,
          changeOrigin: true,
          timeout: 300_000,
          proxyTimeout: 300_000,
        },
      },
    },
  };
});
