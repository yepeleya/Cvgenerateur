import { Hobby } from '@/type';
import { Plus } from 'lucide-react';
import React, { useState } from 'react'


type Props = {
    hobie: Hobby[];
    sethobie: (hobie: Hobby[]) => void;
}
const HobbieForm: React.FC<Props> = ({ hobie, sethobie }) => {
    const [errors, setErrors] = useState<Partial<Record<keyof Hobby, string>>>({});
    const [newhobie, setnewhobie] = useState<Hobby>({
        name: ""
    })

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        field: keyof Hobby
    ) => {
        setnewhobie({ ...newhobie, [field]: event.target.value });
        setErrors({ ...errors, [field]: "" });
    };


    const handleAddcompetence = () => {
        const newErrors: Partial<Record<keyof Hobby, string>> = {};

        if (!newhobie.name.trim()) newErrors.name = "competence requise obligatoire";


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        sethobie([...hobie, newhobie]);
        setnewhobie({
            name: ""
        });
        setErrors({});
    };
    return (
        <div>
            <div className='mt-4'>
                <input
                    type="text"
                    placeholder="Entrer un loisir"
                    value={newhobie.name}
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

export default HobbieForm
