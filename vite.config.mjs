import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import autoprefixer from "autoprefixer";

export default defineConfig(() => {
  return {
    base: "./",
    build: {
      outDir: "build",
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
    },
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: "src/",
          replacement: `${path.resolve(__dirname, "src")}/`,
        },
      ],
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".scss"],
    },
    server: {
      port: 3000,
      proxy: {
        "/api/auth": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
        "/api/patients": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
        "/api/exercises": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
        "/api/exercise-raw-data": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
        "/api/patientNotes": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
        "/api/clinic": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
        "/api/doctor": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
        "/api/device": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
        "/api/session": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
  };
});
