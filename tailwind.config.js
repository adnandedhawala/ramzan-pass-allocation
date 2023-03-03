const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./fe/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1600px"
    },
    extend: {
      fontFamily: {
        sans: ["Ubuntu", ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};
