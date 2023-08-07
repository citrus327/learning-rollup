import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { reactAndMdx } from "rollup-plugin-react-and-mdx";
// https://vitejs.dev/config/

// https://juejin.cn/user/3210229686216222/posts for more vite
export default defineConfig({
  plugins: [reactAndMdx({}), react()],
});
