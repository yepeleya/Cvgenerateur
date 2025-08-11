
'use client';
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { PersonalDetails, Experience, Education, Skill, Language, Hobby, CvTemplate, CvCustomization } from '@/type';
import { predefinedThemes } from '@/app/utils/CvThemes';
import PersonalDetailForm from '@/app/components/PersonalDetailForm';
import ExperienceForm from '@/app/components/ExperienceForm';
import EducationForm from '@/app/components/EducationForm';
import LanguagesForm from '@/app/components/LanguagesForm';
import HobbieForm from '@/app/components/HobbieForm';
import SkillForm from '@/app/components/SkillForm';

export default function CvProPage() {

  // États principaux
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [activeSection, setActiveSection] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sections du CV
  const sections = [
    { id: 'personal', name: 'Informations personnelles', icon: User },
    { id: 'experience', name: 'Expérience', icon: User },
    { id: 'education', name: 'Éducation', icon: User },
    { id: 'skills', name: 'Compétences', icon: User },
    { id: 'languages', name: 'Langues', icon: User },
    { id: 'hobbies', name: 'Loisirs', icon: User },
  ];

  // Sauvegarder le CV
  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSaveMessage({ type: 'success', text: 'CV sauvegardé avec succès !' });
    }, 1000);
  };

  // Télécharger le CV
  const handleDownload = () => {
    console.log('Téléchargement PDF...');
  };

  // Rendu de la section active
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalDetailForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'education':
        return <EducationForm />;
      case 'skills':
        return <SkillForm />;
      case 'languages':
        return <LanguagesForm />;
      case 'hobbies':
        return <HobbieForm />;
      default:
        return null;
    }
  };

  return (
    <div className="drawer-content flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gray-100 p-4 flex justify-between items-center border-b">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center bg-blue-500 text-white px-3 py-1 rounded"
          >
            <Eye className="h-4 w-4 mr-1" /> Aperçu
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center bg-green-500 text-white px-3 py-1 rounded"
          >
            <Download className="h-4 w-4 mr-1" /> Télécharger
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center bg-gray-800 text-white px-3 py-1 rounded"
          >
            <Save className="h-4 w-4 mr-1" /> {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          <button
            onClick={() => setShowCustomization(!showCustomization)}
            className="flex items-center bg-purple-500 text-white px-3 py-1 rounded"
          >
            <Palette className="h-4 w-4 mr-1" /> Personnaliser
          </button>
        </div>
      </div>

      {/* Message de sauvegarde */}
      {saveMessage && (
        <div
          className={`p-2 flex items-center text-white ${
            saveMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle className="h-4 w-4 mr-2" />
          ) : (
            <AlertCircle className="h-4 w-4 mr-2" />
          )}
          {saveMessage.text}
        </div>
      )}

      {/* Corps */}
      <div className="flex flex-1 overflow-hidden">
        {/* Menu sections */}
        <div className="w-64 bg-gray-50 border-r p-4 overflow-y-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center w-full text-left px-3 py-2 rounded mb-2 ${
                activeSection === section.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              <section.icon className="h-4 w-4 mr-2" /> {section.name}
            </button>
          ))}
        </div>

        {/* Contenu formulaire */}
        <div className="flex-1 p-6 overflow-y-auto">{renderActiveSection()}</div>
      </div>
    </div>
  );
}
