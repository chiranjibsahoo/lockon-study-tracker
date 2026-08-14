export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A1119',
        bgAlt: '#0D1520',
        panel: '#121C29',
        panel2: '#17222F',
        border: '#233145',
        borderLight: '#2C3D55',
        textMain: '#EDF1F7',
        textMute: '#8B98AC',
        textFaint: '#57657A',
        amber: '#E8A33D',
        amberSoft: '#3B2E19',
        teal: '#45C4B0',
        tealSoft: '#153631',
        positive: '#5FD3A0',
        positiveSoft: '#173229',
        negative: '#E2604F',
        negativeSoft: '#3A2019',
        violet: '#C77DDA',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
