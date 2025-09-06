/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom trivia game colors - vibrant gradient palette
        'trivia': {
          'purple': '#8B5CF6',
          'blue': '#3B82F6', 
          'cyan': '#06B6D4',
          'teal': '#14B8A6',
          'emerald': '#10B981',
          'orange': '#F97316',
          'red': '#EF4444',
          'pink': '#EC4899',
          'dark-purple': '#5a2e9e',
          'dark-blue': '#2a5a9e',
          'light-blue': '#60a5fa',
          'light-purple': '#a78bfa',
          'green': '#22c55e',
          'yellow': '#eab308',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--tw-gradient-stops) from-trivia-purple to-trivia-blue)',
        'gradient-secondary': 'linear-gradient(135deg, var(--tw-gradient-stops) from-trivia-orange to-trivia-pink)',
        'gradient-success': 'linear-gradient(135deg, var(--tw-gradient-stops) from-trivia-green to-trivia-teal)',
        'gradient-error': 'linear-gradient(135deg, var(--tw-gradient-stops) from-trivia-red to-trivia-orange)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0f0f23 0%, #1e1b4b 50%, #312e81 100%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" 
          },
          "50%": { 
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)" 
          },
        },
        "countdown": {
          "0%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.1)", opacity: 0.8 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        "pop-in": {
          "0%": { opacity: 0, transform: "scale(0.8)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "countdown": "countdown 1s ease-in-out infinite",
        "pop-in": "pop-in 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
      },
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
