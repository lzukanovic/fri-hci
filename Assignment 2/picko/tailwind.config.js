module.exports = {
  content: [
    './src/renderer/**/*.{js,jsx,ts,tsx,ejs}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {},
  variants: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
};
