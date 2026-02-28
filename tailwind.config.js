/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#6B4F3A", 
          DEFAULT: "#4E342E", 
          dark: "#3E2723",   
        },
        background: {
          DEFAULT: "#F5F3F1", // soft beige
          dark: "#1E1A18",    // dark brown-black
        }
      }
    },
  },
  plugins: [],
}