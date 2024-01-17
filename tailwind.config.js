/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: '#adadad'
      }
    },
    container: {
      center: true,
      padding: '20px'
    }
  },
  plugins: []
}
