import { Language } from '@/type';
import { Plus } from 'lucide-react';
import React, { useState } from 'react'

type Props = {
    language: Language[];
    setLanguage: (language: Language[]) => void;
}
const LanguagesForm: React.FC<Props> = ({ language, setLanguage }) => {

    const [errors, setErrors] = useState<Partial<Record<keyof Language, string>>>({});
    const [newLanguage, setnewLanguage] = useState<Language>({
        language: "",
        proficiency: "",

    })

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        field: keyof Language
    ) => {
        console.log(`Field: ${field}, Value: ${event.target.value}`); // Déboguer ici
        setnewLanguage({ ...newLanguage, [field]: event.target.value });
        setErrors({ ...errors, [field]: "" });
    };


    const handleAddlanguage = () => {
        console.log("Adding language:", newLanguage); // Déboguer ici
        const newErrors: Partial<Record<keyof Language, string>> = {};
      
        if (!newLanguage.language.trim()) newErrors.language = "langue requise obligatoire";
        if (!newLanguage.proficiency.trim()) newErrors.proficiency = "niveau requis obligatoire";
      
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
      
        setLanguage([...language, newLanguage]);
        setnewLanguage({
          language: "",
          proficiency: "",
        });
        setErrors({});
      };
      

    return (



        <div className='space-y-4'>
            <input
                type="text"
                placeholder="Entrer une langue"
                value={newLanguage.language}
                onChange={(event) => handleChange(event, 'language')}
                className={`input input-bordered w-full ${errors.language ? 'border-red-500' : ''}`}

            />
            {errors.language && <p className="text-red-500 text-sm">{errors.language}</p>}
            <select
                value={newLanguage.proficiency}
                onChange={(event) => handleChange(event, 'proficiency')}
                className="select select-bordered w-full"
            >
                <option defaultValue="" value="">
                    Selectionner la maîtrise
                </option>
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
                <option value="Maternelle">Maternelle</option>
            </select>

            {errors.proficiency && <p className="text-red-500 text-sm">{errors.proficiency}</p>}
            <button
                onClick={handleAddlanguage}
                className=' btn btn-primary mt-4 '>
                Ajouter
                <Plus className='w-4' />
            </button>
        </div>

    )
}

export default LanguagesForm

