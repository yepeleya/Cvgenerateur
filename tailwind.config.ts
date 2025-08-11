import type { Config } from "tailwindcss";
import daisyui from "daisyui"

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Override anti-OKLCH pour PDF : Forcer RGB/HEX
        primary: '#3b82f6',     // Bleu RGB au lieu d'OKLCH
        secondary: '#6b7280',   // Gris RGB au lieu d'OKLCH
        accent: '#22c55e',      // Vert RGB au lieu d'OKLCH
        neutral: '#4b5563',     // Gris neutre RGB
        'base-100': '#ffffff',  // Blanc pur
        'base-200': '#f3f4f6',  // Gris très clair
        'base-300': '#e5e7eb',  // Gris clair
        info: '#0ea5e9',        // Bleu info RGB
        success: '#22c55e',     // Vert succès RGB
        warning: '#f59e0b',     // Orange warning RGB
        error: '#ef4444',       // Rouge erreur RGB
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    // Thème custom 100% RGB pour éviter toute génération OKLCH (compatible html2canvas/jsPDF)
    themes: [
      {
        cvlight: {
          primary: '#3b82f6',
          'primary-content': '#ffffff',
          secondary: '#6b7280',
          'secondary-content': '#ffffff',
          accent: '#22c55e',
          'accent-content': '#ffffff',
          neutral: '#4b5563',
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#f3f4f6',
          'base-300': '#e5e7eb',
          'base-content': '#1f2937',
          info: '#0ea5e9',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444'
        }
      }
    ],
  }, 
} satisfies Config;
