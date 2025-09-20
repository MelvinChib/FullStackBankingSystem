import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the output dir from dist to build
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },
  plugins: [tsconfigPaths(), react(), tagger()],
  define: {
    'process.env': {},
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: [".amazonaws.com"],
  },
});
