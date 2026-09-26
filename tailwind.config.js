/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
        'glow-lg': '0 0 40px -10px rgba(99, 102, 241, 0.35)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 10px 15px -5px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        }
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: '#334155',
            maxWidth: 'none',
            fontSize: '1.125rem',
            lineHeight: '1.8',
            h1: {
              color: '#0f172a',
              fontWeight: '800',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              letterSpacing: '-0.025em',
            },
            h2: {
              color: '#1e293b',
              fontWeight: '700',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              letterSpacing: '-0.02em',
              marginTop: '2em',
              marginBottom: '0.75em',
            },
            h3: {
              color: '#1e293b',
              fontWeight: '600',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              marginTop: '1.5em',
            },
            p: {
              marginBottom: '1.4em',
            },
            blockquote: {
              borderLeftColor: '#6366f1',
              borderLeftWidth: '4px',
              fontStyle: 'italic',
              color: '#475569',
              paddingLeft: '1.25rem',
              backgroundColor: '#f8fafc',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              borderRadius: '0 0.5rem 0.5rem 0',
            },
            code: {
              backgroundColor: '#f1f5f9',
              color: '#4f46e5',
              padding: '0.2em 0.4em',
              borderRadius: '0.375rem',
              fontWeight: '500',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.9em',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
            a: {
              color: '#4f46e5',
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': {
                color: '#4338ca',
              },
            },
            img: {
              borderRadius: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      }),
    },
  },
  plugins: [ require('@tailwindcss/typography') ],
}
