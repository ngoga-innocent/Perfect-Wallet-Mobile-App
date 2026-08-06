/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#10644D",
        secondary: "#10B981",
        accent: "#F5C542",
        background: "#F6F8F7",
        dark: "#0F172A",
        orange: "#e14719",
        lightOrange: "#FEA95C",
      },
    },
  },
  plugins: [],
};
