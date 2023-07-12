import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
   const env = loadEnv(mode, process.cwd(), "");
   return {
      define: {
         "process.env.API_BASE_URL": JSON.stringify(env.API_BASE_URL),
         // 'process.env.YOUR_BOOLEAN_VARIABLE': env.YOUR_BOOLEAN_VARIABLE,
         // If you want to exposes all env variables, which is not recommended
         // 'process.env': env
      },
      plugins: [react()],
   };
});
