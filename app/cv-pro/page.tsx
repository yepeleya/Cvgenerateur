'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, Download, Save, Palette, ArrowLeft, User } from 'lucide-react';

/* ==== Types ==== */
interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  photoUrl: string;
  postSeeking: string;
  description: string;
}
interface Experience { title: string; company: string; years: string; }
interface Education { degree: string; school: string; years: string; }
interface Skill { name: string; level: string; }
interface Language { name: string; level: string; }
interface Hobby { name: string; }
interface CvTemplate {
  id: string;
  name: string;
  description: string;
  country?: string;
  previewUrl?: string;
  hasPhoto?: boolean;
  structure?: {
    sections: string[];
    requiredFields: string[];
    optionalFields: string[];
  };
}
interface CvCustomization { themeName: string; colors: { primary: string; secondary: string }; }

/* ==== Données par défaut ==== */
const predefinedThemes: CvCustomization[] = [
  { themeName: 'Classique', colors: { primary: '#000000', secondary: '#555555' } }
];

/* ==== Composants factices ==== */
const PersonalDetailForm = ({ personalDetails, setPersonalDetails }: any) => (
  <div className="p-4 border rounded">
    <h3 className="font-bold mb-2">Détails personnels</h3>
    <input
      className="border p-2 w-full mb-2"
      placeholder="Nom complet"
      value={personalDetails.fullName}
      onChange={(e) => setPersonalDetails({ ...personalDetails, fullName: e.target.value })}
    />
    <input
      className="border p-2 w-full mb-2"
      placeholder="Email"
      value={personalDetails.email}
      onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
    />
  </div>
);
const ExperienceForm = ({ onChange }: any) => (
  <div className="p-4 border rounded"><h3 className="font-bold mb-2">Expériences</h3><button onClick={() => onChange([{ title: 'Développeur', company: 'OpenAI', years: '2022-2025' }])}>Ajouter exemple</button></div>
);
const EducationForm = ({ onChange }: any) => (
  <div className="p-4 border rounded"><h3 className="font-bold mb-2">Éducation</h3><button onClick={() => onChange([{ degree: 'Licence', school: 'Université', years: '2019-2022' }])}>Ajouter exemple</button></div>
);
const LanguagesForm = ({ onChange }: any) => (
  <div className="p-4 border rounded"><h3 className="font-bold mb-2">Langues</h3><button onClick={() => onChange([{ name: 'Français', level: 'C2' }])}>Ajouter exemple</button></div>
);
const HobbieForm = ({ onChange }: any) => (
  <div className="p-4 border rounded"><h3 className="font-bold mb-2">Loisirs</h3><button onClick={() => onChange([{ name: 'Lecture' }])}>Ajouter exemple</button></div>
);
const SkillForm = ({ skills, setSkills }: any) => (
  <div className="p-4 border rounded"><h3 className="font-bold mb-2">Compétences</h3><button onClick={() => setSkills([...skills, { name: 'JavaScript', level: 'Expert' }])}>Ajouter exemple</button></div>
);
const CvPreview = ({ personalDetails, selectedTemplate, experiences, education, skills, languages, hobbies }: any) => {
  // Rendu dynamique selon le template choisi (exemple : couleurs/disposition par pays)
  const structure = selectedTemplate?.structure;
  const country = selectedTemplate?.country;
  // Exemples de styles par pays (à enrichir)
  const countryStyles: any = {
    'FR': { bg: 'from-white to-blue-50', accent: 'text-blue-700', border: 'border-blue-200' },
    'US': { bg: 'from-white to-red-50', accent: 'text-red-700', border: 'border-red-200' },
    'MA': { bg: 'from-white to-orange-50', accent: 'text-orange-700', border: 'border-orange-200' },
    'CI': { bg: 'from-white to-green-50', accent: 'text-green-700', border: 'border-green-200' },
    // ...
  };
  const style = countryStyles[country] || { bg: 'from-white to-purple-50', accent: 'text-purple-700', border: 'border-purple-200' };
  return (
    <div className={`p-4 min-h-[400px]`}>
      <div className={`bg-gradient-to-br ${style.bg} rounded-2xl shadow-xl p-6 max-w-md mx-auto border ${style.border}`}>
        {selectedTemplate?.hasPhoto && personalDetails.photoUrl && (
          <div className="flex justify-center mb-4">
            <Image src={personalDetails.photoUrl} alt="Photo" width={112} height={112} className="w-28 h-28 object-cover rounded-full border-4 shadow" />
          </div>
        )}
        <h2 className={`text-2xl font-extrabold ${style.accent} mb-1 text-center`}>{personalDetails.fullName || <span className='text-gray-400'>Nom Prénom</span>}</h2>
        {structure?.requiredFields.includes('postSeeking') && personalDetails.postSeeking && <div className="text-center text-blue-700 font-semibold mb-2">{personalDetails.postSeeking}</div>}
        {structure?.requiredFields.includes('email') && (
          <div className="text-center text-gray-600 text-sm mb-2">{personalDetails.email || <span className='text-gray-300'>Email</span>} {personalDetails.phone && <>| {personalDetails.phone}</>}</div>
        )}
        {structure?.optionalFields.includes('address') && personalDetails.address && <div className="text-center text-gray-400 text-xs mb-2">{personalDetails.address}</div>}
        {structure?.optionalFields.includes('description') && personalDetails.description && <div className="italic text-center text-gray-500 mb-4">{personalDetails.description}</div>}
        {/* Sections dynamiques */}
        {structure?.sections.includes('experience') && experiences && experiences.length > 0 && (
          <div className="mb-4">
            <h3 className={`font-bold ${style.accent} mb-1`}>Expériences</h3>
            <ul className="space-y-1">
              {experiences.map((exp: any, i: number) => (
                <li key={i} className="text-sm flex flex-col">
                  <span className="font-semibold">{exp.title || <span className='text-gray-300'>Poste</span>}</span>
                  <span className="text-gray-500">{exp.company || <span className='text-gray-300'>Entreprise</span>} {exp.start && exp.end && <>({exp.start} - {exp.end})</>}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {structure?.sections.includes('education') && education && education.length > 0 && (
          <div className="mb-4">
            <h3 className={`font-bold ${style.accent} mb-1`}>Éducation</h3>
            <ul className="space-y-1">
              {education.map((ed: any, i: number) => (
                <li key={i} className="text-sm flex flex-col">
                  <span className="font-semibold">{ed.degree || <span className='text-gray-300'>Diplôme</span>}</span>
                  <span className="text-gray-500">{ed.school || <span className='text-gray-300'>École</span>} {ed.start && ed.end && <>({ed.start} - {ed.end})</>}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {structure?.sections.includes('skills') && skills && skills.length > 0 && (
          <div className="mb-4">
            <h3 className={`font-bold ${style.accent} mb-1`}>Compétences</h3>
            <ul className="flex flex-wrap gap-2">
              {skills.map((sk: any, i: number) => (
                <li key={i} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  {sk.name || <span className='text-gray-300'>Compétence</span>}
                  {sk.level && (
                    <span className="ml-1">
                      {sk.level === 'Débutant' && '★☆☆☆'}
                      {sk.level === 'Intermédiaire' && '★★☆☆'}
                      {sk.level === 'Avancé' && '★★★☆'}
                      {sk.level === 'Expert' && '★★★★'}
                      <span className="ml-1 text-gray-400 text-xs">{sk.level}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {structure?.sections.includes('languages') && languages && languages.length > 0 && (
          <div className="mb-4">
            <h3 className={`font-bold ${style.accent} mb-1`}>Langues</h3>
            <ul className="flex flex-wrap gap-2">
              {languages.map((lg: any, i: number) => (
                <li key={i} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">{lg.name || <span className='text-gray-300'>Langue</span>} {lg.level && <span className="text-gray-400">({lg.level})</span>}</li>
              ))}
            </ul>
          </div>
        )}
        {structure?.sections.includes('hobbies') && hobbies && hobbies.length > 0 && (
          <div className="mb-2">
            <h3 className={`font-bold ${style.accent} mb-1`}>Loisirs</h3>
            <ul className="flex flex-wrap gap-2">
              {hobbies.map((hb: any, i: number) => (
                <li key={i} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">{hb.name || <span className='text-gray-300'>Loisir</span>}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
const CvCustomizationPanel = ({ customization, onCustomizationChange }: any) => (
  <div className="p-4"><h3>Personnaliser</h3>
    <input
      type="color"
      value={customization.colors.primary}
      onChange={(e) => onCustomizationChange({ ...customization, colors: { ...customization.colors, primary: e.target.value } })}
    />
  </div>
);

/* ==== Liste pays ==== */
const countries = [
  { code: 'FR', name: 'France', flag: '🇫🇷', templates: [
    { id: 'fr-1', name: 'Classique', description: 'CV classique français', hasPhoto: true, structure: { sections: ['personal', 'experience', 'education', 'skills', 'languages', 'hobbies'], requiredFields: ['fullName', 'email'], optionalFields: ['photoUrl', 'description', 'phone', 'address'] } },
    { id: 'fr-2', name: 'Moderne', description: 'CV moderne français', hasPhoto: false, structure: { sections: ['personal', 'experience', 'education', 'skills'], requiredFields: ['fullName', 'email'], optionalFields: ['description', 'phone', 'address'] } },
  ]},
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', templates: [
    { id: 'us-1', name: 'Standard', description: 'US Resume (sobre, efficace)' },
    { id: 'us-2', name: 'Créatif', description: 'Resume créatif américain' },
  ]},
  { code: 'CA', name: 'Canada', flag: '🇨🇦', templates: [
    { id: 'ca-1', name: 'Bilingue', description: 'CV bilingue (FR/EN)' },
    { id: 'ca-2', name: 'Professionnel', description: 'CV canadien professionnel' },
  ]},
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', templates: [
    { id: 'ci-1', name: 'Professionnel', description: 'CV ivoirien pro' },
    { id: 'ci-2', name: 'Jeune diplômé', description: 'CV pour jeunes diplômés' },
  ]},
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', templates: [
    { id: 'sn-1', name: 'Standard', description: 'CV sénégalais standard' },
    { id: 'sn-2', name: 'Moderne', description: 'CV moderne Sénégal' },
  ]},
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', templates: [
    { id: 'ma-1', name: 'Professionnel', description: 'CV marocain pro' },
    { id: 'ma-2', name: 'Jeune diplômé', description: 'CV jeune diplômé Maroc' },
  ]},
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', templates: [
    { id: 'tn-1', name: 'Standard', description: 'CV tunisien standard' },
    { id: 'tn-2', name: 'Moderne', description: 'CV moderne Tunisie' },
  ]},
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', templates: [
    { id: 'gh-1', name: 'Professionnel', description: 'CV ghanéen pro' },
    { id: 'gh-2', name: 'Jeune diplômé', description: 'CV jeune diplômé Ghana' },
  ]},
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', templates: [
    { id: 'ng-1', name: 'Standard', description: 'CV nigérian standard' },
    { id: 'ng-2', name: 'Créatif', description: 'CV créatif Nigeria' },
  ]},
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', templates: [
    { id: 'ke-1', name: 'Professionnel', description: 'CV kenyan pro' },
    { id: 'ke-2', name: 'Moderne', description: 'CV moderne Kenya' },
  ]},
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', templates: [
    { id: 'za-1', name: 'Standard', description: 'CV sud-africain standard' },
    { id: 'za-2', name: 'Créatif', description: 'CV créatif Afrique du Sud' },
  ]},
  { code: 'EG', name: 'Égypte', flag: '🇪🇬', templates: [
    { id: 'eg-1', name: 'Standard', description: 'CV égyptien standard' },
    { id: 'eg-2', name: 'Moderne', description: 'CV moderne Égypte' },
  ]},
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', templates: [
    { id: 'cm-1', name: 'Professionnel', description: 'CV camerounais pro' },
    { id: 'cm-2', name: 'Jeune diplômé', description: 'CV jeune diplômé Cameroun' },
  ]},
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', templates: [
    { id: 'bf-1', name: 'Standard', description: 'CV burkinabé standard' },
    { id: 'bf-2', name: 'Moderne', description: 'CV moderne Burkina' },
  ]},
  { code: 'ML', name: 'Mali', flag: '🇲🇱', templates: [
    { id: 'ml-1', name: 'Standard', description: 'CV malien standard' },
    { id: 'ml-2', name: 'Jeune diplômé', description: 'CV jeune diplômé Mali' },
  ]},
];

/* ==== Page principale ==== */

export default function CvProPage() {
  const router = useRouter();
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    fullName: '', email: '', phone: '', address: '', photoUrl: '', postSeeking: '', description: ''
  });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CvTemplate | null>(null);
  const [customization, setCustomization] = useState<CvCustomization>(predefinedThemes[0]);
  const [showPreview, setShowPreview] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  // Stepper state
  const steps = [
    { label: 'Infos', key: 'personal' },
    { label: 'Expériences', key: 'experience' },
    { label: 'Éducation', key: 'education' },
    { label: 'Compétences', key: 'skills' },
    { label: 'Langues', key: 'languages' },
    { label: 'Loisirs', key: 'hobbies' },
    { label: 'Résumé', key: 'summary' },
  ];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setSelectedCountry(null);
    setSelectedTemplate(null);
    setPersonalDetails({ fullName: '', email: '', phone: '', address: '', photoUrl: '', postSeeking: '', description: '' });
    setExperiences([]);
    setEducation([]);
    setSkills([]);
    setLanguages([]);
    setHobbies([]);
    setCustomization(predefinedThemes[0]);
    setCurrentStep(0);
  }, []);

  // Validation avancée par étape
  const validateStep = () => {
    if (currentStep === 0) {
      if (!personalDetails.fullName || !personalDetails.email) return 'Nom et email obligatoires';
      if (selectedTemplate?.hasPhoto && !personalDetails.photoUrl) return 'Photo obligatoire pour ce modèle';
    }
    if (currentStep === 1 && experiences.length === 0) return 'Ajoutez au moins une expérience';
    if (currentStep === 2 && education.length === 0) return 'Ajoutez au moins une formation';
    if (currentStep === 3 && skills.length === 0) return 'Ajoutez au moins une compétence';
    if (currentStep === 4 && languages.length === 0) return 'Ajoutez au moins une langue';
    // Loisirs non obligatoires
    return null;
  };
  const stepError = validateStep();

  const handleSave = () => {
    const cvData = { personalDetails, experiences, education, skills, languages, hobbies, template: selectedTemplate, customization };
    localStorage.setItem('cv-pro-data', JSON.stringify(cvData));
    alert('CV sauvegardé !');
  };

  const handleDownload = async () => {
    try {
      const currentUrl = window.location.href;
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: currentUrl,
          darkMode: document.documentElement.classList.contains("dark"),
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la génération du PDF");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "cv.pdf";
      link.click();
    } catch (error) {
      console.error(error);
      alert("Impossible de télécharger le PDF.");
    }
  };

  /* === Sélection pays === */
  if (!selectedCountry) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-8">
        <h1 className="text-4xl font-extrabold mb-10 text-blue-700 drop-shadow-lg">Choisissez un pays</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-5xl">
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCountry(c.code)}
              className="group p-6 bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-blue-400 hover:shadow-2xl hover:scale-105 transition-all duration-200 flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <span className="text-6xl mb-2 group-hover:animate-bounce">{c.flag}</span>
              <p className="font-bold text-lg text-gray-800 group-hover:text-blue-700">{c.name}</p>
              <span className="text-xs text-gray-400">{c.templates.length} modèles</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* === Sélection modèle === */
  const countryObj = countries.find(c => c.code === selectedCountry);
  if (!selectedTemplate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-8">
        <button onClick={() => setSelectedCountry(null)} className="mb-6 text-blue-600 flex items-center gap-2"><ArrowLeft /> Retour pays</button>
        <h2 className="text-3xl font-extrabold mb-8 text-purple-700">Choisissez un modèle</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl">
          {countryObj?.templates.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate({ ...tpl, country: countryObj.code })}
              className="group p-6 bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-purple-400 hover:shadow-2xl hover:scale-105 transition-all duration-200 flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <span className="text-2xl font-bold text-gray-800 group-hover:text-purple-700">{tpl.name}</span>
              <span className="text-sm text-gray-500 mb-2 text-center">{tpl.description}</span>
              {tpl.hasPhoto && <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Inclut photo</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* === Builder avec stepper === */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-md py-4 px-8 flex flex-wrap justify-between gap-4 border-b border-purple-100">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedTemplate(null)} className="text-blue-600 flex items-center gap-2 font-semibold hover:underline"><ArrowLeft /> Retour</button>
          <h1 className="font-extrabold text-2xl text-purple-700 flex items-center gap-2 tracking-tight drop-shadow"><User /> Générateur de CV</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full shadow flex items-center gap-2 font-semibold transition"><Save size={18} /> Sauvegarder</button>
          <button onClick={() => setShowPreview(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full shadow flex items-center gap-2 font-semibold transition"><Eye size={18} /> Aperçu</button>
          <button onClick={() => setShowCustomization(true)} className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-full shadow flex items-center gap-2 font-semibold transition"><Palette size={18} /> Personnaliser</button>
          <button onClick={handleDownload} className="bg-gray-900 hover:bg-gray-700 text-white px-5 py-2 rounded-full shadow flex items-center gap-2 font-semibold transition"><Download size={18} /> Télécharger</button>
        </div>
      </header>

      {/* Stepper */}
      <div className="flex justify-center mt-8 mb-4">
        <div className="flex gap-4">
          {steps.map((step, idx) => (
            <div key={step.key} className="flex flex-col items-center">
              <button
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all duration-200 ${currentStep === idx ? 'bg-purple-600 text-white border-purple-600 scale-110 shadow-lg' : 'bg-white text-purple-600 border-purple-300'} ${idx < currentStep ? 'ring-2 ring-green-400' : ''}`}
                onClick={() => setCurrentStep(idx)}
                disabled={idx > currentStep + 1}
                aria-label={step.label}
              >{idx + 1}</button>
              <span className={`mt-2 text-xs font-semibold ${currentStep === idx ? 'text-purple-700' : 'text-gray-400'}`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <main className="flex flex-col lg:flex-row gap-8 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* Formulaire principal par étape */}
        <section className="flex-1 bg-white/90 rounded-3xl shadow-2xl p-8 space-y-8 border border-purple-100 animate-fade-in">
          {currentStep === 0 && (
            <>
              <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2"><User /> Informations personnelles</h2>
              {selectedTemplate?.hasPhoto && (
                <div className="mb-4">
                  <label className="block font-semibold mb-2">Photo de profil</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setPersonalDetails(pd => ({ ...pd, photoUrl: ev.target?.result as string }));
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full border rounded p-2 bg-gray-50 focus:ring-2 focus:ring-purple-300"
                  />
                  {personalDetails.photoUrl && (
                    <div className="mt-2 flex items-center gap-4">
                      <Image src={personalDetails.photoUrl} alt="Aperçu" width={96} height={96} className="w-24 h-24 object-cover rounded-full border shadow" />
                      <button onClick={() => setPersonalDetails(pd => ({ ...pd, photoUrl: '' }))} className="text-red-500 text-xs underline">Supprimer</button>
                    </div>
                  )}
                </div>
              )}
              <PersonalDetailForm personalDetails={personalDetails} setPersonalDetails={setPersonalDetails} />
            </>
          )}
          {currentStep === 1 && (
            <>
              <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2"><Save /> Expériences</h2>
              {/* Expériences dynamiques modernisées */}
              {experiences.map((exp, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2 flex-wrap">
                  <div className="relative flex-1 min-w-[120px]">
                    <input className="peer border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent w-full py-2 px-1 transition" placeholder=" " value={exp.title} onChange={e => setExperiences(exps => exps.map((ex, i) => i === idx ? { ...ex, title: e.target.value } : ex))} />
                    <label className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm">Poste</label>
                  </div>
                  <div className="relative flex-1 min-w-[120px]">
                    <input className="peer border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent w-full py-2 px-1 transition" placeholder=" " value={exp.company} onChange={e => setExperiences(exps => exps.map((ex, i) => i === idx ? { ...ex, company: e.target.value } : ex))} />
                    <label className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm">Entreprise</label>
                  </div>
                  <div className="relative w-32">
                    <input type="month" className="peer border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent w-full py-2 px-1 transition" placeholder=" " value={exp.start || ''} onChange={e => setExperiences(exps => exps.map((ex, i) => i === idx ? { ...ex, start: e.target.value } : ex))} />
                    <label className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs">Début</label>
                  </div>
                  <div className="relative w-32">
                    <input type="month" className="peer border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent w-full py-2 px-1 transition" placeholder=" " value={exp.end || ''} onChange={e => setExperiences(exps => exps.map((ex, i) => i === idx ? { ...ex, end: e.target.value } : ex))} />
                    <label className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs">Fin</label>
                  </div>
                  <button onClick={() => setExperiences(exps => exps.filter((_, i) => i !== idx))} className="text-red-500 font-bold">✕</button>
                </div>
              ))}
              <button onClick={() => setExperiences(exps => [...exps, { title: '', company: '', start: '', end: '' }])} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">+ Ajouter une expérience</button>
            </>
          )}
          {currentStep === 2 && (
            <>
              <h2 className="text-2xl font-bold text-pink-700 mb-6 flex items-center gap-2"><Palette /> Éducation</h2>
              {education.map((ed, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2 flex-wrap">
                  <div className="relative flex-1 min-w-[120px]">
                    <input className="peer border-b-2 border-gray-300 focus:border-pink-500 outline-none bg-transparent w-full py-2 px-1 transition" placeholder=" " value={ed.degree} onChange={e => setEducation(eds => eds.map((ed2, i) => i === idx ? { ...ed2, degree: e.target.value } : ed2))} />
                    <label className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm">Diplôme</label>
                  </div>
                  <div className="relative flex-1 min-w-[120px]">
                    <input className="peer border-b-2 border-gray-300 focus:border-pink-500 outline-none bg-transparent w-full py-2 px-1 transition" placeholder=" " value={ed.school} onChange={e => setEducation(eds => eds.map((ed2, i) => i === idx ? { ...ed2, school: e.target.value } : ed2))} />
                    <label className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm">École</label>
                  </div>
                  <div className="relative w-32">
                    <input type="month" className="peer border-b-2 border-gray-300 focus:border-pink-500 outline-none bg-transparent w-full py-2 px-1 transition" placeholder=" " value={ed.start || ''} onChange={e => setEducation(eds => eds.map((ed2, i) => i === idx ? { ...ed2, start: e.target.value } : ed2))} />
                    <label className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs">Début</label>
                  </div>
                  <div className="relative w-32">
                    <input type="month" className="peer border-b-2 border-gray-300 focus:border-pink-500 outline-none bg-transparent w-full py-2 px-1 transition" placeholder=" " value={ed.end || ''} onChange={e => setEducation(eds => eds.map((ed2, i) => i === idx ? { ...ed2, end: e.target.value } : ed2))} />
                    <label className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs">Fin</label>
                  </div>
                  <button onClick={() => setEducation(eds => eds.filter((_, i) => i !== idx))} className="text-red-500 font-bold">✕</button>
                </div>
              ))}
              <button onClick={() => setEducation(eds => [...eds, { degree: '', school: '', start: '', end: '' }])} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">+ Ajouter une formation</button>
            </>
          )}
          {currentStep === 3 && (
            <>
              <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2"><Save /> Compétences</h2>
              {skills.map((sk, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2 flex-wrap">
                  <div className="relative flex-1 min-w-[120px]">
                    <input className="peer border-b-2 border-gray-300 focus:border-indigo-500 outline-none bg-transparent w-full py-2 px-1 transition" placeholder=" " value={sk.name} onChange={e => setSkills(sks => sks.map((s, i) => i === idx ? { ...s, name: e.target.value } : s))} />
                    <label className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm">Compétence</label>
                  </div>
                  <div className="relative w-40">
                    <select
                      className="peer border-b-2 border-gray-300 focus:border-indigo-500 outline-none bg-transparent w-full py-2 px-1 transition text-gray-700"
                      value={sk.level}
                      onChange={e => setSkills(sks => sks.map((s, i) => i === idx ? { ...s, level: e.target.value } : s))}
                    >
                      <option value="">Niveau</option>
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Avancé">Avancé</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <label className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs">Niveau</label>
                  </div>
                  <button onClick={() => setSkills(sks => sks.filter((_, i) => i !== idx))} className="text-red-500 font-bold">✕</button>
                </div>
              ))}
              <button onClick={() => setSkills(sks => [...sks, { name: '', level: '' }])} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">+ Ajouter une compétence</button>
            </>
          )}
          {currentStep === 4 && (
            <>
              <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2"><Eye /> Langues</h2>
              {languages.map((lang, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2">
                  <input className="border p-2 rounded flex-1" placeholder="Langue" value={lang.name} onChange={e => setLanguages(lgs => lgs.map((l, i) => i === idx ? { ...l, name: e.target.value } : l))} />
                  <input className="border p-2 rounded w-32" placeholder="Niveau" value={lang.level} onChange={e => setLanguages(lgs => lgs.map((l, i) => i === idx ? { ...l, level: e.target.value } : l))} />
                  <button onClick={() => setLanguages(lgs => lgs.filter((_, i) => i !== idx))} className="text-red-500 font-bold">✕</button>
                </div>
              ))}
              <button onClick={() => setLanguages(lgs => [...lgs, { name: '', level: '' }])} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">+ Ajouter une langue</button>
            </>
          )}
          {currentStep === 5 && (
            <>
              <h2 className="text-2xl font-bold text-yellow-700 mb-6 flex items-center gap-2"><Palette /> Loisirs</h2>
              {hobbies.map((hob, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2">
                  <input className="border p-2 rounded flex-1" placeholder="Loisir" value={hob.name} onChange={e => setHobbies(hbs => hbs.map((h, i) => i === idx ? { ...h, name: e.target.value } : h))} />
                  <button onClick={() => setHobbies(hbs => hbs.filter((_, i) => i !== idx))} className="text-red-500 font-bold">✕</button>
                </div>
              ))}
              <button onClick={() => setHobbies(hbs => [...hbs, { name: '' }])} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">+ Ajouter un loisir</button>
            </>
          )}
          {/* Import de fichier générique */}
          <div className="mt-8">
            <label className="block font-semibold mb-2">Importer un fichier (CV, lettre, etc.)</label>
            <input type="file" className="block w-full border rounded p-2 bg-gray-50 focus:ring-2 focus:ring-purple-300" onChange={e => {
              const file = e.target.files?.[0];
              if (file) alert(`Fichier importé : ${file.name}`);
            }} />
          </div>
          {/* Navigation stepper */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
              disabled={currentStep === 0}
              className="px-6 py-2 rounded-full bg-gray-200 text-gray-600 font-semibold disabled:opacity-50"
            >Précédent</button>
            {currentStep < steps.length - 1 && (
              <button
                onClick={() => !stepError && setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
                disabled={!!stepError}
                className={`px-6 py-2 rounded-full font-semibold shadow transition disabled:opacity-50 ${stepError ? 'bg-gray-300 text-gray-400' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
              >Suivant</button>
            )}
          </div>
          {stepError && <div className="text-red-500 text-sm mt-2 font-semibold">{stepError}</div>}
          {/* Étape résumé final */}
          {currentStep === steps.length - 1 && (
            <div className="mt-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2"><Eye /> Résumé de votre CV</h2>
              <div className="bg-purple-50 rounded-xl p-4 shadow-inner">
                <CvPreview
                  personalDetails={personalDetails}
                  selectedTemplate={selectedTemplate}
                  experiences={experiences}
                  education={education}
                  skills={skills}
                  languages={languages}
                  hobbies={hobbies}
                />
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-bold shadow-lg text-lg flex items-center gap-2"
                >
                  <Download size={22} /> Générer le PDF
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Aperçu sticky sur desktop */}
        <aside className="hidden lg:block w-[400px] sticky top-28 self-start animate-fade-in">
          <div className="bg-white/90 rounded-3xl shadow-xl border border-purple-100 p-6">
            <h3 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2"><Eye /> Aperçu instantané</h3>
            <CvPreview
              personalDetails={personalDetails}
              selectedTemplate={selectedTemplate}
              experiences={experiences}
              education={education}
              skills={skills}
              languages={languages}
              hobbies={hobbies}
            />
          </div>
        </aside>
  </main>

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded max-w-lg w-full">
            <button onClick={() => setShowPreview(false)} className="mb-4">Fermer</button>
            <CvPreview
              personalDetails={personalDetails}
              selectedTemplate={selectedTemplate}
              experiences={experiences}
              education={education}
              skills={skills}
              languages={languages}
              hobbies={hobbies}
            />
          </div>
        </div>
      )}

      {showCustomization && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded max-w-lg w-full">
            <button onClick={() => setShowCustomization(false)} className="mb-4">Fermer</button>
            <CvCustomizationPanel customization={customization} onCustomizationChange={setCustomization} />
          </div>
        </div>
      )}
    </div>
  );
}
