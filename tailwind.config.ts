import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
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
