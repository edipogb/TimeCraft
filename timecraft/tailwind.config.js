// AIDEV-NOTE: Tailwind v4 config - simplified for @theme directive compatibility
// AIDEV-NOTE: Theme colors now defined in globals.css @theme instead of config
/** @type {import('tailwindcss').Config} */
export default {
  // AIDEV-NOTE: Tailwind v4 uses CSS-based theming, no need for class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // AIDEV-NOTE: Container settings maintained for layout consistency
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // AIDEV-NOTE: Screen breakpoints for responsive design
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // AIDEV-NOTE: Font family for consistent typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // AIDEV-NOTE: Custom animations for TimeCraft UX
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // AIDEV-NOTE: Keyframe definitions for animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  // AIDEV-NOTE: Required plugins for typography support
  // AIDEV-NOTE: tw-animate-css is imported in globals.css instead of plugin
  plugins: [
    require('@tailwindcss/typography'),
  ],
}