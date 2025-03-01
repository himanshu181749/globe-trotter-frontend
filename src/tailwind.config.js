/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,html}"], // Ensure all files are scanned
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0ea5e9', light: '#e0f2fe', dark: '#0369a1' },
        secondary: { DEFAULT: '#8b5cf6', light: '#f3e8ff' },
        success: { DEFAULT: '#22c55e', light: '#dcfce7' },
        danger: { DEFAULT: '#ef4444', light: '#fee2e2' },
        warning: { DEFAULT: '#f59e0b', light: '#fef3c7' },
        muted: { DEFAULT: '#f3f4f6', foreground: '#6b7280' },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
};