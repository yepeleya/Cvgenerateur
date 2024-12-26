import { Skill } from '@/type';
import { Plus } from 'lucide-react';
import React, { useState } from 'react'


type Props = {
    competence: Skill[];
    setCompetence: (competence: Skill[]) => void;
}
const CompetencesFom: React.FC<Props> = ({ competence, setCompetence }) => {

    const [errors, setErrors] = useState<Partial<Record<keyof Skill, string>>>({});
    const [newcompetence, setnewcompetence] = useState<Skill>({
        name: ""
    })

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        field: keyof Skill
    ) => {
        setnewcompetence({ ...newcompetence, [field]: event.target.value });
        setErrors({ ...errors, [field]: "" });
    };


    const handleAddcompetence = () => {
        const newErrors: Partial<Record<keyof Skill, string>> = {};

        if (!newcompetence.name.trim()) newErrors.name = "competence requise obligatoire";


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setCompetence([...competence, newcompetence]);
        setnewcompetence({
            name: ""
        });
        setErrors({});
    };

    return (
        <div>
            <div className='mt-4'>
                <input
                    type="text"
                    placeholder="Entrer une Competence"
                    value={newcompetence.name}
                    onChange={(event) => handleChange(event, 'name')}
                    className={`input input-bordered w-full ${errors.name ? 'border-red-500' : ''}`}

                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                <button
                onClick={handleAddcompetence}
                className=' btn btn-primary mt-4 '>
                Ajouter
                <Plus className='w-4' />
            </button>
            </div>
        </div>
    )
}

export default CompetencesFom
