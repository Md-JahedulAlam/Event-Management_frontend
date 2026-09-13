/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0E0F12",
          900: "#15171C",
          800: "#1E2129",
          700: "#2A2E38",
          600: "#3B4150",
        },
        paper: "#F6F4EF",
        marigold: {
          400: "#F6B93B",
          500: "#EFA22A",
          600: "#D6871A",
        },
        signal: {
          500: "#E0563F",
        },
        moss: {
          500: "#3F7D5C",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Manrope'", "sans-serif"],
      },
      backgroundImage: {
        perf: "radial-gradient(circle, transparent 4px, currentColor 4.5px, currentColor 5px, transparent 5.5px)",
      },
    },
  },
  plugins: [],
};
