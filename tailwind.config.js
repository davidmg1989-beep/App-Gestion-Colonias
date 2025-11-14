/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // Classes that may be injected dynamically or used in strings
    'bg-indigo-600', 'text-white', 'rounded-full', 'shadow-lg', 'text-sm', 'font-bold',
    'flex', 'items-center', 'justify-center', 'w-full', 'h-full'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
