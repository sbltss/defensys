/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  important: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        danger: colors.red,
        warning: colors.yellow,
        success: colors.green,
      },
    },
  },
  plugins: [
    require("tw-elements/dist/plugin"),
    ({ addVariant }) => {
      addVariant("child-span", "& > span");
    },
  ],
  corePlugins: {
    preflight: true,
  },
};
