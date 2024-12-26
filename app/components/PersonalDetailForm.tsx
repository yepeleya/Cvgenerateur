import { PersonalDetails } from '@/type'
import React from 'react'

type Props = {
    personalDetails: PersonalDetails;
    setPersonalDetails: (pd: PersonalDetails) => void;
    setFile: (file: File | null) => void;
}
const PersonalDetailForm: React.FC<Props> = ({ personalDetails, setPersonalDetails, setFile }) => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof PersonalDetails) => {
        setPersonalDetails({ ...personalDetails, [field]: event.target.value })
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
        }
    }
    return (
        <div className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Entrer votre nom complet"
                value={personalDetails.fullName}
                onChange={(event) => handleChange(event, 'fullName')}
                className='input input-bordered w-full'
                id=""
            />
            <div className="flex">
                <input
                    type="email"
                    placeholder="Entrer votre email"
                    value={personalDetails.email}
                    onChange={(event) => handleChange(event, 'email')}
                    className='input input-bordered w-full'
                    id=""
                />
                <input
                    type="tel"
                    placeholder="Entrer votre numéro de téléphone"
                    value={personalDetails.phone}
                    onChange={(event) => handleChange(event, 'phone')}
                    className='input input-bordered w-full ml-4'
                    id=""
                />
            </div>
            <input
                type="test"
                placeholder="Entrer votre adresse de résidence"
                value={personalDetails.address}
                onChange={(event) => handleChange(event, 'address')}
                className='input input-bordered w-full '
                id=""
            />
            <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                className='file-input file-input-bordered w-full file-input-primary'
            />

            <input
                type="text"
                placeholder="Entrer le poste rechercher"
                value={personalDetails.postSeeking}
                onChange={(event) => handleChange(event, 'postSeeking')}
                className='input input-bordered w-full'
                id=""
            />

            <textarea
                placeholder="Entrer une description de vous"
                value={personalDetails.description}
                onChange={(event) => handleChange(event, 'description')}
                className='input input-bordered w-full'
                id=""
            />




        </div>
    )
}

export default PersonalDetailForm
