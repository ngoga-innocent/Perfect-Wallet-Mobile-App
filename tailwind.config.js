/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: "#10644D",

        secondary: "#10B981",

        accent: "#F5C542",

        background: {
          DEFAULT: "#F6F8F7",
          // dark: "#09090B",
          dark: "#464858",
        },

        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#18181B",
        },

        card: {
          DEFAULT: "#FFFFFF",
          dark: "#27272A",
        },

        textPrimary: {
          DEFAULT: "#0F172A",
          dark: "#F8FAFC",
        },
        textHighlight: {
          DEFAULT: "#10644D",
          dark: "#10B981",
        },

        textSecondary: {
          DEFAULT: "#64748B",
          dark: "#CBD5E1",
        },
        textWhite: {
          DEFAULT: "#FFFFFF",
          dark: "#FFFFFF",
        },

        border: {
          DEFAULT: "#E5E7EB",
          dark: "#3F3F46",
        },
        orange: {
          DEFAULT: "#e14719",
          dark: "#FEA95C",
        },
        lightOrange: {
          DEFAULT: "#FEA95C",
          dark: "#e14719",
        },
      },
    },
  },
  // theme: {
  //   extend: {
  //     colors: {
  //       primary: "#10644D",
  //       secondary: "#10B981",
  //       accent: "#F5C542",
  //       background: "#F6F8F7",
  //       dark: "#0F172A",
  //       orange: "#e14719",
  //       lightOrange: "#FEA95C",
  //     },
  //   },
  // },
  plugins: [],
};
