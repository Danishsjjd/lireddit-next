/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },

  plugins: [require("daisyui"), require("@tailwindcss/line-clamp")],
  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: ["dark"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
  },
}
