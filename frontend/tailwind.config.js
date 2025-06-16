/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          primary: "#13161C",
          textColor: "#A1A1AA",
          highlight: "#24262C",
        },
        light: {
          textColor: "#71717a",
        },
      },
      fontSize: {
        xs: "10px",
        sm: "12px",
        m: "14px",
        lg: "16px",
        xl: "18px",
        xll: "20px",
        "2xl": "25px",
        "3xl": "30px",
        "4xl": "35px",
        "5xl": "40px",
        "6xl": "45px",
        "7xl": "55px",
      },
      screens: {
        "2xl": "1530px", // for ≥1536px
        "3xl": "1700px", // optional if you want above 1700px too
      },
    },
  },
  plugins: [],
};
