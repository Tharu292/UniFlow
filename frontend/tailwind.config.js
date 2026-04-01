/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        // ────────────────────────────────────────────────
        // Your custom academic planner palette
        // ────────────────────────────────────────────────
        'academic-dark': '#004c6d',     // dark blue – nav, headers, primary
        'academic-teal': '#228a95',     // teal – success, links, secondary
        'academic-orange': '#f29c4d',   // orange – urgent, warnings, highlights

        // Optional shades (very useful for hover states, backgrounds)
        'academic-dark-900': '#003549',
        'academic-dark-800': '#004c6d',
        'academic-teal-700': '#1a6f78',
        'academic-orange-600': '#e08b3e',
      },
    },
  },
  plugins: [],
}

