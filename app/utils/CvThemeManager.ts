// Gestionnaire de thèmes et styles pour les CV

export interface CvTheme {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'modern' | 'minimalist' | 'corporate';
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    surface: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingWeight: string;
    bodyWeight: string;
  };
  layout: {
    spacing: number;
    borderRadius: number;
    columns: 1 | 2;
    headerStyle: 'classic' | 'modern' | 'centered' | 'sidebar';
  };
  animations: {
    enabled: boolean;
    hover: boolean;
    transitions: boolean;
  };
}

export const cvThemes: CvTheme[] = [
  {
    id: 'professional-blue',
    name: 'Professionnel Bleu',
    description: 'Un thème classique et professionnel avec des tons bleus',
    category: 'professional',
    preview: 'Bleu corporate avec sidebar',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#f8fafc'
    },
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      headingWeight: '600',
      bodyWeight: '400'
    },
    layout: {
      spacing: 16,
      borderRadius: 8,
      columns: 2,
      headerStyle: 'sidebar'
    },
    animations: {
      enabled: true,
      hover: true,
      transitions: true
    }
  },
  {
    id: 'creative-gradient',
    name: 'Créatif Dégradé',
    description: 'Design moderne avec des dégradés colorés',
    category: 'creative',
    preview: 'Dégradés vibrants et layout moderne',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#c084fc',
      text: '#374151',
      background: '#ffffff',
      surface: '#faf5ff'
    },
    typography: {
      headingFont: 'Poppins, sans-serif',
      bodyFont: 'Inter, sans-serif',
      headingWeight: '700',
      bodyWeight: '400'
    },
    layout: {
      spacing: 20,
      borderRadius: 12,
      columns: 1,
      headerStyle: 'modern'
    },
    animations: {
      enabled: true,
      hover: true,
      transitions: true
    }
  },
  {
    id: 'minimalist-gray',
    name: 'Minimaliste Gris',
    description: 'Design épuré avec des tons neutres',
    category: 'minimalist',
    preview: 'Design épuré et moderne',
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#9ca3af',
      text: '#111827',
      background: '#ffffff',
      surface: '#f9fafb'
    },
    typography: {
      headingFont: 'Source Sans Pro, sans-serif',
      bodyFont: 'Source Sans Pro, sans-serif',
      headingWeight: '600',
      bodyWeight: '400'
    },
    layout: {
      spacing: 12,
      borderRadius: 4,
      columns: 1,
      headerStyle: 'centered'
    },
    animations: {
      enabled: false,
      hover: false,
      transitions: true
    }
  },
  {
    id: 'modern-teal',
    name: 'Moderne Turquoise',
    description: 'Style contemporain avec des accents turquoise',
    category: 'modern',
    preview: 'Turquoise moderne avec sidebar',
    colors: {
      primary: '#0d9488',
      secondary: '#14b8a6',
      accent: '#5eead4',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#f0fdfa'
    },
    typography: {
      headingFont: 'Nunito, sans-serif',
      bodyFont: 'Open Sans, sans-serif',
      headingWeight: '700',
      bodyWeight: '400'
    },
    layout: {
      spacing: 18,
      borderRadius: 10,
      columns: 2,
      headerStyle: 'modern'
    },
    animations: {
      enabled: true,
      hover: true,
      transitions: true
    }
  },
  {
    id: 'corporate-navy',
    name: 'Corporate Marine',
    description: 'Thème corporate avec des tons marine',
    category: 'corporate',
    preview: 'Bleu marine corporate classique',
    colors: {
      primary: '#1e3a8a',
      secondary: '#3b82f6',
      accent: '#93c5fd',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#f1f5f9'
    },
    typography: {
      headingFont: 'Roboto, sans-serif',
      bodyFont: 'Roboto, sans-serif',
      headingWeight: '500',
      bodyWeight: '400'
    },
    layout: {
      spacing: 14,
      borderRadius: 6,
      columns: 2,
      headerStyle: 'classic'
    },
    animations: {
      enabled: false,
      hover: false,
      transitions: true
    }
  },
  {
    id: 'creative-pink',
    name: 'Créatif Rose',
    description: 'Design artistique avec des tons roses',
    category: 'creative',
    preview: 'Rose vibrant et créatif',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#fbcfe8',
      text: '#374151',
      background: '#ffffff',
      surface: '#fdf2f8'
    },
    typography: {
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Lato, sans-serif',
      headingWeight: '700',
      bodyWeight: '400'
    },
    layout: {
      spacing: 20,
      borderRadius: 15,
      columns: 1,
      headerStyle: 'modern'
    },
    animations: {
      enabled: true,
      hover: true,
      transitions: true
    }
  },
  {
    id: 'modern-orange',
    name: 'Moderne Orange',
    description: 'Style dynamique avec des accents orange',
    category: 'modern',
    preview: 'Orange énergique et moderne',
    colors: {
      primary: '#ea580c',
      secondary: '#fb923c',
      accent: '#fed7aa',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#fff7ed'
    },
    typography: {
      headingFont: 'Montserrat, sans-serif',
      bodyFont: 'Inter, sans-serif',
      headingWeight: '600',
      bodyWeight: '400'
    },
    layout: {
      spacing: 16,
      borderRadius: 12,
      columns: 2,
      headerStyle: 'sidebar'
    },
    animations: {
      enabled: true,
      hover: true,
      transitions: true
    }
  },
  {
    id: 'minimalist-green',
    name: 'Minimaliste Vert',
    description: 'Design nature avec des tons verts apaisants',
    category: 'minimalist',
    preview: 'Vert nature et épuré',
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#a7f3d0',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#f0fdf4'
    },
    typography: {
      headingFont: 'Nunito, sans-serif',
      bodyFont: 'Nunito, sans-serif',
      headingWeight: '600',
      bodyWeight: '400'
    },
    layout: {
      spacing: 14,
      borderRadius: 8,
      columns: 1,
      headerStyle: 'centered'
    },
    animations: {
      enabled: false,
      hover: false,
      transitions: true
    }
  }
];

export class CvThemeManager {
  private static currentTheme: CvTheme | null = null;
  private static customizations: Partial<CvTheme> = {};

  // Obtenir tous les thèmes
  static getAllThemes(): CvTheme[] {
    return cvThemes;
  }

  // Obtenir les thèmes par catégorie
  static getThemesByCategory(category: CvTheme['category']): CvTheme[] {
    return cvThemes.filter(theme => theme.category === category);
  }

  // Obtenir un thème par ID
  static getThemeById(id: string): CvTheme | null {
    return cvThemes.find(theme => theme.id === id) || null;
  }

  // Définir le thème actuel
  static setCurrentTheme(theme: CvTheme): void {
    this.currentTheme = theme;
    this.applyThemeToDocument(theme);
  }

  // Obtenir le thème actuel
  static getCurrentTheme(): CvTheme | null {
    return this.currentTheme;
  }

  // Appliquer le thème au document
  private static applyThemeToDocument(theme: CvTheme): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    // Appliquer les couleurs CSS custom properties
    root.style.setProperty('--cv-primary', theme.colors.primary);
    root.style.setProperty('--cv-secondary', theme.colors.secondary);
    root.style.setProperty('--cv-accent', theme.colors.accent);
    root.style.setProperty('--cv-text', theme.colors.text);
    root.style.setProperty('--cv-background', theme.colors.background);
    root.style.setProperty('--cv-surface', theme.colors.surface);

    // Appliquer les polices
    root.style.setProperty('--cv-heading-font', theme.typography.headingFont);
    root.style.setProperty('--cv-body-font', theme.typography.bodyFont);
    root.style.setProperty('--cv-heading-weight', theme.typography.headingWeight);
    root.style.setProperty('--cv-body-weight', theme.typography.bodyWeight);

    // Appliquer les styles de mise en page
    root.style.setProperty('--cv-spacing', `${theme.layout.spacing}px`);
    root.style.setProperty('--cv-border-radius', `${theme.layout.borderRadius}px`);
  }

  // Personnaliser un thème
  static customizeTheme(themeId: string, customizations: Partial<CvTheme>): CvTheme | null {
    const baseTheme = this.getThemeById(themeId);
    if (!baseTheme) return null;

    const customTheme: CvTheme = {
      ...baseTheme,
      id: `${baseTheme.id}-custom`,
      name: `${baseTheme.name} (Personnalisé)`,
      ...customizations,
      colors: { ...baseTheme.colors, ...customizations.colors },
      typography: { ...baseTheme.typography, ...customizations.typography },
      layout: { ...baseTheme.layout, ...customizations.layout },
      animations: { ...baseTheme.animations, ...customizations.animations }
    };

    return customTheme;
  }

  // Exporter un thème personnalisé
  static exportTheme(theme: CvTheme): string {
    return JSON.stringify(theme, null, 2);
  }

  // Importer un thème personnalisé
  static importTheme(themeJson: string): CvTheme | null {
    try {
      const theme = JSON.parse(themeJson) as CvTheme;
      // Validation basique
      if (!theme.id || !theme.name || !theme.colors || !theme.typography || !theme.layout) {
        throw new Error('Thème invalide');
      }
      return theme;
    } catch (error) {
      console.error('Erreur lors de l\'import du thème:', error);
      return null;
    }
  }

  // Générer un thème aléatoire
  static generateRandomTheme(): CvTheme {
    const colors = [
      '#1e40af', '#7c3aed', '#059669', '#dc2626', '#ea580c',
      '#0d9488', '#7c2d12', '#be185d', '#4338ca', '#166534'
    ];

    const fonts = [
      'Inter, sans-serif',
      'Roboto, sans-serif', 
      'Open Sans, sans-serif',
      'Poppins, sans-serif',
      'Nunito, sans-serif'
    ];

    const primary = colors[Math.floor(Math.random() * colors.length)];
    const font = fonts[Math.floor(Math.random() * fonts.length)];

    return {
      id: `random-${Date.now()}`,
      name: 'Thème Aléatoire',
      description: 'Thème généré automatiquement',
      category: 'modern',
      preview: 'Thème aléatoire',
      colors: {
        primary,
        secondary: this.adjustColor(primary, 20),
        accent: this.adjustColor(primary, 40),
        text: '#1f2937',
        background: '#ffffff',
        surface: '#f9fafb'
      },
      typography: {
        headingFont: font,
        bodyFont: font,
        headingWeight: '600',
        bodyWeight: '400'
      },
      layout: {
        spacing: 16,
        borderRadius: Math.floor(Math.random() * 16) + 4,
        columns: Math.random() > 0.5 ? 2 : 1,
        headerStyle: (['classic', 'modern', 'centered', 'sidebar'] as const)[Math.floor(Math.random() * 4)] as CvTheme['layout']['headerStyle']
      },
      animations: {
        enabled: Math.random() > 0.5,
        hover: Math.random() > 0.5,
        transitions: true
      }
    };
  }

  // Utilitaire pour ajuster une couleur
  private static adjustColor(color: string, amount: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * amount);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }

  // Sauvegarder les préférences utilisateur
  static saveUserPreferences(preferences: { themeId: string; customizations: Partial<CvTheme> }): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('cv-theme-preferences', JSON.stringify(preferences));
  }

  // Charger les préférences utilisateur
  static loadUserPreferences(): { themeId: string; customizations: Partial<CvTheme> } | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const preferences = localStorage.getItem('cv-theme-preferences');
      return preferences ? JSON.parse(preferences) : null;
    } catch {
      return null;
    }
  }
}
