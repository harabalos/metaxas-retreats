
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: { '2xl': '1400px' }
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
				secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
				destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
				muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
				accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
				popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
				card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Elevated palette — boutique luxury retreat
				forest: {
					light: '#5C8A6B',
					DEFAULT: '#1E3B2F',
					dark: '#122418',
				},
				wood: {
					light: '#E2C98A',
					DEFAULT: '#C9A44A',
					dark: '#9A7A2E',
				},
				leaf: {
					light: '#C1D9A3',
					DEFAULT: '#7EA85A',
					dark: '#557A38',
				},
				aegean: {
					light: '#3D7FA0',
					DEFAULT: '#0A4F6E',
					dark: '#063347',
				},
				sand: {
					light: '#FDFCF7',
					DEFAULT: '#F5EFD8',
					dark: '#E8DDB8',
				},
				cream: '#FAFAF5',
			},
			fontFamily: {
				sans: ['"DM Sans"', 'sans-serif'],
				heading: ['"EB Garamond"', 'Georgia', 'serif'],
				display: ['"EB Garamond"', 'Georgia', 'serif'],
			},
			fontSize: {
				'display-2xl': ['clamp(3rem,8vw,7rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
				'display-xl': ['clamp(2.5rem,6vw,5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				'display-lg': ['clamp(2rem,4vw,3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
				'display-md': ['clamp(1.5rem,3vw,2.5rem)', { lineHeight: '1.2' }],
			},
			boxShadow: {
				'card': '0 2px 16px 0 rgba(30,59,47,0.07), 0 1px 4px 0 rgba(30,59,47,0.05)',
				'card-hover': '0 8px 40px 0 rgba(30,59,47,0.13), 0 2px 8px 0 rgba(30,59,47,0.08)',
				'nav': '0 1px 0 0 rgba(30,59,47,0.08)',
				'cta': '0 4px 24px 0 rgba(201,164,74,0.3)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-up': {
					from: { opacity: '0', transform: 'translateY(24px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-up': 'fade-up 0.6s ease-out forwards',
			},
			transitionTimingFunction: {
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
