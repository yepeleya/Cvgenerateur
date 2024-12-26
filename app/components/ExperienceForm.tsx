import { Experience } from '@/type'
import { Plus } from 'lucide-react';
import React, { useState } from 'react'


type Props = {
    experience: Experience[];
    setExperience: (experience: Experience[]) => void;
}
const ExperienceForm: React.FC<Props> = ({ experience, setExperience }) => {
    const [errors, setErrors] = useState<Partial<Record<keyof Experience, string>>>({});
    const [newExperience, setnewExperience] = useState<Experience>({
        jobTitle: "",
        companyName: "",
        startDate: "",
        endDate: "",
        description: "",

    })
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Experience) => {
        setnewExperience({ ...newExperience, [field]: event.target.value })
        setErrors({ ...errors, [field]: "" });
    }

    const handleAddExperience = () => {
        const newErrors: Partial<Record<keyof Experience, string>> = {};

        // Vérifie que tous les champs sont remplis
        if (!newExperience.jobTitle.trim()) newErrors.jobTitle = "Le titre du poste est requis.";
        if (!newExperience.companyName.trim()) newErrors.companyName = "Le nom de l'entreprise est requis.";
        if (!newExperience.startDate.trim()) newErrors.startDate = "La date de début est requise.";
        if (!newExperience.endDate.trim()) newErrors.endDate = "La date de fin est requise.";
        if (!newExperience.description.trim()) newErrors.description = "La description est requise.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Ajoute l'expérience si tout est valide
        setExperience([...experience, newExperience]);
        setnewExperience({
            jobTitle: "",
            companyName: "",
            startDate: "",
            endDate: "",
            description: "",
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
                            placeholder="Entrer votre Experience"
                            value={newExperience.jobTitle}
                            onChange={(event) => handleChange(event, 'jobTitle')}
                            className={`input input-bordered w-full ${errors.jobTitle ? 'border-red-500' : ''}`}

                        />
                        {errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle}</p>}
                    </div>
                    <div className='flex flex-col w-full ml-4'>
                        <input
                            type="text"
                            placeholder="Entrer le nom de l'entreprise"
                            value={newExperience.companyName}
                            onChange={(event) => handleChange(event, 'companyName')}
                            className={`input input-bordered w-full ${errors.companyName ? 'border-red-500' : ''}`}
                        />
                        {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
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
                            value={newExperience.startDate}
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
                            min={newExperience.startDate}
                            value={newExperience.endDate}
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
                            value={newExperience.description}
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

export default ExperienceForm
