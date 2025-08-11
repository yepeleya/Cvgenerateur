'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Download, Save, Palette, ArrowLeft, User } from 'lucide-react';
import {
  PersonalDetails,
  Experience,
  Education,
  Skill,
  Language,
  Hobby,
  CvTemplate,
  CvCustomization,
} from '@/type';
import { predefinedThemes } from '@/app/utils/CvThemes';
import PersonalDetailForm from '@/app/components/PersonalDetailForm';
import ExperienceForm from '@/app/components/ExperienceForm';
import EducationForm from '@/app/components/EducationForm';
import LanguagesForm from '@/app/components/LanguagesForm';
import HobbieForm from '@/app/components/HobbieForm';
import SkillForm from '@/app/components/SkillForm';
import CvPreview from '@/app/components/CvPreview';
import CvCustomizationPanel from '@/app/components/CvCustomizationPanel';

// Liste des pays et templates (exemple simplifié)
const countries = [
  { code: 'FR', name: 'France', flag: '🇫🇷', templates: [
    { id: 'fr-1', name: 'Classique', description: 'CV classique français' },
    { id: 'fr-2', name: 'Moderne', description: 'CV moderne français' },
  ]},
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', templates: [
    { id: 'us-1', name: 'Standard', description: 'US Resume' },
  ]},
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', templates: [
    { id: 'ci-1', name: 'Professionnel', description: 'CV ivoirien pro' },
  ]},
  { code: 'CA', name: 'Canada', flag: '🇨🇦', templates: [
    { id: 'ca-1', name: 'Bilingue', description: 'CV canadien bilingue' },
  ]},
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', templates: [
    { id: 'sn-1', name: 'Standard', description: 'CV sénégalais standard' },
  ]},
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', templates: [
    { id: 'ma-1', name: 'Professionnel', description: 'CV marocain pro' },
  ]},
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', templates: [
    { id: 'tn-1', name: 'Standard', description: 'CV tunisien standard' },
  ]},
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', templates: [
    { id: 'gh-1', name: 'Professionnel', description: 'CV ghanéen pro' },
  ]},
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', templates: [
    { id: 'ng-1', name: 'Standard', description: 'CV nigérian standard' },
  ]},
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', templates: [
    { id: 'ke-1', name: 'Professionnel', description: 'CV kenyan pro' },
  ]},
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', templates: [
    { id: 'za-1', name: 'Standard', description: 'CV sud-africain standard' },
  ]},
  { code: 'EG', name: 'Égypte', flag: '🇪🇬', templates: [
    { id: 'eg-1', name: 'Standard', description: 'CV égyptien standard' },
  ]},
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', templates: [
    { id: 'cm-1', name: 'Professionnel', description: 'CV camerounais pro' },
  ]},
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', templates: [
    { id: 'bf-1', name: 'Standard', description: 'CV burkinabé standard' },
  ]},
  { code: 'ML', name: 'Mali', flag: '🇲🇱', templates: [
    { id: 'ml-1', name: 'Standard', description: 'CV malien standard' },
  ]},
];

export default function CvProPage() {
  const router = useRouter();
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({ fullName: '', email: '', phone: '', address: '', photoUrl: '', postSeeking: '', description: '' });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CvTemplate | null>(null);
  const [customization, setCustomization] = useState<CvCustomization>(predefinedThemes[0]);

  const handleSave = () => {
    const cvData = {
      personalDetails,
      experiences,
      education,
      skills,
      languages,
      hobbies,
      template: selectedTemplate,
      customization,
    };
    // Ici tu peux sauvegarder dans le localStorage ou via une API
    localStorage.setItem('cv-pro-data', JSON.stringify(cvData));
    alert('Votre CV a été sauvegardé !');
  };

  const [showPreview, setShowPreview] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleCustomization = () => {
    setShowCustomization(true);
  };

  const handleClosePreview = () => setShowPreview(false);
  const handleCloseCustomization = () => setShowCustomization(false);
      {/* Aperçu du CV en modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto relative">
            <button onClick={handleClosePreview} className="absolute top-2 right-2 btn btn-ghost btn-sm">✕</button>
            <div id="cv-preview-container" className="p-6">
              <CvPreview
                personalDetails={personalDetails}
                experiences={experiences}
                educations={education}
                skills={skills}
                languages={languages}
                hobbies={hobbies}
                customization={customization}
                selectedCountry={countries.find(c => c.code === selectedCountry) || null}
                selectedTemplate={selectedTemplate}
              />
            </div>
          </div>
        </div>
      )}

      {/* Panneau de personnalisation avancée */}
      {showCustomization && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto relative">
            <button onClick={handleCloseCustomization} className="absolute top-2 right-2 btn btn-ghost btn-sm">✕</button>
            <CvCustomizationPanel
              customization={customization}
              onCustomizationChange={setCustomization}
              onClose={handleCloseCustomization}
            />
          </div>
        </div>
      )}

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Générer une URL temporaire pour l'aperçu du CV (doit exister dans le DOM)
      const url = window.location.origin + window.location.pathname + '?pdf=1';
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, darkMode: false })
      });
      if (!response.ok) throw new Error('Erreur lors de la génération du PDF');
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'cv.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('Erreur lors du téléchargement du PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  // Liste des pays et templates (exemple simplifié)
  const countries = [
    { code: 'FR', name: 'France', flag: '🇫🇷', templates: [
      { id: 'fr-1', name: 'Classique', description: 'CV classique français' },
      { id: 'fr-2', name: 'Moderne', description: 'CV moderne français' },
    ]},
    { code: 'US', name: 'États-Unis', flag: '🇺🇸', templates: [
      { id: 'us-1', name: 'Standard', description: 'US Resume' },
    ]},
    { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', templates: [
      { id: 'ci-1', name: 'Professionnel', description: 'CV ivoirien pro' },
    ]},
    { code: 'CA', name: 'Canada', flag: '🇨🇦', templates: [
      { id: 'ca-1', name: 'Bilingue', description: 'CV canadien bilingue' },
    ]},
    { code: 'SN', name: 'Sénégal', flag: '🇸🇳', templates: [
      { id: 'sn-1', name: 'Standard', description: 'CV sénégalais standard' },
    ]},
    { code: 'MA', name: 'Maroc', flag: '🇲🇦', templates: [
      { id: 'ma-1', name: 'Professionnel', description: 'CV marocain pro' },
    ]},
    { code: 'TN', name: 'Tunisie', flag: '🇹🇳', templates: [
      { id: 'tn-1', name: 'Standard', description: 'CV tunisien standard' },
    ]},
    { code: 'GH', name: 'Ghana', flag: '🇬🇭', templates: [
      { id: 'gh-1', name: 'Professionnel', description: 'CV ghanéen pro' },
    ]},
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', templates: [
      { id: 'ng-1', name: 'Standard', description: 'CV nigérian standard' },
    ]},
    { code: 'KE', name: 'Kenya', flag: '🇰🇪', templates: [
      { id: 'ke-1', name: 'Professionnel', description: 'CV kenyan pro' },
    ]},
    { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', templates: [
      { id: 'za-1', name: 'Standard', description: 'CV sud-africain standard' },
    ]},
    { code: 'EG', name: 'Égypte', flag: '🇪🇬', templates: [
      { id: 'eg-1', name: 'Standard', description: 'CV égyptien standard' },
    ]},
    { code: 'CM', name: 'Cameroun', flag: '🇨🇲', templates: [
      { id: 'cm-1', name: 'Professionnel', description: 'CV camerounais pro' },
    ]},
    { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', templates: [
      { id: 'bf-1', name: 'Standard', description: 'CV burkinabé standard' },
    ]},
    { code: 'ML', name: 'Mali', flag: '🇲🇱', templates: [
      { id: 'ml-1', name: 'Standard', description: 'CV malien standard' },
    ]},
  ];

  // Sélection du pays
  if (!selectedCountry) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="w-full max-w-5xl p-8">
          <h1 className="text-4xl font-bold mb-10 text-center text-blue-700 drop-shadow-lg">Choisissez un pays</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {countries.map((country, idx) => (
              <button
                key={country.code}
                onClick={() => setSelectedCountry(country.code)}
                className="group relative bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border-2 border-transparent hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
                style={{ animation: `fadeInUp 0.5s ${0.05 * idx}s both` }}
              >
                <span className="text-6xl mb-4 transition-transform group-hover:scale-125">{country.flag}</span>
                <span className="text-xl font-bold text-blue-800 mb-2">{country.name}</span>
                <span className="text-xs text-gray-500 mb-2">{country.templates.length} modèle{country.templates.length > 1 ? 's' : ''}</span>
                <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-all"></span>
              </button>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // Sélection du template
  const countryObj = countries.find(c => c.code === selectedCountry);
  if (!selectedTemplate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-lg">
          <button
            className="mb-6 text-blue-600 hover:underline flex items-center gap-2"
            onClick={() => setSelectedCountry(null)}
          >
            <ArrowLeft /> Retour pays
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">Choisissez un modèle</h2>
          <div className="grid gap-4">
            {countryObj?.templates.map((tpl) => (
              <button
                key={tpl.id}
                className="w-full py-3 rounded-lg border-2 border-purple-200 hover:border-purple-500 bg-purple-50 hover:bg-purple-100 text-lg font-semibold transition"
                onClick={() => setSelectedTemplate(tpl)}
              >
                <div className="flex flex-col items-start">
                  <span className="text-lg">{tpl.name}</span>
                  <span className="text-xs text-gray-500">{tpl.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Affichage du builder principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
      {/* Header sticky avec actions */}
      <header className="sticky top-0 z-20 bg-white/90 shadow-md py-4 px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            className="flex items-center gap-2 text-blue-600 hover:text-blue-900 font-semibold"
            onClick={() => {
              if (window.history.length > 1) router.back();
              else setSelectedTemplate(null);
            }}
          >
            <ArrowLeft /> Retour
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-purple-700">
            <User /> CV Pro
          </h1>
          <span className="text-sm text-gray-500">{countryObj?.name} - {selectedTemplate?.name}</span>
        </div>
        <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-800 transition"
          >
            <Save size={18} /> Sauvegarder
          </button>
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition"
          >
            <Eye size={18} /> Aperçu
          </button>
          <button
            onClick={handleCustomization}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-semibold shadow hover:from-purple-600 hover:to-purple-800 transition"
          >
            <Palette size={18} /> Personnaliser
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-semibold shadow hover:from-gray-800 hover:to-black transition disabled:opacity-60"
          >
            <Download size={18} /> {isDownloading ? 'Téléchargement...' : 'Télécharger'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-8 max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <section className="grid gap-6">
            <PersonalDetailForm 
              personalDetails={personalDetails}
              setPersonalDetails={setPersonalDetails}
              setFile={() => {}}
            />
            <ExperienceForm onChange={setExperiences} />
            <EducationForm onChange={setEducation} />
            <LanguagesForm onChange={setLanguages} />
            <HobbieForm onChange={setHobbies} />
            <SkillForm skills={skills} setSkills={setSkills} />
          </section>
        </div>
      </main>
    </div>
  );
}
