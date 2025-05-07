/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssTypography from "@tailwindcss/typography";

export default withMT({
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          surface1: "#101010",
          surface2: "#191919",
          highlight: "#222222",
          text: {
            primary: "#F1F1F1",
            secondary: "#7B7B7B",
            tertiary: "#727272",
          },
        },
        // Light theme colors
        light: {
          surface1: "#F1F1F1",
          surface2: "#FDFDFD",
          highlight: "#F9F9F9",
          text: {
            primary: "#101010",
            secondary: "#727272",
            tertiary: "#7B7B7B",
          },
        },
        stroke: "#282828",
        textcolor: "#727272",

        sidebarbg: "#22242B",
        primarybg: "#1A1C23",
      },
      boxShadow: {
        menuShadow: "0 0 2px 2px #22242B",
        dropDownDark:
          "0px 5px 1.5px -4px rgba(8, 8, 8, 0.09), 0px 6px 4px -4px rgba(8, 8, 8, 0.05), 0px 6px 13px 0px rgba(8, 8, 8, 0.03), 0px 24px 24px -16px rgba(8, 8, 8, 0.04), 0px 2.15px 0.5px -2px rgba(0, 0, 0, 0.8), 0px 0px 10px 0px rgba(0, 0, 0, 0.1), inset 0px 0px 12px 4px rgba(250, 250, 250, 0.05)",
        insetShadow:
          "-0px 1px 4px rgba(0, 0, 0, 0.28), -1px 3px 18px rgba(0, 0, 0, 0.25), -2px 7px 40px rgba(0, 0, 0, 0.22), -3px 12px 71px rgba(0, 0, 0, 0.2), -5px 19px 111px rgba(0, 0, 0, 0.17), -8px 27px 160px rgba(0, 0, 0, 0.14), -10px 37px 218px rgba(0, 0, 0, 0.11), -13px 48px 284px rgba(0, 0, 0, 0.08), -17px 61px 360px rgba(0, 0, 0, 0.06), -21px 75px 444px rgba(0, 0, 0, 0.03)",
      },

      // above
      screens: {
        // your other breakpoints
        "2xl": "1530px", // for ≥1536px
        "3xl": "1700px", // optional if you want above 1700px too
      },

      /*  screens: {
        mobile: { max: "400px" },
        sm: { max: "700px" },
        md: { max: "900px" },
        lg: { max: "1100px" },
        xl: { max: "1300px" },
        xxl: { max: "1500px" },
        "3xl": { max: "1700px" },
      }, */
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssTypography],
});
