/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    dark: 'var(--color-primary-dark)',
                    light: 'var(--color-primary-light)',
                },

                secondary: 'var(--color-secondary)',
                accent: 'var(--color-accent)',

                bg: {
                    primary: 'var(--color-bg-primary)',
                    secondary: 'var(--color-bg-secondary)',
                    tertiary: 'var(--color-bg-tertiary)',
                    glass: 'var(--color-bg-glass)',
                    'glass-hover': 'var(--color-bg-glass-hover)',
                },

                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    muted: 'var(--color-text-muted)',
                },

                border: {
                    DEFAULT: 'var(--color-border)',
                    focus: 'var(--color-border-focus)',
                },
            },
        },
    },
    plugins: [],
};
