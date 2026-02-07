import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'rgb(var(--color-brand-50) / <alpha-value>)',
          100: 'rgb(var(--color-brand-100) / <alpha-value>)',
          500: 'rgb(var(--color-brand-500) / <alpha-value>)',
          700: 'rgb(var(--color-brand-700) / <alpha-value>)'
        }
      },
      spacing: {
        'page-x': 'var(--spacing-page-x)',
        'page-y': 'var(--spacing-page-y)'
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)']
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
} satisfies Config;
