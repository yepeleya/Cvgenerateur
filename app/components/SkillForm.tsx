import { Skill } from '@/type';
import { Plus, X } from 'lucide-react';
import React, { useState } from 'react'

type Props = {
    skills: Skill[];
    setSkills: (skills: Skill[]) => void;
}

const SkillForm: React.FC<Props> = ({ skills, setSkills }) => {
    const [errors, setErrors] = useState<Partial<Record<keyof Skill, string>>>({});
    const [newSkill, setNewSkill] = useState<Skill>({
        name: ""
    });

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        field: keyof Skill
    ) => {
        setNewSkill({ ...newSkill, [field]: event.target.value });
        setErrors({ ...errors, [field]: "" });
    };

    const handleAddSkill = () => {
        const newErrors: Partial<Record<keyof Skill, string>> = {};

        if (!newSkill.name.trim()) {
            newErrors.name = "Compétence requise";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Vérifier si la compétence existe déjà
        if (skills.some(skill => skill.name.toLowerCase() === newSkill.name.toLowerCase())) {
            setErrors({ name: "Cette compétence existe déjà" });
            return;
        }

        setSkills([...skills, { ...newSkill, id: Date.now().toString() }]);
        setNewSkill({ name: "" });
        setErrors({});
    };

    const handleRemoveSkill = (index: number) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddSkill();
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Compétences</h2>
                <p className="text-gray-600 mb-6">
                    Ajoutez vos compétences techniques et professionnelles
                </p>
            </div>

            {/* Add New Skill */}
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Entrez une compétence (ex: JavaScript, Marketing, Gestion d'équipe...)"
                            value={newSkill.name}
                            onChange={(event) => handleChange(event, 'name')}
                            onKeyPress={handleKeyPress}
                            className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                        />
                        {errors.name && (
                            <p className="text-error text-sm mt-1">{errors.name}</p>
                        )}
                    </div>
                    <button
                        onClick={handleAddSkill}
                        className="btn btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter
                    </button>
                </div>
            </div>

            {/* Skills List */}
            {skills.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Compétences ajoutées ({skills.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {skills.map((skill, index) => (
                            <div
                                key={skill.id || index}
                                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <span className="font-medium text-gray-900 flex-1">
                                    {skill.name}
                                </span>
                                <button
                                    onClick={() => handleRemoveSkill(index)}
                                    className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                                    title="Supprimer cette compétence"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Help Text */}
            <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    💡 Conseils pour vos compétences
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Incluez vos compétences techniques (langages, logiciels, outils)</li>
                    <li>• Ajoutez vos compétences transversales (leadership, communication)</li>
                    <li>• Mentionnez les certifications pertinentes</li>
                    <li>• Adaptez vos compétences au poste visé</li>
                </ul>
            </div>
        </div>
    );
};

export default SkillForm;
