module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        PermanentMarker: ['"Permanent Marker"'],
        Kalam: ['"Kalam"'],
      },
    },
    colors: {
      amber: "#e07a5f",
      emerald: "#f2cc8f",
      white: "#f4f1de",
      green: "#81b29a",
      marine: "#3d405b",
    },
  },
  fontFamily: {
    sans: ["Graphik", "sans-serif"],
    serif: ["Merriweather", "serif"],
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
