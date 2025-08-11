'use client';
import React from 'react';
import { RefObject } from 'react';
import Image from "next/image";
import { PersonalDetails, Experience, Education, Skill, Language, Hobby } from '@/type';
import { BriefcaseBusiness, GraduationCap, LanguagesIcon, Mail, MapPinHouse, Phone, Star } from "lucide-react";

type Props = {
  personalDetails: PersonalDetails;
  file: File | null;
  theme: string;
  selectedCountry: string;
  selectedTemplate: string;
  experiences: Experience[];
  educations: Education[];
  languages: Language[];
  competences: Skill[];
  hobbies: Hobby[];
  download?: boolean;
  ref?: RefObject<HTMLDivElement | null>;
  customFont?: string;
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  customSpacing?: 'compact' | 'normal' | 'spacious';
}

const CvPreviewWithTemplates: React.FC<Props> = ({ 
  personalDetails, 
  file, 
  theme, 
  selectedCountry,
  selectedTemplate,
  experiences, 
  educations, 
  languages, 
  competences, 
  hobbies,
  download,
  ref,
  customFont = 'Inter',
  customColors = {
    primary: '#3B82F6',
    secondary: '#1F2937',
    accent: '#F59E0B'
  },
  customSpacing = 'normal'
}) => {

  const formatDate = (date: string) => {
    const theDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
    return theDate.toLocaleDateString("fr-FR", options);
  };

  const getStarRating = (proficiency: string) => {
    const maxStars = 5;
    let filledStars = 0;

    switch (proficiency) {
      case 'Débutant':
        filledStars = 1;
        break;
      case 'Intermédiaire':
        filledStars = 3;
        break;
      case 'Avancé':
        filledStars = 4;
        break;
      case 'Maternelle':
        filledStars = 5;
        break;
      default:
        filledStars = 0;
    }

    return (
      <>
        {Array.from({ length: filledStars }, (_, index) => (
          <Star key={index} className={`text-primary fill-primary w-4 h-4`} />
        ))}
        {Array.from({ length: maxStars - filledStars }, (_, index) => (
          <Star key={index + filledStars} className="text-gray-300 w-4 h-4" />
        ))}
      </>
    );
  };

  // Fonction pour obtenir les styles d'espacement
  const getSpacingClass = () => {
    switch (customSpacing) {
      case 'compact':
        return 'space-y-1';
      case 'spacious':
        return 'space-y-6';
      default:
        return 'space-y-3';
    }
  };

  // Styles CSS personnalisés
  const customStyles = {
    fontFamily: customFont,
    '--custom-primary': customColors.primary,
    '--custom-secondary': customColors.secondary,
    '--custom-accent': customColors.accent,
  } as React.CSSProperties;

  // Template Côte d'Ivoire - Format francophone avec spécificités locales
  const renderCITemplate = () => (
    <div ref={ref} className={`flex p-16 w-[950px] h-[1200px] shadow-lg ${download ? 'mb-10' : ''} ${getSpacingClass()}`} data-theme={theme} id="cv-preview-container" style={customStyles}>
      <div className='flex flex-col w-1/3'>
        {/* Photo avec bordure orange */}
        <div className={`h-80 rounded-full border-8 overflow-hidden border-opacity-80`} style={{ borderColor: customColors.primary }}>
          {file && (
            <Image
              src={URL.createObjectURL(file)}
              alt="Photo de profil"
              width={300}
              height={300}
              className="w-full h-full rounded-lg object-cover"
              onLoad={() => {
                if (typeof file !== 'string') {
                  URL.revokeObjectURL(URL.createObjectURL(file));
                }
              }}
            />
          )}
        </div>

        <div className="mt-4 flex-col w-full">
          {/* Section Contact avec style ivoirien */}
          <div>
            <h1 className="uppercase font-bold my-2" style={{ color: customColors.primary }}>
              État Civil & Contact
            </h1>
            <ul className={getSpacingClass()}>
              <li className="flex">
                <div className="break-all text-sm relative">
                  {personalDetails.phone && (
                    <div className="absolute left-0 top-0">
                      <Phone className="w-5" style={{ color: customColors.primary }} />
                    </div>
                  )}
                  <div className="ml-8">{personalDetails.phone}</div>
                </div>
              </li>
              <li className="flex">
                <div className="break-all text-sm relative">
                  {personalDetails.email && (
                    <div className="absolute left-0 top-0">
                      <Mail className="w-5" style={{ color: customColors.primary }} />
                    </div>
                  )}
                  <div className="ml-8">{personalDetails.email}</div>
                </div>
              </li>
              <li className="flex">
                <div className="break-words text-sm relative">
                  {personalDetails.address && (
                    <div className="absolute left-0 top-0">
                      <MapPinHouse className="w-5" style={{ color: customColors.primary }} />
                    </div>
                  )}
                  <div className="ml-8">{personalDetails.address}</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Compétences */}
          <div className="mt-6">
            <h1 className="uppercase font-bold my-2" style={{ color: customColors.primary }}>
              Compétences Techniques
            </h1>
            <div className="flex flex-wrap gap-2">
              {competences.map((competence, index) => (
                <p key={index} className="uppercase badge" style={{ backgroundColor: customColors.accent, color: 'white' }}>
                  {competence.name}
                </p>
              ))}
            </div>
          </div>

          {/* Langues */}
          <div className="mt-6">
            <h1 className="uppercase font-bold my-2" style={{ color: customColors.primary }}>
              Langues Parlées
            </h1>
            <div className="flex flex-col">
              {languages.map((language, index) => (
                <div key={index} className="flex flex-col">
                  <div className="capitalize break-all font-bold space-y-2 text-sm relative">
                    <div className="absolute left-0 space-y-2">
                      <LanguagesIcon className="w-5" style={{ color: customColors.primary }} />
                    </div>
                    <div className="ml-8">{language.language}</div>
                  </div>
                  <div className="flex ml-6 mt-2">
                    {getStarRating(language.proficiency)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Centres d'Intérêt */}
          <div className="mt-6">
            <h1 className="uppercase font-bold my-2" style={{ color: customColors.primary }}>
              Centres d&apos;Intérêt
            </h1>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby, index) => (
                <span key={index} className="badge capitalize" style={{ backgroundColor: customColors.accent, color: 'white' }}>
                  {hobby.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='w-2/3 ml-8'>
        <div className="w-full flex flex-col space-y-4">
          <h1 className="uppercase text-xl">{personalDetails.fullName}</h1>
          <h2 className="uppercase text-5xl font-bold" style={{ color: customColors.primary }}>
            {personalDetails.postSeeking}
          </h2>
          <p className="break-words w-full text-sm">{personalDetails.description}</p>
        </div>

        {/* Objectif de Carrière */}
        <section className="w-full h-fit p-5">
          <div>
            <h1 className="uppercase font-bold mb-2" style={{ color: customColors.primary }}>
              Objectif de Carrière
            </h1>
            <p className="text-sm italic">{personalDetails.description}</p>
          </div>
        </section>

        {/* Expérience Professionnelle */}
        <section className="w-full h-fit p-5">
          <div>
            <h1 className="uppercase font-bold mb-2" style={{ color: customColors.primary }}>
              Expérience Professionnelle
            </h1>
            <ul className={`steps steps-vertical ${getSpacingClass()}`}>
              {experiences.map((experience, index) => (
                <li key={index} className="step" style={{ '--step-color': customColors.primary } as React.CSSProperties}>
                  <div className="text-left">
                    <h2 className="flex text-md uppercase font-bold">
                      <BriefcaseBusiness className="w-5" style={{ color: customColors.primary }} />
                      <span className="ml-2">{experience.jobTitle}</span>
                    </h2>
                    <div className="text-sm my-2">
                      <span className="badge" style={{ backgroundColor: customColors.secondary, color: 'white' }}>
                        {experience.companyName}
                      </span>
                      <span className="italic ml-2">
                        {formatDate(experience.startDate)} au {formatDate(experience.endDate)}
                      </span>
                    </div>
                    <p className="text-sm">{experience.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Formation Académique */}
        <section className="w-full h-fit p-5">
          <div>
            <h1 className="uppercase font-bold mb-2" style={{ color: customColors.primary }}>
              Formation Académique
            </h1>
            <ul className={`steps steps-vertical ${getSpacingClass()}`}>
              {educations.map((education, index) => (
                <li key={index} className="step" style={{ '--step-color': customColors.primary } as React.CSSProperties}>
                  <div className="text-left">
                    <h2 className="flex text-md uppercase font-bold">
                      <GraduationCap className="w-5" style={{ color: customColors.primary }} />
                      <span className="ml-2">{education.degree}</span>
                    </h2>
                    <div className="text-sm my-2">
                      <span className="badge" style={{ backgroundColor: customColors.secondary, color: 'white' }}>
                        {education.school}
                      </span>
                      <span className="italic ml-2">
                        {formatDate(education.startDate)} au {formatDate(education.endDate)}
                      </span>
                    </div>
                    <p className="text-sm">{education.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );

  // Template Côte d'Ivoire International - Format moderne
  const renderCIInternationalTemplate = () => (
    <div ref={ref} className={`flex p-16 w-[950px] h-[1200px] shadow-lg ${download ? 'mb-10' : ''} ${getSpacingClass()} bg-gradient-to-br from-blue-50 to-indigo-100`} data-theme={theme} id="cv-preview-container" style={customStyles}>
      {/* Sidebar moderne */}
      <div className='flex flex-col w-1/3 bg-white rounded-l-lg shadow-lg'>
        {/* Photo moderne sans bordure */}
        <div className="h-64 w-full overflow-hidden">
          {file && (
            <Image
              src={URL.createObjectURL(file)}
              alt="Photo professionnelle"
              width={300}
              height={300}
              className="w-full h-full object-cover"
              onLoad={() => {
                if (typeof file !== 'string') {
                  URL.revokeObjectURL(URL.createObjectURL(file));
                }
              }}
            />
          )}
        </div>

        <div className="p-6 flex-1">
          {/* Contact moderne */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b-2 pb-2" style={{ borderColor: customColors.primary }}>
              CONTACT
            </h2>
            <div className={getSpacingClass()}>
              {personalDetails.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3" style={{ color: customColors.primary }} />
                  <span className="text-sm">{personalDetails.phone}</span>
                </div>
              )}
              {personalDetails.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3" style={{ color: customColors.primary }} />
                  <span className="text-sm break-all">{personalDetails.email}</span>
                </div>
              )}
              {personalDetails.address && (
                <div className="flex items-center">
                  <MapPinHouse className="w-4 h-4 mr-3" style={{ color: customColors.primary }} />
                  <span className="text-sm">{personalDetails.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Compétences Techniques */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b-2 pb-2" style={{ borderColor: customColors.primary }}>
              COMPÉTENCES TECHNIQUES
            </h2>
            <div className="space-y-2">
              {competences.map((competence, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: customColors.primary }}></div>
                  <span className="text-sm font-medium">{competence.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Langues avec barres de progression */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b-2 pb-2" style={{ borderColor: customColors.primary }}>
              LANGUES
            </h2>
            <div className={getSpacingClass()}>
              {languages.map((language, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{language.language}</span>
                    <span className="text-xs text-gray-500">{language.proficiency}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        backgroundColor: customColors.primary,
                        width: language.proficiency === 'Débutant' ? '25%' : 
                               language.proficiency === 'Intermédiaire' ? '60%' : 
                               language.proficiency === 'Avancé' ? '80%' : 
                               language.proficiency === 'Maternelle' ? '100%' : '0%' 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Centres d'Intérêt */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b-2 pb-2" style={{ borderColor: customColors.primary }}>
              CENTRES D&apos;INTÉRÊT
            </h2>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby, index) => (
                <span key={index} className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: customColors.accent, color: 'white' }}>
                  {hobby.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal moderne */}
      <div className='w-2/3 bg-white rounded-r-lg shadow-lg p-8'>
        {/* En-tête professionnel */}
        <div className="border-b-4 pb-6 mb-8" style={{ borderColor: customColors.primary }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {personalDetails.fullName}
          </h1>
          <h2 className="text-xl font-semibold mb-4" style={{ color: customColors.primary }}>
            {personalDetails.postSeeking}
          </h2>
          
          {/* Résumé Professionnel */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">RÉSUMÉ PROFESSIONNEL</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{personalDetails.description}</p>
          </div>
        </div>

        {/* Expérience Professionnelle */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <BriefcaseBusiness className="w-6 h-6 mr-3" style={{ color: customColors.primary }} />
            EXPÉRIENCE PROFESSIONNELLE
          </h3>
          <div className={getSpacingClass()}>
            {experiences.map((experience, index) => (
              <div key={index} className="border-l-4 pl-6 pb-6" style={{ borderColor: customColors.secondary }}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{experience.jobTitle}</h4>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                    {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                  </span>
                </div>
                <p className="font-medium mb-3" style={{ color: customColors.primary }}>{experience.companyName}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{experience.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Formation */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <GraduationCap className="w-6 h-6 mr-3" style={{ color: customColors.primary }} />
            FORMATION
          </h3>
          <div className={getSpacingClass()}>
            {educations.map((education, index) => (
              <div key={index} className="border-l-4 pl-6 pb-6" style={{ borderColor: customColors.secondary }}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{education.degree}</h4>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                    {formatDate(education.startDate)} - {formatDate(education.endDate)}
                  </span>
                </div>
                <p className="font-medium mb-3" style={{ color: customColors.primary }}>{education.school}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{education.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  // Template par défaut (template original)
  const renderDefaultTemplate = () => (
    <div ref={ref} className={`flex p-16 w-[950px] h-[1200px] shadow-lg ${download ? 'mb-10' : ''} ${getSpacingClass()}`} data-theme={theme} id="cv-preview-container" style={customStyles}>
      <div className='flex flex-col w-1/3'>
        <div className='h-80 rounded-full border-8 overflow-hidden' style={{ borderColor: customColors.primary }}>
          {file && (
            <Image
              src={URL.createObjectURL(file)}
              alt="Picture of the author"
              width={300}
              height={300}
              className="w-full h-full rounded-lg object-cover"
              onLoad={() => {
                if (typeof file !== 'string') {
                  URL.revokeObjectURL(URL.createObjectURL(file));
                }
              }}
            />
          )}
        </div>

        <div className="mt-4 flex-col w-full">
          <div>
            <h1 className="uppercase font-bold my-2" style={{ color: customColors.primary }}>Contact</h1>
            <ul className={getSpacingClass()}>
              <li className="flex">
                <div className="break-all text-sm relative">
                  {personalDetails.phone && (
                    <div className="absolute left-0 top-0">
                      <Phone className="w-5" style={{ color: customColors.primary }} />
                    </div>
                  )}
                  <div className="ml-8">{personalDetails.phone}</div>
                </div>
              </li>
              <li className="flex">
                <div className="break-all text-sm relative">
                  {personalDetails.email && (
                    <div className="absolute left-0 top-0">
                      <Mail className="w-5" style={{ color: customColors.primary }} />
                    </div>
                  )}
                  <div className="ml-8">{personalDetails.email}</div>
                </div>
              </li>
              <li className="flex">
                <div className="break-words text-sm relative">
                  {personalDetails.address && (
                    <div className="absolute left-0 top-0">
                      <MapPinHouse className="w-5" style={{ color: customColors.primary }} />
                    </div>
                  )}
                  <div className="ml-8">{personalDetails.address}</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-6">
            <h1 className="uppercase font-bold my-2" style={{ color: customColors.primary }}>Compétences</h1>
            <div className="flex flex-wrap gap-2">
              {competences.map((competence, index) => (
                <p key={index} className="uppercase badge" style={{ backgroundColor: customColors.primary, color: 'white' }}>
                  {competence.name}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h1 className="uppercase font-bold my-2" style={{ color: customColors.primary }}>Langues</h1>
            <div className="flex flex-col">
              {languages.map((language, index) => (
                <div key={index} className="flex flex-col">
                  <div className="capitalize break-all font-bold space-y-2 text-sm relative">
                    <div className="absolute left-0 space-y-2">
                      <LanguagesIcon className="w-5" style={{ color: customColors.primary }} />
                    </div>
                    <div className="ml-8">{language.language}</div>
                  </div>
                  <div className="flex ml-6 mt-2">
                    {getStarRating(language.proficiency)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h1 className="uppercase font-bold my-2" style={{ color: customColors.primary }}>Loisirs</h1>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby, index) => (
                <span key={index} className="badge capitalize" style={{ backgroundColor: customColors.accent, color: 'white' }}>
                  {hobby.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='w-2/3 ml-8'>
        <div className="w-full flex flex-col space-y-4">
          <h1 className="uppercase text-xl">{personalDetails.fullName}</h1>
          <h2 className="uppercase text-5xl font-bold" style={{ color: customColors.primary }}>
            {personalDetails.postSeeking}
          </h2>
          <p className="break-words w-full text-sm">{personalDetails.description}</p>
        </div>

        <section className="w-full h-fit p-5">
          <div>
            <h1 className="uppercase font-bold mb-2" style={{ color: customColors.primary }}>Expérience</h1>
            <ul className={`steps steps-vertical ${getSpacingClass()}`}>
              {experiences.map((experience, index) => (
                <li key={index} className="step" style={{ '--step-color': customColors.primary } as React.CSSProperties}>
                  <div className="text-left">
                    <h2 className="flex text-md uppercase font-bold">
                      <BriefcaseBusiness className="w-5" style={{ color: customColors.primary }} />
                      <span className="ml-2">{experience.jobTitle}</span>
                    </h2>
                    <div className="text-sm my-2">
                      <span className="badge" style={{ backgroundColor: customColors.secondary, color: 'white' }}>
                        {experience.companyName}
                      </span>
                      <span className="italic ml-2">
                        {formatDate(experience.startDate)} au {formatDate(experience.endDate)}
                      </span>
                    </div>
                    <p className="text-sm">{experience.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="w-full h-fit p-5">
          <div>
            <h1 className="uppercase font-bold mb-2" style={{ color: customColors.primary }}>Formations</h1>
            <ul className={`steps steps-vertical ${getSpacingClass()}`}>
              {educations.map((education, index) => (
                <li key={index} className="step" style={{ '--step-color': customColors.primary } as React.CSSProperties}>
                  <div className="text-left">
                    <h2 className="flex text-md uppercase font-bold">
                      <GraduationCap className="w-5" style={{ color: customColors.primary }} />
                      <span className="ml-2">{education.degree}</span>
                    </h2>
                    <div className="text-sm my-2">
                      <span className="badge" style={{ backgroundColor: customColors.secondary, color: 'white' }}>
                        {education.school}
                      </span>
                      <span className="italic ml-2">
                        {formatDate(education.startDate)} au {formatDate(education.endDate)}
                      </span>
                    </div>
                    <p className="text-sm">{education.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );

  // Sélection du template selon le pays et le template choisi
  const renderSelectedTemplate = () => {
    // Si c'est la Côte d'Ivoire et le template ivoirien
    if (selectedCountry === 'CI' && selectedTemplate === 'ci-francophone') {
      return renderCITemplate();
    }
    
    // Si c'est la Côte d'Ivoire et le template international
    if (selectedCountry === 'CI' && selectedTemplate === 'ci-international') {
      return renderCIInternationalTemplate();
    }
    
    // Autres templates spécifiques peuvent être ajoutés ici
    // if (selectedCountry === 'CN' && selectedTemplate === 'cn-traditional') {
    //   return renderCNTemplate();
    // }
    
    // Template par défaut
    return renderDefaultTemplate();
  };

  return renderSelectedTemplate();
};

export default CvPreviewWithTemplates;
