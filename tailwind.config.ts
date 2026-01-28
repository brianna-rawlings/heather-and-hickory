import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'hickory': '#4c2a17', // Your Brown
        'heather-green': '#004422', // Your Dark Green
      },
      fontFamily: {
        'bodoni': ['var(--font-bodoni)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;