import Image from "next/image";
import { Education, Experience, Hobby, Language, PersonalDetails, Skill } from '@/type';
import React, { RefObject } from 'react'
import { BriefcaseBusiness, GraduationCap, LanguagesIcon, Mail, MapPinHouse, Phone, Star } from "lucide-react";


type Props = {
    personalDetails: PersonalDetails;
    file: File | null;
    theme: string;
    experiences: Experience[];
    educations: Education[];
    languages: Language[];
    competences: Skill[];
    hobnies: Hobby[];
    download?:  boolean;
    ref?: RefObject<HTMLDivElement | null>

}
const CvPreview: React.FC<Props> = ({ personalDetails, file, theme, experiences, educations, languages, competences, hobnies,download,ref }) => {

    const formatDate = (date: string) => {
        const the_date_is = new Date(date);
        const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
        return the_date_is.toLocaleDateString("en-US", options);
    }

    const getStarRating = (proficiency: string) => {
        console.log(proficiency);
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
                    <Star key={index} className={`text-primary `} />
                ))}
                {Array.from({ length: maxStars - filledStars }, (_, index) => (
                    <Star key={index + filledStars} className="text-gray-300" />
                ))}
            </>
        );



    }

    return (
        <div ref={ref} className={`flex p-16 w-[950px] h-[1200px] shadow-lg ${download ? 'mb-10' : ''}`} data-theme={theme}>
            <div className=' flex flex-col w-1/3'>
                <div className='h-80 rounded-full border-8  overflow-hidden border-primary '>
                    {
                        file && (
                            <Image
                                src={URL.createObjectURL(file)}
                                alt="Picture of the author"
                                width={300}
                                height={300}
                                className="w-full h-full rounded-lg object-cover"
                                onLoadingComplete={() => {
                                    if (typeof file !== 'string') {
                                        URL.revokeObjectURL(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        )

                    }
                </div>

                <div className="mt-4 flex-col w-full">
                    <div>
                        <h1 className="uppercase font-bold my-2">
                            Contact
                        </h1>
                        <ul className="space-y-2">
                            <li className="flex">
                                <div className=" break-all text-sm relative">
                                    {personalDetails.phone && (
                                        <div className="absolute left-0 top- 0" >
                                            <Phone className="w-5 text-primary" />
                                        </div>
                                    )}
                                    <div className="ml-8">
                                        {personalDetails.phone}
                                    </div>

                                </div>

                            </li>

                            <li className="flex">
                                <div className=" break-all text-sm relative">
                                    {personalDetails.email && (
                                        <div className="absolute left-0 top- 0" >
                                            <Mail className="w-5 text-primary" />
                                        </div>
                                    )}
                                    <div className="ml-8">
                                        {personalDetails.email}
                                    </div>

                                </div>

                            </li>

                            <li className="flex">
                                <div className=" break-words text-sm relative">
                                    {personalDetails.address && (
                                        <div className="absolute left-0 top- 0" >
                                            <MapPinHouse className="w-5 text-primary" />
                                        </div>
                                    )}
                                    <div className="ml-8">
                                        {personalDetails.address}
                                    </div>

                                </div>

                            </li>
                        </ul>
                    </div>

                    <div className="mt-6">
                        <h1 className="uppercase font-bold my-2">
                            Compétences
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            {
                                competences.map((competence, index) => (
                                    <p key={index} className="  uppercase badge badge-primary ">
                                        {competence.name}
                                    </p>
                                ))
                            }
                        </div>
                    </div>

                    <div className="mt-6">
                        <h1 className="uppercase font-bold my-2">
                            Langues
                        </h1>
                        <div className="flex flex-col">
                            {
                                languages.map((language, index) => (
                                    <div key={index} className="flex flex-col">
                                        <div className="capitalize break-all font-bold space-y-2 text-sm relative ">
                                            <div className="absolute left-0  space-y-2" >
                                                <LanguagesIcon className="w-5 text-primary" />
                                            </div>
                                            <div className="ml-8">
                                                {language.language}
                                            </div>
                                        </div>
                                        <div className="flex ml-6 mt-2">
                                            {getStarRating(language.proficiency)}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="mt-6">
                        <h1 className="uppercase font-bold my-2">
                            Loisirs
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            {
                                hobnies.map((hobnie, index) => (
                                    <span key={index} className=" badge capitalize badge-primary ">
                                        {hobnie.name}
                                    </span>
                                ))
                            }
                        </div>
                    </div>

                </div>
            </div>

            <div className='w-2/3 ml-8'>
                <div className="w-full flex flex-col space-y-4">
                    <h1 className="uppercase text-xl">
                        {personalDetails.fullName}
                    </h1>
                    <h2 className="uppercase text-5xl text-primary font-bold" >
                        {personalDetails.postSeeking}
                    </h2>
                    <p className="break-words w-full text-sm">
                        {personalDetails.description}
                    </p>

                </div>

                <section
                    className="w-full h-fit p-5"
                >
                    <div>
                        <h1 className="uppercase font-bold mb-2">
                            Expérience
                        </h1>
                        <ul className="steps steps-vertical space-y-3">
                            {
                                experiences.map((experience, index) => (
                                    <li key={index} className="step step-primary">
                                        <div className="text-left ">
                                            <h2 className="flex text-md uppercase font-bold">
                                                <BriefcaseBusiness className="w-5" />
                                                <span className="ml-2">{experience.jobTitle}</span>
                                            </h2>
                                            <div className="text-sm my-2">
                                                <span className="badge badge-primary" >
                                                    {experience.companyName}
                                                </span>
                                                <span className="italic ml-2">
                                                    {formatDate(experience.startDate)} au {formatDate(experience.endDate)}
                                                </span>
                                            </div>
                                            <p className="text-sm">
                                                {experience.description}
                                            </p>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </section>
                <section
                    className="w-full h-fit p-5"
                >
                    <div>
                        <h1 className="uppercase font-bold mb-2">
                            Formations
                        </h1>
                        <ul className="steps steps-vertical space-y-3">
                            {
                                educations.map((education, index) => (
                                    <li key={index} className="step step-primary">
                                        <div className="text-left ">
                                            <h2 className="flex text-md uppercase font-bold">
                                                <GraduationCap className="w-5" />
                                                <span className="ml-2">{education.degree}</span>
                                            </h2>
                                            <div className="text-sm my-2">
                                                <span className="badge badge-primary" >
                                                    {education.school}
                                                </span>
                                                <span className="italic ml-2">
                                                    {formatDate(education.startDate)} au {formatDate(education.endDate)}
                                                </span>
                                            </div>
                                            <p className="text-sm">
                                                {education.description}
                                            </p>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </section>

            </div>
        </div>
    )
}

export default CvPreview



