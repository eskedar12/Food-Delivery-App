/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: "#B91C1C",
        forest: "#166534",
        gold: "#D97706",
        parchment: "#FDFCF6",
        ink: "#1A1A1A",
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        serif: ["Lora", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
}