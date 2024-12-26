import { Education } from '@/type';
import { Plus } from 'lucide-react';
import React, { useState } from 'react'


type Props = {
    education: Education[];
    setEducation: (education: Education[]) => void;
}
const EducationForm: React.FC<Props> = ({ education, setEducation }) => {
    const [errors, setErrors] = useState<Partial<Record<keyof Education, string>>>({});
    const [newEducation, setNewEducation] = useState<Education>({
        school: "",
        degree: "",
        description: "",
        startDate: "",
        endDate: ""

    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Education) => {
        setNewEducation({ ...newEducation, [field]: event.target.value })
        setErrors({ ...errors, [field]: "" });
    }

    const handleAddExperience = () => {
        const newErrors: Partial<Record<keyof Education, string>> = {};

        // Vérifie que tous les champs sont remplis
        if (!newEducation.degree.trim()) newErrors.degree = "Le diplome obtenue est requis.";
        if (!newEducation.school.trim()) newErrors.school = "L'etablissement fréquenté  est requis.";
        if (!newEducation.startDate.trim()) newErrors.startDate = "La date de début est requise.";
        if (!newEducation.endDate.trim()) newErrors.endDate = "La date de fin est requise.";
        if (!newEducation.description.trim()) newErrors.description = "La description est requise.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Ajoute l'expérience si tout est valide
        setEducation([...education, newEducation]);
        setNewEducation({
            school: "",
            degree: "",
            description: "",
            startDate: "",
            endDate: ""
        });
        setErrors({});
    };


    return (
        <div>
            <div className='flex flex-col gap-4'>
                <div className='flex justify-between'>

                    <div className='flex flex-col w-full'>
                        <input
                            type="text"
                            placeholder="Entrer le diplome "
                            value={newEducation.degree}
                            onChange={(event) => handleChange(event, 'degree')}
                            className={`input input-bordered w-full ${errors.degree ? 'border-red-500' : ''}`}
                        />
                        {errors.degree && <p className="text-red-500 text-sm">{errors.degree}</p>}
                    </div>
                    <div className='flex flex-col w-full  ml-4'>
                        <input
                            type="text"
                            placeholder="Entrer l'ecole d'optention du diplome"
                            value={newEducation.school}
                            onChange={(event) => handleChange(event, 'school')}
                            className={`input input-bordered w-full ${errors.school ? 'border-red-500' : ''}`}

                        />
                        {errors.school && <p className="text-red-500 text-sm">{errors.school}</p>}
                    </div>
                </div>
                <div className='flex justify-between'>
                    <div className='flex flex-col w-full '>
                        <input
                            type="text"
                            placeholder="Entrer votre date de début"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => {
                                if (!e.target.value) {
                                    e.target.type = 'text';
                                }
                            }}
                            value={newEducation.startDate}
                            onChange={(event) => handleChange(event, 'startDate')}
                            className={`input input-bordered w-full ${errors.startDate ? 'border-red-500' : ''}`}

                        />
                        {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
                    </div>
                    <div className='flex flex-col w-full ml-4'>
                        <input
                            type="text"
                            placeholder="Entrer votre date de fin"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => {
                                if (!e.target.value) {
                                    e.target.type = 'text';
                                }
                            }}
                            min={newEducation.startDate}
                            value={newEducation.endDate}
                            onChange={(event) => handleChange(event, 'endDate')}
                            className={`input input-bordered w-full ${errors.endDate ? 'border-red-500' : ''}`}
                        />
                        {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
                    </div>
                </div>
                <div>
                    <div className="flex flex-col">
                        <textarea
                            placeholder="Entrer une description"
                            value={newEducation.description}
                            onChange={(event) => handleChange(event, 'description')}
                            className={`textarea textarea-bordered w-full ${errors.description ? 'border-red-500' : ''}`}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>
                </div>
            </div>
            <button
                onClick={handleAddExperience}
                className=' btn btn-primary mt-4 '>
                Ajouter
                <Plus className='w-4' />
            </button>
        </div>
    )
}

export default EducationForm
