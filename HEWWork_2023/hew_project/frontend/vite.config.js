import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  // server:{host: '127.0.0.1',}
  server: {
    host: true,
    cors: "http://127.0.0.1:8000",
    // https: {
    //   key: fs.readFileSync('./cert/localhost-key.pem'),
    //   cert: fs.readFileSync('./cert/localhost.pem'),
    // }
  },
  
});
