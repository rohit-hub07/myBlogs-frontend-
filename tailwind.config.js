/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Optional: override default typography styles (see below)
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: { color: '#1a202c', fontWeight: '700' },
            code: { backgroundColor: '#f4f4f5', padding: '4px', borderRadius: '4px' },
            // Add more customizations if needed
          },
        },
      }),
    },
  },
   plugins: [ require('@tailwindcss/typography') ],
}

