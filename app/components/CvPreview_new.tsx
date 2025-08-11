import Image from "next/image";
import { Education, Experience, Hobby, Language, PersonalDetails, Skill, CvCustomization } from '@/type';
import React, { RefObject } from 'react'
import { BriefcaseBusiness, GraduationCap, LanguagesIcon, Mail, MapPinHouse, Phone, Star } from "lucide-react";

type Props = {
    personalDetails: PersonalDetails;
    experiences: Experience[];
    educations: Education[];
    languages: Language[];
    skills: Skill[];
    hobbies: Hobby[];
    customization: CvCustomization;
    file?: File | null;
    download?: boolean;
    ref?: RefObject<HTMLDivElement | null>
}

const CvPreview: React.FC<Props> = ({ 
    personalDetails, 
    experiences, 
    educations, 
    languages, 
    skills, 
    hobbies, 
    customization,
    download,
    ref 
}) => {

    const formatDate = (date: string) => {
        if (!date) return '';
        const the_date_is = new Date(date);
        const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
        return the_date_is.toLocaleDateString("fr-FR", options);
    }

    const getStarRating = (proficiency: string) => {
        const maxStars = 5;
        let rating = 1;
        
        switch (proficiency.toLowerCase()) {
            case 'débutant':
                rating = 2;
                break;
            case 'intermédiaire':
                rating = 3;
                break;
            case 'avancé':
                rating = 4;
                break;
            case 'expert':
            case 'bilingue':
            case 'natif':
            case 'maternelle':
                rating = 5;
                break;
            default:
                rating = 3;
        }
        
        return Array.from({ length: maxStars }, (_, i) => (
            <Star 
                key={i} 
                className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-base-300'}`}
                style={i < rating ? { color: customization.theme.colors.primary } : {}}
            />
        ));
    }

    // Styles dynamiques basés sur le thème
    const getThemeStyles = () => {
        const theme = customization.theme;
        const spacing = customization.spacing;
        
        let spacingClass = 'space-y-4';
        if (spacing === 'compact') spacingClass = 'space-y-2';
        if (spacing === 'relaxed') spacingClass = 'space-y-6';

        let borderRadius = '';
        switch (theme.layout.borderRadius) {
            case 'small': borderRadius = 'rounded-sm'; break;
            case 'medium': borderRadius = 'rounded-md'; break;
            case 'large': borderRadius = 'rounded-lg'; break;
            case 'full': borderRadius = 'rounded-full'; break;
            default: borderRadius = '';
        }

        let shadow = '';
        switch (theme.layout.shadow) {
            case 'small': shadow = 'shadow-sm'; break;
            case 'medium': shadow = 'shadow-md'; break;
            case 'large': shadow = 'shadow-lg'; break;
            default: shadow = '';
        }

        return {
            container: `${spacingClass} ${borderRadius} ${shadow}`,
            borderRadius,
            shadow
        };
    };

    const themeStyles = getThemeStyles();

    // Styles CSS dynamiques
    const dynamicStyles = {
        container: {
            fontFamily: customization.theme.typography.bodyFont,
            fontSize: customization.fontSize === 'small' ? '0.875rem' : 
                      customization.fontSize === 'large' ? '1.125rem' : '1rem',
            color: customization.theme.colors.text,
            backgroundColor: customization.theme.colors.background
        },
        header: {
            fontFamily: customization.theme.typography.headerFont,
            fontSize: customization.theme.typography.headerSize,
            fontWeight: customization.theme.typography.fontWeight,
            color: customization.theme.colors.primary
        },
        sectionTitle: {
            color: customization.theme.colors.primary,
            borderColor: customization.theme.colors.primary,
            fontFamily: customization.theme.typography.headerFont,
            fontWeight: customization.theme.typography.fontWeight
        },
        accent: {
            color: customization.theme.colors.accent
        },
        secondary: {
            color: customization.theme.colors.secondary
        }
    };

    return (
        <div 
            ref={ref}
            className={`min-h-[297mm] p-8 bg-white ${themeStyles.container}`}
            style={dynamicStyles.container}
        >
            {/* En-tête avec informations personnelles */}
            <header className="mb-8">
                <div className="flex items-start gap-6">
                    {/* Photo de profil */}
                    {customization.showPhoto && personalDetails.photoUrl && (
                        <div className={`flex-shrink-0 ${themeStyles.borderRadius} overflow-hidden`}>
                            <Image
                                src={personalDetails.photoUrl}
                                alt="Photo de profil"
                                width={120}
                                height={120}
                                className="object-cover w-[120px] h-[120px]"
                            />
                        </div>
                    )}
                    
                    {/* Informations principales */}
                    <div className="flex-1">
                        <h1 
                            className="text-4xl font-bold mb-2"
                            style={dynamicStyles.header}
                        >
                            {personalDetails.fullName || "Votre Nom"}
                        </h1>
                        
                        {personalDetails.postSeeking && (
                            <h2 
                                className="text-xl mb-4"
                                style={dynamicStyles.secondary}
                            >
                                {personalDetails.postSeeking}
                            </h2>
                        )}

                        {/* Coordonnées */}
                        <div className="flex flex-wrap gap-4 text-sm">
                            {personalDetails.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" style={dynamicStyles.accent} />
                                    <span>{personalDetails.email}</span>
                                </div>
                            )}
                            {personalDetails.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" style={dynamicStyles.accent} />
                                    <span>{personalDetails.phone}</span>
                                </div>
                            )}
                            {personalDetails.address && (
                                <div className="flex items-center gap-2">
                                    <MapPinHouse className="w-4 h-4" style={dynamicStyles.accent} />
                                    <span>{personalDetails.address}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {personalDetails.description && (
                            <p className="mt-4 leading-relaxed">
                                {personalDetails.description}
                            </p>
                        )}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Colonne principale */}
                <div className="md:col-span-2 space-y-8">
                    {/* Expériences professionnelles */}
                    {experiences.length > 0 && (
                        <section>
                            <h2 
                                className="text-2xl font-bold mb-4 pb-2 border-b-2"
                                style={dynamicStyles.sectionTitle}
                            >
                                <BriefcaseBusiness className="inline w-6 h-6 mr-2" />
                                Expériences Professionnelles
                            </h2>
                            
                            <div className="space-y-6">
                                {experiences.map((exp, index) => (
                                    <div key={index} className="relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 
                                                className="text-xl font-semibold"
                                                style={dynamicStyles.header}
                                            >
                                                {exp.jobTitle}
                                            </h3>
                                            <span 
                                                className="text-sm font-medium px-3 py-1 rounded"
                                                style={{
                                                    backgroundColor: customization.theme.colors.primary + '20',
                                                    color: customization.theme.colors.primary
                                                }}
                                            >
                                                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                            </span>
                                        </div>
                                        
                                        <h4 
                                            className="text-lg font-medium mb-3"
                                            style={dynamicStyles.secondary}
                                        >
                                            {exp.companyName}
                                        </h4>
                                        
                                        <p className="leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Formation */}
                    {educations.length > 0 && (
                        <section>
                            <h2 
                                className="text-2xl font-bold mb-4 pb-2 border-b-2"
                                style={dynamicStyles.sectionTitle}
                            >
                                <GraduationCap className="inline w-6 h-6 mr-2" />
                                Formation
                            </h2>
                            
                            <div className="space-y-6">
                                {educations.map((edu, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 
                                                className="text-xl font-semibold"
                                                style={dynamicStyles.header}
                                            >
                                                {edu.degree}
                                            </h3>
                                            <span 
                                                className="text-sm font-medium px-3 py-1 rounded"
                                                style={{
                                                    backgroundColor: customization.theme.colors.primary + '20',
                                                    color: customization.theme.colors.primary
                                                }}
                                            >
                                                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                            </span>
                                        </div>
                                        
                                        <h4 
                                            className="text-lg font-medium mb-3"
                                            style={dynamicStyles.secondary}
                                        >
                                            {edu.school}
                                        </h4>
                                        
                                        {edu.description && (
                                            <p className="leading-relaxed">{edu.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Colonne latérale */}
                <div className="space-y-8">
                    {/* Compétences */}
                    {skills.length > 0 && (
                        <section>
                            <h2 
                                className="text-xl font-bold mb-4 pb-2 border-b-2"
                                style={dynamicStyles.sectionTitle}
                            >
                                Compétences
                            </h2>
                            
                            <div className="space-y-2">
                                {skills.map((skill, index) => (
                                    <div 
                                        key={index}
                                        className="px-3 py-2 rounded text-sm font-medium"
                                        style={{
                                            backgroundColor: customization.theme.colors.primary + '15',
                                            color: customization.theme.colors.primary
                                        }}
                                    >
                                        {skill.name}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Langues */}
                    {languages.length > 0 && (
                        <section>
                            <h2 
                                className="text-xl font-bold mb-4 pb-2 border-b-2"
                                style={dynamicStyles.sectionTitle}
                            >
                                <LanguagesIcon className="inline w-5 h-5 mr-2" />
                                Langues
                            </h2>
                            
                            <div className="space-y-3">
                                {languages.map((lang, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="font-medium">{lang.language}</span>
                                        <div className="flex gap-1">
                                            {getStarRating(lang.proficiency)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Loisirs */}
                    {hobbies.length > 0 && (
                        <section>
                            <h2 
                                className="text-xl font-bold mb-4 pb-2 border-b-2"
                                style={dynamicStyles.sectionTitle}
                            >
                                Loisirs
                            </h2>
                            
                            <div className="flex flex-wrap gap-2">
                                {hobbies.map((hobby, index) => (
                                    <span 
                                        key={index}
                                        className="px-2 py-1 rounded text-xs"
                                        style={{
                                            backgroundColor: customization.theme.colors.accent + '20',
                                            color: customization.theme.colors.accent
                                        }}
                                    >
                                        {hobby.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CvPreview;
