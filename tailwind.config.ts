import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import tailwindScrollbar from 'tailwind-scrollbar';
import typography from '@tailwindcss/typography';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      keyframes: {
        'mint-spin': {
          '0%': {
            transform: 'rotate(0deg) translateY(-60%)',
          },
          '100%': {
            transform: 'rotate(360deg) translateY(-60%)',
          },
        },
        'withdraw-spin': {
          '0%': {
            transform: 'rotate(0deg) translateY(-60%)',
          },
          '100%': {
            transform: 'rotate(-360deg) translateY(-60%)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(-60%)',
          },
          '50%': {
            transform: 'translateY(-57%)',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px 2px hsla(82, 84%, 64%, 0.3)',
            borderColor: 'hsla(82, 84%, 64%, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 30px 4px hsla(82, 84%, 64%, 0.5)',
            borderColor: 'hsla(82, 84%, 64%, 0.8)',
          },
        },
      },
      animation: {
        'mint-spin': 'mint-spin 60s linear infinite',
        'withdraw-spin': 'withdraw-spin 60s linear infinite',
        float: 'float 20s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      backgroundImage: {
        'text-gradient':
          'linear-gradient(90deg, hsla(85, 73%, 43%, 1) 0%, hsla(32, 84%, 52%, 1) 50%, hsla(19, 85%, 51%, 1) 100%)',
        'earn-gradient': 'linear-gradient(to right, #8DC63F 0%, #F7931E 50%, #F15A24 100%)',
      },
      colors: {
        'background-primary': 'hsla(0, 0%, 7%, 1)',
        'background-secondary': 'hsla(0, 0%, 13%, 1)',
        'background-tertiary': 'hsla(82, 84%, 64%, 1)',
        'tab-active': 'hsla(85, 79%, 41%, 0.3)',
        'tab-active-border': 'hsla(85, 79%, 41%, 0.2)',
        'background-tertiary-gradient':
          'linear-gradient(90deg, hsla(85, 54%, 53%, 1) 0%, hsla(85, 77%, 41%, 1) 100%)',
        'background-input': 'hsla(0, 0%, 5%, 1)',
        'background-surface': 'hsla(0, 0%, 20%, 1)',
        'background-component-primary': 'hsla(0, 0%, 13%, 1)',
        'semantic-neutral-alpha': 'hsla(0, 0%, 100%, 0.05)',
        'bg-switch': 'hsla(0, 0%, 15%, 1)',
        'background-error': 'hsla(0, 80%, 59%, 0.08)',
        'background-light': 'hsla(0, 0%, 17%, 1)',
        'background-tooltip': 'hsla(0, 0%, 12%, 1)',
        text: {
          primary: 'hsla(0, 0%, 100%, 1)',
          secondary: 'hsla(0, 0%, 100%, 0.64)',
          tertiary: 'hsla(82, 84%, 64%, 1)',
          highlight: 'hsla(82, 84%, 64%, 1)',
          light: 'hsla(0, 0%, 100%, 0.4)',
          dark: 'hsla(0, 0%, 7%, 1)',
          shallow: 'hsla(0, 0%, 100%, 0.8)',
        },
        icon: {
          primary: 'hsla(152, 8%, 64%, 1)',
          secondary: 'hsla(0, 0%, 100%, 0.64)',
        },
        button: {
          primary: 'hsla(85, 79%, 41%, 1)',
        },
        border: {
          DEFAULT: 'hsl(var(--border))',
          'alpha-strong': 'hsla(0, 0%, 100%, 0.2)',
          'alpha-light': 'hsla(0, 0%, 100%, 0.1)',
          'alpha-subtle': 'hsla(0, 0%, 100%, 0.12)',
          'alpha-error': 'hsla(0, 80%, 59%, 0.6)',
          modal: 'hsla(0, 0%, 13%, 1)',
          checkbox: 'hsla(140, 8%, 78%, 1)',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        'gradient-start': '#8DC63F',
        'gradient-middle': '#F7931E',
        'gradient-end': '#F15A24',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        vcr: ['VCR OSD Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'hsla(0, 0%, 100%, 0.8)',
            h1: { color: 'hsla(0, 0%, 100%, 1)' },
            h2: { color: 'hsla(0, 0%, 100%, 1)' },
            h3: { color: 'hsla(0, 0%, 100%, 1)' },
            strong: { color: 'hsla(0, 0%, 100%, 1)' },
            a: { color: '#8DC63F', '&:hover': { color: '#69a41f' } },
            code: { color: 'hsla(0, 0%, 100%, 0.9)' },
            li: { marginTop: '0.25em', marginBottom: '0.25em' },
          },
        },
      },
    },
  },
  plugins: [animate, tailwindScrollbar, typography],
} satisfies Config;
