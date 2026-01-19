import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { OUTPUT_DIR } from "./build/constant";
// https://vite.dev/config/
export default defineConfig({
  base: "/react-three-map/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 相对路径别名配置，使用 @ 代替 src
      "~@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: OUTPUT_DIR,
  },
  server: {
    port: 3100, // 默认端口
    strictPort: false, // 如果端口被占用，自动尝试下一个可用端口
    open: true, // 自动打开浏览器
    host: true, // 允许外部访问
  },
});
// const TimeStamp = new Date().getTime();
// export default ({ mode }) => {
//   return defineConfig({
//     base: "./", //env.VITE_APP_BASE_URL, // 动态改变base值
//     assetsInclude: [
//       "**/*.glb",
//       "**/*.gltf",
//       "**/*.fbx",
//       "**/*.hdr",
//       "**/*.json",
//       "**/*.mp4",
//       "**/*.mov",
//     ],
//     plugins: [react(), tailwindcss()],
//     build: {
//       minify: "esbuild",
//       target: "es2015",
//       cssTarget: "chrome80",
//       outDir: OUTPUT_DIR,
//       terserOptions: {
//         compress: {
//           // keep_infinity: true,
//           // // Used to delete console in production environment
//           // drop_console: VITE_DROP_CONSOLE,
//           // drop_debugger: true,
//         },
//       },
//       // Turning off brotliSize display can slightly reduce packaging time
//       reportCompressedSize: false,
//       chunkSizeWarningLimit: 2000,
//       rollupOptions: {
//         // 参考：https://blog.cinob.cn/archives/393
//         output: {
//           // 入口文件名
//           entryFileNames: `assets/[name]-${TimeStamp}.js`,
//           // 块文件名
//           chunkFileNames: `assets/[name]-[hash]-${TimeStamp}.js`,
//           // 资源文件名 css 图片等等
//           assetFileNames: `assets/[name]-[hash]-balabala-${TimeStamp}.[ext]`,
//         },
//       },
//     },
//     resolve: {
//       alias: {
//         "@": path.resolve(__dirname, "./src"), // 相对路径别名配置，使用 @ 代替 src
//         "~@": path.resolve(__dirname, "./src"),
//       },
//     },
//     server: {
//       port: 3100, // 默认端口
//       strictPort: false, // 如果端口被占用，自动尝试下一个可用端口
//       open: true, // 自动打开浏览器
//       host: true, // 允许外部访问
//     },
//   });
// };
