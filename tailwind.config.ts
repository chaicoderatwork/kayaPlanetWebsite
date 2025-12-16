import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: '#FDFBF9', // Off-White
  			foreground: '#111111', // Black
  			card: {
  				DEFAULT: '#FFFFFF',
  				foreground: '#111111'
  			},
  			popover: {
  				DEFAULT: '#FFFFFF',
  				foreground: '#111111'
  			},
  			primary: {
  				DEFAULT: '#F27708', // Primary Orange
  				foreground: '#FFFFFF'
  			},
  			secondary: {
  				DEFAULT: '#FDFBF9', // Off-White
  				foreground: '#111111'
  			},
  			muted: {
  				DEFAULT: '#FEE6E1', // Pale Pink
  				foreground: '#111111'
  			},
  			accent: {
  				DEFAULT: '#F89134', // Light Orange
  				foreground: '#FFFFFF'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: '#E5E5E5',
  			input: '#E5E5E5',
  			ring: '#F27708',
  			chart: {
  				'1': '#F27708',
  				'2': '#F89134',
  				'3': '#111111',
  				'4': '#FEE6E1',
  				'5': '#FDFBF9'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [
    require('daisyui'),
      require("tailwindcss-animate")
],
};
export default config;
