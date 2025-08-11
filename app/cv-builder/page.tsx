'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { 
  Eye, 
  Download, 
  Save, 
  Palette, 
  Layout,
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Heart,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  PersonalDetails, 
  Experience, 
  Education, 
  Skill, 
  Language, 
  Hobby,
  Country,
  CvTemplate,
  CvTheme,
  CvCustomization
} from '@/type';
import AuthManager from '@/app/utils/AuthManager';
import { predefinedThemes } from '@/app/utils/CvThemes';
import { CvPdfGenerator } from '@/app/utils/CvPdfGenerator';
import CvStorageManager from '@/app/utils/CvStorageManager';
import PersonalDetailForm from '@/app/components/PersonalDetailForm';
import ExperienceForm from '@/app/components/ExperienceForm';
import EducationForm from '@/app/components/EducationForm';
import LanguagesForm from '@/app/components/LanguagesForm';
import HobbieForm from '@/app/components/HobbieForm';
import SkillForm from '@/app/components/SkillForm';
import CvPreview from '@/app/components/CvPreview';
import CvCustomizationPanel from '@/app/components/CvCustomizationPanel';

export default function CvBuilderPage() {
  // const { isDarkMode } = useTheme();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CvTemplate | null>(null);
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showAdvancedCustomization, setShowAdvancedCustomization] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // CV Data States
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    photoUrl: '',
    postSeeking: '',
    description: '',
  });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);

  // Customization state avec le premier thème prédéfini
  const [customization, setCustomization] = useState<CvCustomization>({
    theme: predefinedThemes[0], // Utilise le premier thème prédéfini
    showPhoto: true,
    sectionsOrder: ['personal', 'experience', 'education', 'skills', 'languages', 'hobbies'],
    fontSize: 'medium',
    spacing: 'normal',
    colorScheme: 'default'
  });

  // Sample countries and templates
  const countries: Country[] = [
    {
      code: 'FR',
      name: 'France',
      flag: '🇫🇷',
      cvTemplates: [
        {
          id: 'fr-1',
          name: 'CV Français Classique',
          country: 'FR',
          description: 'Format traditionnel français avec photo',
          previewUrl: '/templates/fr-classic.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone', 'address'],
            optionalFields: ['photoUrl', 'description']
          }
        },
        {
          id: 'fr-2',
          name: 'CV Français Moderne',
          country: 'FR',
          description: 'Design moderne avec mise en page créative',
          previewUrl: '/templates/fr-modern.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages', 'hobbies'],
            requiredFields: ['fullName', 'email', 'phone'],
            optionalFields: ['photoUrl', 'description', 'address']
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
          id: 'us-1',
          name: 'Resume US Standard',
          country: 'US',
          description: 'Format américain sans photo',
          previewUrl: '/templates/us-standard.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills'],
            requiredFields: ['fullName', 'email', 'phone'],
            optionalFields: ['address', 'description']
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
          id: 'ca-1',
          name: 'CV Canadien',
          country: 'CA',
          description: 'Format canadien bilingue',
          previewUrl: '/templates/ca-bilingual.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone'],
            optionalFields: ['address', 'description']
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
          id: 'ci-1',
          name: 'CV Ivoirien Professionnel',
          country: 'CI',
          description: 'Format adapté au marché ivoirien',
          previewUrl: '/templates/ci-professional.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone', 'address'],
            optionalFields: ['photoUrl', 'description']
          }
        },
        {
          id: 'ci-2',
          name: 'CV Ivoirien Moderne',
          country: 'CI',
          description: 'Design moderne pour les jeunes professionnels',
          previewUrl: '/templates/ci-modern.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages', 'hobbies'],
            requiredFields: ['fullName', 'email', 'phone'],
            optionalFields: ['photoUrl', 'description', 'address']
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
          id: 'sn-1',
          name: 'CV Sénégalais Standard',
          country: 'SN',
          description: 'Format traditionnel sénégalais',
          previewUrl: '/templates/sn-standard.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone', 'address'],
            optionalFields: ['photoUrl', 'description']
          }
        }
      ]
    },
    {
      code: 'MA',
      name: 'Maroc',
      flag: '🇲🇦',
      cvTemplates: [
        {
          id: 'ma-1',
          name: 'CV Marocain Professionnel',
          country: 'MA',
          description: 'Format adapté au marché marocain',
          previewUrl: '/templates/ma-professional.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone', 'address'],
            optionalFields: ['photoUrl', 'description']
          }
        },
        {
          id: 'ma-2',
          name: 'CV Marocain Créatif',
          country: 'MA',
          description: 'Design créatif pour les secteurs artistiques',
          previewUrl: '/templates/ma-creative.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages', 'hobbies'],
            requiredFields: ['fullName', 'email', 'phone'],
            optionalFields: ['photoUrl', 'description', 'address']
          }
        }
      ]
    },
    {
      code: 'TN',
      name: 'Tunisie',
      flag: '🇹🇳',
      cvTemplates: [
        {
          id: 'tn-1',
          name: 'CV Tunisien Standard',
          country: 'TN',
          description: 'Format traditionnel tunisien',
          previewUrl: '/templates/tn-standard.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone', 'address'],
            optionalFields: ['photoUrl', 'description']
          }
        }
      ]
    },
    {
      code: 'GH',
      name: 'Ghana',
      flag: '🇬🇭',
      cvTemplates: [
        {
          id: 'gh-1',
          name: 'CV Ghanéen Professionnel',
          country: 'GH',
          description: 'Format adapté au marché ghanéen',
          previewUrl: '/templates/gh-professional.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone', 'address'],
            optionalFields: ['photoUrl', 'description']
          }
        }
      ]
    },
    {
      code: 'NG',
      name: 'Nigeria',
      flag: '🇳🇬',
      cvTemplates: [
        {
          id: 'ng-1',
          name: 'CV Nigerian Standard',
          country: 'NG',
          description: 'Format standard nigérian',
          previewUrl: '/templates/ng-standard.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone', 'address'],
            optionalFields: ['photoUrl', 'description']
          }
        },
        {
          id: 'ng-2',
          name: 'CV Nigerian Corporate',
          country: 'NG',
          description: 'Format corporate pour les grandes entreprises',
          previewUrl: '/templates/ng-corporate.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone', 'address'],
            optionalFields: ['photoUrl', 'description']
          }
        }
      ]
    },
    {
      code: 'KE',
      name: 'Kenya',
      flag: '🇰🇪',
      cvTemplates: [
        {
          id: 'ke-1',
          name: 'CV Kenyan Professionnel',
          country: 'KE',
          description: 'Format professionnel kenyan',
          previewUrl: '/templates/ke-professional.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone', 'address'],
            optionalFields: ['photoUrl', 'description']
          }
        }
      ]
    },
    {
      code: 'ZA',
      name: 'Afrique du Sud',
      flag: '🇿🇦',
      cvTemplates: [
        {
          id: 'za-1',
          name: 'CV Sud-Africain Standard',
          country: 'ZA',
          description: 'Format standard sud-africain',
          previewUrl: '/templates/za-standard.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone', 'address'],
            optionalFields: ['photoUrl', 'description']
          }
        }
      ]
    },
    {
      code: 'EG',
      name: 'Égypte',
      flag: '🇪🇬',
      cvTemplates: [
        {
          id: 'eg-1',
          name: 'CV Égyptien Standard',
          country: 'EG',
          description: 'Format standard égyptien',
          previewUrl: '/templates/eg-standard.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone', 'address'],
            optionalFields: ['photoUrl', 'description']
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
          id: 'cm-1',
          name: 'CV Camerounais Professionnel',
          country: 'CM',
          description: 'Format adapté au marché camerounais',
          previewUrl: '/templates/cm-professional.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone', 'address'],
            optionalFields: ['photoUrl', 'description']
          }
        }
      ]
    },
    {
      code: 'BF',
      name: 'Burkina Faso',
      flag: '🇧🇫',
      cvTemplates: [
        {
          id: 'bf-1',
          name: 'CV Burkinabé Standard',
          country: 'BF',
          description: 'Format standard burkinabé',
          previewUrl: '/templates/bf-standard.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone', 'address'],
            optionalFields: ['photoUrl', 'description']
          }
        }
      ]
    },
    {
      code: 'ML',
      name: 'Mali',
      flag: '🇲🇱',
      cvTemplates: [
        {
          id: 'ml-1',
          name: 'CV Malien Standard',
          country: 'ML',
          description: 'Format standard malien',
          previewUrl: '/templates/ml-standard.png',
          structure: {
            sections: ['personal', 'experience', 'education', 'skills', 'languages'],
            requiredFields: ['fullName', 'email', 'phone', 'address'],
            optionalFields: ['photoUrl', 'description']
          }
        }
      ]
    }
  ];

  // Utiliser les thèmes prédéfinis de CvThemes.ts
  const themes = predefinedThemes;

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = AuthManager.getCurrentUser();
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  const sections = [
    { id: 'personal', name: 'Informations personnelles', icon: User },
    { id: 'experience', name: 'Expérience professionnelle', icon: Briefcase },
    { id: 'education', name: 'Formation', icon: GraduationCap },
    { id: 'skills', name: 'Compétences', icon: Award },
    { id: 'languages', name: 'Langues', icon: Languages },
    { id: 'hobbies', name: 'Loisirs', icon: Heart }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const cvData = {
        personalDetails,
        experiences,
        educations,
        competences: skills,
        languages,
        hobbies
      };
      
      const result = CvStorageManager.saveCv(cvData);
      
      setSaveMessage({
        type: result.success ? 'success' : 'error',
        text: result.message
      });
      
      // Masquer le message après 3 secondes
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setSaveMessage({
        type: 'error',
        text: 'Erreur lors de la sauvegarde'
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const cvData = {
        personalDetails,
        experiences,
        educations,
        competences: skills,
        languages,
        hobbies
      };
      
      const success = await CvPdfGenerator.downloadPdf(cvData);
      
      setSaveMessage({
        type: success ? 'success' : 'error',
        text: success 
          ? 'CV téléchargé avec succès !' 
          : 'Erreur lors du téléchargement'
      });
      
      // Masquer le message après 3 secondes
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
      setSaveMessage({
        type: 'error',
        text: 'Erreur lors du téléchargement'
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = (theme: CvTheme) => {
    setCustomization(prev => ({
      ...prev,
      theme
    }));
  };

  const renderCountrySelection = () => {
    // Organiser les pays par région
    const regions = {
      'Europe & Amérique du Nord': countries.filter(c => ['FR', 'US', 'CA'].includes(c.code)),
      'Afrique de l\'Ouest': countries.filter(c => ['CI', 'SN', 'GH', 'NG', 'BF', 'ML'].includes(c.code)),
      'Afrique du Nord': countries.filter(c => ['MA', 'TN', 'EG'].includes(c.code)),
      'Afrique Centrale & de l\'Est': countries.filter(c => ['CM', 'KE', 'ZA'].includes(c.code))
    };

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Créez votre CV professionnel
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Choisissez votre pays pour utiliser le format adapté
          </p>
          <p className="text-gray-500">
            Chaque pays a ses propres standards pour les CV
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(regions).map(([regionName, regionCountries]) => (
            <div key={regionName}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-1 h-6 bg-blue-500 rounded mr-3"></span>
                {regionName}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {regionCountries.map((country) => (
                  <div
                    key={country.code}
                    onClick={() => setSelectedCountry(country)}
                    className="group p-6 bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-4 transition-transform group-hover:scale-110">
                        {country.flag}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {country.name}
                      </h3>
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <p className="text-sm text-gray-600">
                          {country.cvTemplates?.length} modèle{(country.cvTemplates?.length || 0) > 1 ? 's' : ''}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Format local adapté
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Section d'information */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pourquoi choisir le bon format ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Standards locaux</h4>
                <p className="text-gray-600 text-sm">
                  Chaque pays a ses propres attentes en matière de CV (photo, format, sections)
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Marché du travail</h4>
                <p className="text-gray-600 text-sm">
                  Adaptez votre CV aux spécificités du marché de l&apos;emploi de votre région
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Succès garanti</h4>
                <p className="text-gray-600 text-sm">
                  Augmentez vos chances d&apos;être remarqué par les recruteurs locaux
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTemplateSelection = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setSelectedCountry(null)}
          className="btn btn-ghost mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Modèles pour {selectedCountry?.name} {selectedCountry?.flag}
          </h1>
          <p className="text-gray-600">Choisissez le modèle qui vous convient</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedCountry?.cvTemplates?.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <div className="text-center p-4">
                <Layout className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Aperçu du modèle</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {template.structure.sections.map((section) => (
                  <span
                    key={section}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCvBuilder = () => (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-ghost btn-sm"
                title="Retour au tableau de bord"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </button>
              <div className="divider divider-horizontal"></div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="btn btn-ghost btn-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Pays
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreviewModal(true)}
                className="btn btn-outline btn-sm"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowCustomization(!showCustomization)}
                className={`btn btn-sm ${showCustomization ? 'btn-primary' : 'btn-outline'}`}
              >
                <Palette className="w-4 h-4" />
              </button>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {selectedTemplate?.name}
          </h2>
          <p className="text-sm text-gray-600">{selectedTemplate?.description}</p>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{section.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="space-y-2">
            <button 
              onClick={handleSave} 
              className={`btn btn-outline btn-block ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {!isLoading && <Save className="w-4 h-4 mr-2" />}
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button 
              onClick={handleDownload} 
              className={`btn btn-primary btn-block ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {!isLoading && <Download className="w-4 h-4 mr-2" />}
              {isLoading ? 'Téléchargement...' : 'Télécharger PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Messages de notification */}
      {saveMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`alert ${saveMessage.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`}>
            <div>
              {saveMessage.type === 'success' ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
              <span>{saveMessage.text}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Form Area */}
        <div className="w-full p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Personnalisation Avancée avec Panneau */}
            {showCustomization && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Aperçu des Thèmes</h3>
                  <button
                    onClick={() => setShowAdvancedCustomization(true)}
                    className="btn btn-primary btn-sm"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Personnalisation Avancée
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {themes.slice(0, 4).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        customization.theme.id === theme.id
                          ? 'border-primary bg-primary/10'
                          : 'border-base-300 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex gap-1 mb-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: theme.preview }}
                        />
                      </div>
                      <p className="text-xs font-medium">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form Content */}
            <div className="bg-white rounded-lg shadow p-6">
              {activeSection === 'personal' && (
                <PersonalDetailForm
                  personalDetails={personalDetails}
                  setPersonalDetails={setPersonalDetails}
                  setFile={() => {}}
                />
              )}
              {activeSection === 'experience' && (
                <ExperienceForm
                  experience={experiences}
                  setExperience={setExperiences}
                />
              )}
              {activeSection === 'education' && (
                <EducationForm
                  education={educations}
                  setEducation={setEducations}
                />
              )}
              {activeSection === 'skills' && (
                <SkillForm
                  skills={skills}
                  setSkills={setSkills}
                />
              )}
              {activeSection === 'languages' && (
                <LanguagesForm
                  language={languages}
                  setLanguage={setLanguages}
                />
              )}
              {activeSection === 'hobbies' && (
                <HobbieForm
                  hobie={hobbies}
                  sethobie={setHobbies}
                />
              )}
            </div>
          </div>
        </div>

        {/* Preview Area - Supprimé car remplacé par modal */}
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!selectedCountry) {
    return renderCountrySelection();
  }

  if (!selectedTemplate) {
    return renderTemplateSelection();
  }

  return (
    <>
      {renderCvBuilder()}
      
      {/* Modal de Prévisualisation */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Aperçu du CV - {personalDetails.fullName || 'Votre nom'}
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div id="cv-preview-container" className="bg-white">
                <CvPreview
                  personalDetails={personalDetails}
                  experiences={experiences}
                  educations={educations}
                  skills={skills}
                  languages={languages}
                  hobbies={hobbies}
                  customization={customization}
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="btn btn-ghost"
              >
                Fermer
              </button>
              <button
                onClick={handleDownload}
                className="btn btn-primary"
                disabled={isLoading}
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Panneau de Personnalisation Avancé */}
      {showAdvancedCustomization && (
        <CvCustomizationPanel
          customization={customization}
          onCustomizationChange={setCustomization}
          onClose={() => setShowAdvancedCustomization(false)}
        />
      )}
    </>
  );
}
