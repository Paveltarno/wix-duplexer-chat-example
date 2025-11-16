// @ts-check
import { defineConfig } from 'astro/config';
import wix from "@wix/astro";

import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [wix(), react()],

  adapter: cloudflare({
    platformProxy: {
      enabled: false,
    },
  }),

  image: {
    domains: ["static.wixstatic.com"],
  },

  output: "server",

  vite: {
    optimizeDeps: {
      include: ['@wix/duplexer-js'],
      esbuildOptions: {
        define: {
          'process.env': '{}',
          'process.version': '""',
          'process.platform': '"browser"',
        },
      },
    },
  },
});