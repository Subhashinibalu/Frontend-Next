/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
   
    "./src/pages/**/*.{js,ts,jsx,tsx}", // For files in src/pages
    "./src/components/**/*.{js,ts,jsx,tsx}",
 
  
  ],
  theme: {
    extend: {
      
        colors: {
          primary: '#4F46E5', // blue
          secondary: '#FFFFFF', // white
        },
      
    },
  },
  plugins: [],
}