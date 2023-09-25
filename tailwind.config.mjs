/** @type {import('tailwindcss').Config} */
import dsTailwind from "@navikt/ds-tailwind";

export default {
  presets: [dsTailwind],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "/dist/index.html"],
  corePlugins: {
    // https://tailwindcss.com/docs/preflight
    // denne er disablet fordi:
    // 1. preflight.css i tailwind har selectors med høy specificity som overskriver styles i "nav-frontend-*-styles"-pakker
    // 2. den fjerner en del default css-attributter (f.eks default margins) som kan gjøre visningen rar
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
