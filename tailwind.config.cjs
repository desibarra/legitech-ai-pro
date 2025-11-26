/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                legitech: {
                    primary: '#025940',
                    secondary: '#347361',
                    accent: '#92BF4E',
                    accentHover: '#7FA646',
                    cream: '#F2E8DC',
                    dark: '#0F172A',
                    darker: '#020617',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
};
