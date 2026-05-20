/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/pages/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#173F31",
        accent: "#F28C38",
        accentSoft: "#FF9A44",
      },
      width: {
        "7xl": "80rem",
      },
    },
  },
  plugins: [],
};
