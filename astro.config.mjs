// @ts-check
import {defineConfig} from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://sea-lion-app-y4gmq.ondigitalocean.app",
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: node({
    mode: "standalone",
  }),

  integrations: [svelte()],
});
