/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ubuntu: "var(--font-ubuntu)",
        jakarta: "var(--font-plus-jakarta-sans)",
      },
      colors: {
        brand: {
          // Primary colors
          "primary": "#4F46E5", // Indigo-600
          "primary-dark": "#4338CA", // Indigo-700
          "primary-light": "#818CF8", // Indigo-400

          // Secondary colors
          "secondary": "#10B981", // Emerald-500
          "secondary-dark": "#059669", // Emerald-600
          "secondary-light": "#34D399", // Emerald-400

          // Accent colors
          "accent": "#F97316", // Orange-500
          "accent-dark": "#EA580C", // Orange-600
          "accent-light": "#FB923C", // Orange-400

          // Neutral colors
          "neutral-dark": "#1F2937", // Gray-800
          "neutral": "#4B5563", // Gray-600
          "neutral-light": "#9CA3AF", // Gray-400

          // Background colors
          "background": "#F9FAFB", // Gray-50
          "background-dark": "#F3F4F6", // Gray-100

          // Status colors
          "success": "#10B981", // Emerald-500
          "warning": "#F59E0B", // Amber-500
          "error": "#EF4444", // Red-500
          "info": "#3B82F6", // Blue-500

          // Legacy colors (keeping for backward compatibility)
          "cerulean-blue": "#4F46E5", // Mapped to primary
          "cerulean-blue-dark": "#4338CA", // Mapped to primary-dark
          "light-blue": "#60A5FA", // Light blue color for admin navbar
          "storm-dust": "#4B5563", // Mapped to neutral
          "white-smoke": "#F9FAFB", // Mapped to background
          "white-smoke-100": "#F3F4F6", // Mapped to background-dark
          "bittersweet": "#EF4444", // Mapped to error
          "bittersweet-dark": "#DC2626", // Red-600
          "haiti": "#1F2937", // Mapped to neutral-dark
          "star-dust": "#9CA3AF", // Mapped to neutral-light
          "paris-green": "#10B981", // Mapped to success
          "light-gray": "#F3F4F6", // Mapped to background-dark
          "midnight": "#1F2937", // Mapped to neutral-dark
          "mountain-mist": "#9CA3AF", // Mapped to neutral-light
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'button': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
