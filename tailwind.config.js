module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      gridAutoColumns: {
        "1/4": 'calc(25% * 0.9 - 0.25rem)',
        "1/3": 'calc(33% * 0.9 - 0.25rem)',
        "100%": 'calc(100% * 0.9 - 0.25rem)'
      }
    },
  },
  plugins: [],
}
