import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssr: {
    // CommonJS packages whose named exports Node can't see: bundle them into
    // the SSR build instead of importing them from node_modules.
    noExternal: ["react-helmet-async"],
  },
  build: {
    // Hashed build output gets its own folder so vercel.json can cache it
    // forever without also freezing the unhashed photos in public/assets.
    assetsDir: "_app",
    // The SSR bundle (dist-ssr, used only to prerender) needs no public/ copy.
    copyPublicDir: !isSsrBuild,
  },
}));
