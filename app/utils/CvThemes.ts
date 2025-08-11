import { CvTheme } from '@/type';

export const predefinedThemes: CvTheme[] = [
  // Thèmes Professionnels
  {
    id: 'professional-blue',
    name: 'Bleu Professionnel',
    category: 'professional',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6',
      background: '#ffffff',
      text: '#1f2937',
      textLight: '#6b7280',
      border: '#e5e7eb'
    },
    typography: {
      headerFont: 'Inter',
      bodyFont: 'Inter',
      headerSize: '1.25rem',
      bodySize: '0.875rem',
      fontWeight: 'semibold'
    },
    layout: {
      style: 'modern',
      borderRadius: 'small',
      shadow: 'medium',
      spacing: 'normal'
    },
    preview: '#2563eb'
  },
  {
    id: 'professional-gray',
    name: 'Gris Élégant',
    category: 'professional',
    colors: {
      primary: '#374151',
      secondary: '#1f2937',
      accent: '#6b7280',
      background: '#ffffff',
      text: '#111827',
      textLight: '#6b7280',
      border: '#d1d5db'
    },
    typography: {
      headerFont: 'Roboto',
      bodyFont: 'Roboto',
      headerSize: '1.25rem',
      bodySize: '0.875rem',
      fontWeight: 'medium'
    },
    layout: {
      style: 'classic',
      borderRadius: 'none',
      shadow: 'small',
      spacing: 'normal'
    },
    preview: '#374151'
  },
  // Thèmes Créatifs
  {
    id: 'creative-purple',
    name: 'Violet Créatif',
    category: 'creative',
    colors: {
      primary: '#7c3aed',
      secondary: '#5b21b6',
      accent: '#a855f7',
      background: '#faf5ff',
      text: '#1f2937',
      textLight: '#6b7280',
      border: '#e879f9'
    },
    typography: {
      headerFont: 'Poppins',
      bodyFont: 'Inter',
      headerSize: '1.5rem',
      bodySize: '0.875rem',
      fontWeight: 'bold'
    },
    layout: {
      style: 'creative',
      borderRadius: 'large',
      shadow: 'large',
      spacing: 'relaxed'
    },
    preview: '#7c3aed'
  },
  {
    id: 'creative-orange',
    name: 'Orange Énergique',
    category: 'creative',
    colors: {
      primary: '#ea580c',
      secondary: '#c2410c',
      accent: '#fb923c',
      background: '#fff7ed',
      text: '#1f2937',
      textLight: '#78716c',
      border: '#fed7aa'
    },
    typography: {
      headerFont: 'Montserrat',
      bodyFont: 'Open Sans',
      headerSize: '1.5rem',
      bodySize: '0.875rem',
      fontWeight: 'bold'
    },
    layout: {
      style: 'creative',
      borderRadius: 'medium',
      shadow: 'medium',
      spacing: 'relaxed'
    },
    preview: '#ea580c'
  },
  // Thèmes Modernes
  {
    id: 'modern-teal',
    name: 'Turquoise Moderne',
    category: 'modern',
    colors: {
      primary: '#0d9488',
      secondary: '#0f766e',
      accent: '#14b8a6',
      background: '#f0fdfa',
      text: '#134e4a',
      textLight: '#6b7280',
      border: '#99f6e4'
    },
    typography: {
      headerFont: 'Nunito',
      bodyFont: 'Source Sans Pro',
      headerSize: '1.375rem',
      bodySize: '0.875rem',
      fontWeight: 'semibold'
    },
    layout: {
      style: 'modern',
      borderRadius: 'medium',
      shadow: 'medium',
      spacing: 'normal'
    },
    preview: '#0d9488'
  },
  {
    id: 'modern-indigo',
    name: 'Indigo Moderne',
    category: 'modern',
    colors: {
      primary: '#4f46e5',
      secondary: '#3730a3',
      accent: '#6366f1',
      background: '#faf5ff',
      text: '#1e1b4b',
      textLight: '#6b7280',
      border: '#c4b5fd'
    },
    typography: {
      headerFont: 'Space Grotesk',
      bodyFont: 'Inter',
      headerSize: '1.375rem',
      bodySize: '0.875rem',
      fontWeight: 'semibold'
    },
    layout: {
      style: 'modern',
      borderRadius: 'large',
      shadow: 'medium',
      spacing: 'normal'
    },
    preview: '#4f46e5'
  },
  // Thèmes Minimaux
  {
    id: 'minimal-black',
    name: 'Noir Minimal',
    category: 'minimal',
    colors: {
      primary: '#000000',
      secondary: '#1f2937',
      accent: '#374151',
      background: '#ffffff',
      text: '#111827',
      textLight: '#6b7280',
      border: '#e5e7eb'
    },
    typography: {
      headerFont: 'Helvetica',
      bodyFont: 'Helvetica',
      headerSize: '1.125rem',
      bodySize: '0.875rem',
      fontWeight: 'medium'
    },
    layout: {
      style: 'minimal',
      borderRadius: 'none',
      shadow: 'none',
      spacing: 'compact'
    },
    preview: '#000000'
  },
  {
    id: 'minimal-blue',
    name: 'Bleu Minimal',
    category: 'minimal',
    colors: {
      primary: '#1e40af',
      secondary: '#1d4ed8',
      accent: '#3b82f6',
      background: '#ffffff',
      text: '#1f2937',
      textLight: '#6b7280',
      border: '#e5e7eb'
    },
    typography: {
      headerFont: 'Arial',
      bodyFont: 'Arial',
      headerSize: '1.125rem',
      bodySize: '0.875rem',
      fontWeight: 'medium'
    },
    layout: {
      style: 'minimal',
      borderRadius: 'small',
      shadow: 'small',
      spacing: 'compact'
    },
    preview: '#1e40af'
  }
];

// Schémas de couleurs prédéfinis
export const colorSchemes = {
  blue: {
    primary: '#2563eb',
    secondary: '#1e40af',
    accent: '#3b82f6'
  },
  green: {
    primary: '#059669',
    secondary: '#047857',
    accent: '#10b981'
  },
  purple: {
    primary: '#7c3aed',
    secondary: '#5b21b6',
    accent: '#a855f7'
  },
  orange: {
    primary: '#ea580c',
    secondary: '#c2410c',
    accent: '#fb923c'
  },
  red: {
    primary: '#dc2626',
    secondary: '#b91c1c',
    accent: '#ef4444'
  },
  teal: {
    primary: '#0d9488',
    secondary: '#0f766e',
    accent: '#14b8a6'
  }
};

// Fonts disponibles
export const availableFonts = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Poppins',
  'Montserrat',
  'Nunito',
  'Source Sans Pro',
  'Space Grotesk',
  'Helvetica',
  'Arial',
  'Times New Roman',
  'Georgia'
];

// Helper function pour créer un thème personnalisé
export const createCustomTheme = (baseTheme: CvTheme, customizations: Partial<CvTheme>): CvTheme => {
  return {
    ...baseTheme,
    ...customizations,
    id: `custom-${Date.now()}`,
    name: 'Thème Personnalisé',
    colors: {
      ...baseTheme.colors,
      ...customizations.colors
    },
    typography: {
      ...baseTheme.typography,
      ...customizations.typography
    },
    layout: {
      ...baseTheme.layout,
      ...customizations.layout
    }
  };
};
