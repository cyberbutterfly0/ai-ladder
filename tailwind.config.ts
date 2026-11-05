import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    // PAD 这类布局类名常量写在 lib 里，不扫这里就不会生成对应规则
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: "#FF8A3D",
        frost: "#BFF3FF",
      },
    },
  },
  plugins: [],
};

export default config;
