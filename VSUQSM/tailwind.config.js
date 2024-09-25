// tailwind.config.js

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': '#22381F',
        'dark-green': '#2F4A2C',
        'light-green': '#2F4A2C', // Adjust as needed
        'hover-green': '#1F3419',
      },
    },
  },
  plugins: [],
}
