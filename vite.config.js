import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"), // 相对路径别名配置，使用 @ 代替 src
            "~@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3100,        // 默认端口
        strictPort: false, // 如果端口被占用，自动尝试下一个可用端口
        open: true,        // 自动打开浏览器
        host: true,        // 允许外部访问
    },
});