// Interfaces pour la gestion des pays et templates CV
import { Country, CvTemplate } from '@/type';

// Base de données simulée des pays et leurs modèles de CV
const COUNTRIES_DATA: Country[] = [
  // === PAYS EUROPÉENS ===
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    cvTemplates: [
      {
        id: 'fr-classic',
        name: 'CV Classique Français',
        country: 'FR',
        description: 'Modèle traditionnel français avec photo et informations personnelles détaillées',
        previewUrl: '/templates/fr-classic.jpg',
        structure: {
          sections: ['État Civil', 'Objectif Professionnel', 'Expérience Professionnelle', 'Formation', 'Compétences', 'Langues', 'Centres d\'Intérêt'],
          requiredFields: ['photo', 'fullName', 'email', 'phone', 'address', 'dateOfBirth', 'nationality'],
          optionalFields: ['maritalStatus', 'drivingLicense']
        }
      },
      {
        id: 'fr-modern',
        name: 'CV Moderne Français',
        country: 'FR',
        description: 'Design moderne et épuré, adapté aux secteurs innovants',
        previewUrl: '/templates/fr-modern.jpg',
        structure: {
          sections: ['Profil', 'Expérience', 'Formation', 'Compétences Techniques', 'Langues'],
          requiredFields: ['fullName', 'email', 'phone'],
          optionalFields: ['photo', 'portfolio', 'linkedin']
        }
      }
    ]
  },
  {
    code: 'DE',
    name: 'Allemagne',
    flag: '🇩🇪',
    cvTemplates: [
      {
        id: 'de-traditional',
        name: 'Lebenslauf Allemand',
        country: 'DE',
        description: 'CV allemand traditionnel avec photo professionnelle obligatoire',
        previewUrl: '/templates/de-traditional.jpg',
        structure: {
          sections: ['Persönliche Daten', 'Berufserfahrung', 'Ausbildung', 'Kenntnisse', 'Sprachen', 'Hobbys'],
          requiredFields: ['photo', 'fullName', 'email', 'phone', 'address', 'dateOfBirth', 'nationality'],
          optionalFields: ['maritalStatus', 'children']
        }
      }
    ]
  },
  {
    code: 'GB',
    name: 'Royaume-Uni',
    flag: '🇬🇧',
    cvTemplates: [
      {
        id: 'uk-standard',
        name: 'CV Standard Britannique',
        country: 'GB',
        description: 'Format traditionnel britannique avec références',
        previewUrl: '/templates/uk-standard.jpg',
        structure: {
          sections: ['Personal Details', 'Personal Statement', 'Work Experience', 'Education', 'Skills', 'References'],
          requiredFields: ['fullName', 'email', 'phone', 'address'],
          optionalFields: ['photo', 'references', 'hobbies']
        }
      }
    ]
  },
  {
    code: 'ES',
    name: 'Espagne',
    flag: '🇪🇸',
    cvTemplates: [
      {
        id: 'es-europeo',
        name: 'Currículum Vitae Español',
        country: 'ES',
        description: 'Format espagnol traditionnel avec photo et données personnelles',
        previewUrl: '/templates/es-europeo.jpg',
        structure: {
          sections: ['Datos Personales', 'Experiencia Laboral', 'Formación', 'Idiomas', 'Competencias', 'Otros Datos'],
          requiredFields: ['photo', 'fullName', 'email', 'phone', 'address', 'dateOfBirth'],
          optionalFields: ['nacionalidad', 'estadoCivil', 'carnetConducir']
        }
      }
    ]
  },
  {
    code: 'IT',
    name: 'Italie',
    flag: '🇮🇹',
    cvTemplates: [
      {
        id: 'it-europeo',
        name: 'Curriculum Vitae Italiano',
        country: 'IT',
        description: 'Format italien avec emphase sur l\'éducation et l\'expérience',
        previewUrl: '/templates/it-europeo.jpg',
        structure: {
          sections: ['Informazioni Personali', 'Esperienza Lavorativa', 'Istruzione', 'Competenze', 'Lingue', 'Interessi'],
          requiredFields: ['photo', 'fullName', 'email', 'phone', 'address', 'dateOfBirth'],
          optionalFields: ['nationality', 'maritalStatus', 'militaryService']
        }
      }
    ]
  },
  {
    code: 'NL',
    name: 'Pays-Bas',
    flag: '🇳🇱',
    cvTemplates: [
      {
        id: 'nl-standard',
        name: 'CV Néerlandais',
        country: 'NL',
        description: 'Format hollandais direct et concis',
        previewUrl: '/templates/nl-standard.jpg',
        structure: {
          sections: ['Persoonlijke Gegevens', 'Werkervaring', 'Opleiding', 'Vaardigheden', 'Talen', 'Hobby\'s'],
          requiredFields: ['fullName', 'email', 'phone', 'address'],
          optionalFields: ['photo', 'dateOfBirth', 'nationality']
        }
      }
    ]
  },
  {
    code: 'US',
    name: 'États-Unis',
    flag: '🇺🇸',
    cvTemplates: [
      {
        id: 'us-professional',
        name: 'Resume Professionnel US',
        country: 'US',
        description: 'Format standard américain sans photo, axé sur les résultats',
        previewUrl: '/templates/us-professional.jpg',
        structure: {
          sections: ['Contact Info', 'Professional Summary', 'Work Experience', 'Education', 'Skills', 'Certifications'],
          requiredFields: ['fullName', 'email', 'phone', 'city', 'state'],
          optionalFields: ['linkedin', 'website', 'portfolio']
        }
      },
      {
        id: 'us-creative',
        name: 'Resume Créatif US',
        country: 'US',
        description: 'Design créatif pour les métiers artistiques et du marketing',
        previewUrl: '/templates/us-creative.jpg',
        structure: {
          sections: ['Header', 'About', 'Experience', 'Projects', 'Skills', 'Education'],
          requiredFields: ['fullName', 'email', 'portfolio'],
          optionalFields: ['social_media', 'awards', 'exhibitions']
        }
      }
    ]
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    cvTemplates: [
      {
        id: 'ca-bilingual',
        name: 'CV Canadien Bilingue',
        country: 'CA',
        description: 'Format canadien adaptable français/anglais',
        previewUrl: '/templates/ca-bilingual.jpg',
        structure: {
          sections: ['Coordonnées/Contact', 'Sommaire/Summary', 'Expérience/Experience', 'Formation/Education', 'Compétences/Skills'],
          requiredFields: ['fullName', 'email', 'phone', 'province'],
          optionalFields: ['photo', 'languages', 'volunteer_work']
        }
      }
    ]
  },
  {
    code: 'AU',
    name: 'Australie',
    flag: '🇦🇺',
    cvTemplates: [
      {
        id: 'au-standard',
        name: 'Australian CV',
        country: 'AU',
        description: 'Format australien avec emphasis sur les achievements',
        previewUrl: '/templates/au-standard.jpg',
        structure: {
          sections: ['Personal Details', 'Career Objective', 'Key Achievements', 'Employment History', 'Education', 'Skills', 'References'],
          requiredFields: ['fullName', 'email', 'phone'],
          optionalFields: ['address', 'references', 'volunteer_work', 'interests']
        }
      }
    ]
  },
  {
    code: 'CM',
    name: 'Cameroun',
    flag: '🇨🇲',
    cvTemplates: [
      {
        id: 'cm-bilingue',
        name: 'CV Camerounais',
        country: 'CM',
        description: 'Format camerounais bilingue français/anglais',
        previewUrl: '/templates/cm-bilingue.jpg',
        structure: {
          sections: ['État Civil/Personal Details', 'Objectif Professionnel/Career Objective', 'Expérience Professionnelle/Work Experience', 'Formation/Education', 'Compétences/Skills', 'Langues/Languages', 'Divers/Others'],
          requiredFields: ['photo', 'fullName', 'email', 'phone', 'address', 'dateOfBirth', 'nationality'],
          optionalFields: ['maritalStatus', 'children', 'references', 'cni']
        }
      }
    ]
  },
  {
    code: 'CI',
    name: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    cvTemplates: [
      {
        id: 'ci-francophone',
        name: 'CV Ivoirien Traditionnel',
        country: 'CI',
        description: 'Format ivoirien traditionnel avec influences françaises et spécificités locales',
        previewUrl: '/templates/ci-francophone.jpg',
        structure: {
          sections: ['État Civil', 'Objectif de Carrière', 'Expérience Professionnelle', 'Formation Académique', 'Compétences', 'Langues Parlées', 'Centres d\'Intérêt'],
          requiredFields: ['photo', 'fullName', 'email', 'phone', 'address', 'dateOfBirth', 'nationality'],
          optionalFields: ['maritalStatus', 'children', 'references', 'cni']
        }
      },
      {
        id: 'ci-international',
        name: 'CV Ivoirien International',
        country: 'CI',
        description: 'Format moderne adapté aux entreprises multinationales en Côte d\'Ivoire',
        previewUrl: '/templates/ci-international.jpg',
        structure: {
          sections: ['Profil Personnel', 'Résumé Professionnel', 'Expérience Professionnelle', 'Formation', 'Compétences Techniques', 'Langues', 'Certifications'],
          requiredFields: ['fullName', 'email', 'phone', 'address'],
          optionalFields: ['photo', 'linkedin', 'portfolio', 'certifications']
        }
      }
    ]
  },
  {
    code: 'SN',
    name: 'Sénégal',
    flag: '🇸🇳',
    cvTemplates: [
      {
        id: 'sn-francophone',
        name: 'CV Sénégalais',
        country: 'SN',
        description: 'Format sénégalais avec tradition francophone et éléments culturels',
        previewUrl: '/templates/sn-francophone.jpg',
        structure: {
          sections: ['Informations Personnelles', 'Objectif Professionnel', 'Parcours Professionnel', 'Formation', 'Compétences Techniques', 'Langues', 'Activités Associatives'],
          requiredFields: ['photo', 'fullName', 'email', 'phone', 'address', 'nationality'],
          optionalFields: ['dateOfBirth', 'maritalStatus', 'references', 'cni']
        }
      }
    ]
  },
  // === PAYS ASIATIQUES ===
  {
    code: 'CN',
    name: 'Chine',
    flag: '🇨🇳',
    cvTemplates: [
      {
        id: 'cn-traditional',
        name: 'CV Chinois Traditionnel',
        country: 'CN',
        description: 'Format chinois avec photo et informations personnelles détaillées',
        previewUrl: '/templates/cn-traditional.jpg',
        structure: {
          sections: ['个人信息', '求职意向', '工作经历', '教育背景', '技能专长', '语言能力', '个人爱好'],
          requiredFields: ['photo', 'fullName', 'email', 'phone', 'address', 'dateOfBirth'],
          optionalFields: ['maritalStatus', 'politicalStatus', 'hukou']
        }
      },
      {
        id: 'cn-international',
        name: 'CV Chinois International',
        country: 'CN',
        description: 'Format adapté pour les entreprises internationales en Chine',
        previewUrl: '/templates/cn-international.jpg',
        structure: {
          sections: ['Personal Information', 'Career Objective', 'Work Experience', 'Education', 'Skills', 'Languages', 'Interests'],
          requiredFields: ['photo', 'fullName', 'email', 'phone'],
          optionalFields: ['address', 'dateOfBirth', 'maritalStatus']
        }
      }
    ]
  },
  {
    code: 'KR',
    name: 'Corée du Sud',
    flag: '🇰🇷',
    cvTemplates: [
      {
        id: 'kr-standard',
        name: '이력서 한국어',
        country: 'KR',
        description: 'Format coréen standard avec photo professionnelle',
        previewUrl: '/templates/kr-standard.jpg',
        structure: {
          sections: ['인적사항', '희망근무조건', '학력사항', '경력사항', '자격사항', '어학능력', '수상경력'],
          requiredFields: ['photo', 'fullName', 'email', 'phone', 'address', 'dateOfBirth'],
          optionalFields: ['familyStatus', 'militaryService', 'disability']
        }
      },
      {
        id: 'kr-global',
        name: 'Resume Coréen Global',
        country: 'KR',
        description: 'Format coréen pour les entreprises multinationales',
        previewUrl: '/templates/kr-global.jpg',
        structure: {
          sections: ['Personal Details', 'Career Objective', 'Education', 'Work Experience', 'Skills', 'Languages', 'Certifications'],
          requiredFields: ['photo', 'fullName', 'email', 'phone'],
          optionalFields: ['address', 'dateOfBirth', 'militaryService']
        }
      }
    ]
  }
];

// Export des fonctions et classes du gestionnaire de pays
export class CountryManager {
  
  // Récupérer tous les pays disponibles
  static getAllCountries(): Country[] {
    return COUNTRIES_DATA;
  }

  // Récupérer un pays par son code
  static getCountryByCode(code: string): Country | null {
    return COUNTRIES_DATA.find(country => country.code === code) || null;
  }

  // Récupérer les templates d'un pays spécifique
  static getTemplatesByCountry(countryCode: string): CvTemplate[] {
    const country = this.getCountryByCode(countryCode);
    return country?.cvTemplates || [];
  }

  // Récupérer un template spécifique par son ID
  static getTemplateById(templateId: string): CvTemplate | null {
    for (const country of COUNTRIES_DATA) {
      const template = country.cvTemplates?.find(t => t.id === templateId);
      if (template) return template;
    }
    return null;
  }

  // Rechercher des pays par nom
  static searchCountries(searchTerm: string): Country[] {
    const term = searchTerm.toLowerCase();
    return COUNTRIES_DATA.filter(country => 
      country.name.toLowerCase().includes(term) || 
      country.code.toLowerCase().includes(term)
    );
  }

  // Récupérer les pays par région
  static getCountriesByRegion(): { [region: string]: Country[] } {
    const europeanCodes = ['FR', 'DE', 'GB', 'ES', 'IT', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'PT', 'GR', 'IE', 'RO'];
    const americanCodes = ['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY'];
    const africanCodes = ['MA', 'DZ', 'TN', 'EG', 'ZA', 'NG', 'GH', 'KE', 'CI', 'CM', 'SN', 'ML', 'BF', 'TG', 'BJ', 'NE', 'GN'];
    const asianCodes = ['JP', 'CN', 'IN', 'KR'];
    const oceanicCodes = ['AU', 'NZ'];

    return {
      'Europe': COUNTRIES_DATA.filter(c => europeanCodes.includes(c.code)),
      'Amérique': COUNTRIES_DATA.filter(c => americanCodes.includes(c.code)),
      'Afrique': COUNTRIES_DATA.filter(c => africanCodes.includes(c.code)),
      'Asie': COUNTRIES_DATA.filter(c => asianCodes.includes(c.code)),
      'Océanie': COUNTRIES_DATA.filter(c => oceanicCodes.includes(c.code))
    };
  }

  // Valider la structure d'un CV selon un template
  static validateCvStructure(cvData: Record<string, unknown>, templateId: string): {
    isValid: boolean;
    missingFields: string[];
    suggestions: string[];
  } {
    const template = this.getTemplateById(templateId);
    if (!template) {
      return {
        isValid: false,
        missingFields: [],
        suggestions: ['Template non trouvé']
      };
    }

    const missingFields: string[] = [];
    const suggestions: string[] = [];

    // Vérifier les champs requis
    for (const field of template.structure.requiredFields) {
      if (!cvData[field] || cvData[field] === '') {
        missingFields.push(field);
      }
    }

    // Suggestions pour les champs optionnels
    for (const field of template.structure.optionalFields) {
      if (!cvData[field] || cvData[field] === '') {
        suggestions.push(`Considérez ajouter : ${field}`);
      }
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      suggestions
    };
  }

  // Obtenir les recommandations culturelles pour un pays
  static getCulturalRecommendations(countryCode: string): string[] {
    const recommendations: { [key: string]: string[] } = {
      'FR': [
        'Incluez une photo professionnelle',
        'Mentionnez votre état civil et nationalité',
        'Utilisez un format chronologique inverse',
        'Limitez à 2 pages maximum'
      ],
      'US': [
        'N\'incluez jamais de photo',
        'Évitez les informations personnelles (âge, statut marital)',
        'Mettez l\'accent sur les réalisations quantifiées',
        'Utilisez des mots-clés pertinents pour les ATS'
      ],
      'DE': [
        'Photo professionnelle obligatoire',
        'Informations personnelles détaillées requises',
        'Format tabulaire traditionnel accepté',
        'Références généralement non nécessaires'
      ],
      'GB': [
        'Photo généralement non recommandée',
        'Incluez des références ou "disponible sur demande"',
        'Format chronologique inverse',
        'Mettez l\'accent sur les compétences transférables'
      ],
      'AU': [
        'Photo non recommandée',
        'Mentionnez votre statut de visa si applicable',
        'Incluez des références',
        'Format de 2-3 pages acceptable'
      ],
      'CN': [
        'Photo professionnelle obligatoire',
        'Incluez informations personnelles détaillées (âge, statut marital)',
        'Mentionnez votre lieu de naissance (Hukou)',
        'Format chronologique avec dates précises',
        'Soyez modeste dans les descriptions'
      ],
      'KR': [
        'Photo professionnelle obligatoire',
        'Incluez informations familiales et statut martial',
        'Mentionnez le service militaire (hommes)',
        'Format chronologique strict par dates',
        'Respectez la hiérarchie dans les descriptions'
      ]
    };

    return recommendations[countryCode] || [
      'Recherchez les normes locales spécifiques',
      'Adaptez le format aux attentes culturelles',
      'Vérifiez les exigences légales du pays'
    ];
  }
}

export default CountryManager;
