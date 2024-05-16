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
      amber: {
        light: "#FEF3C7",
        DEFAULT: "#FCD34D",
        dark: "#F59E0B",
      },
      emerald: {
        light: "#D1FAE5",
        DEFAULT: "#6EE7B7",
        dark: "#10B981",
      },
      white: "#60A5FA",
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
