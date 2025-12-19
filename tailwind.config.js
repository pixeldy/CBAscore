/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: '#cba-live-insight-root', // 提高样式优先级，避免被页面样式覆盖
  theme: {
    extend: {
      colors: {
        'cba-orange': '#FF6600',
        'cba-bg': 'rgba(0, 0, 0, 0.85)',
        'cba-text': '#FFFFFF',
        'cba-text-secondary': '#CCCCCC',
        'cba-border': 'rgba(255, 255, 255, 0.1)',
        'cba-success': '#10B981',
        'cba-error': '#EF4444',
      },
      backdropBlur: {
        'glass': '12px',
      },
    },
  },
  plugins: [],
}
