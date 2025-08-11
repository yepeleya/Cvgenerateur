'use client';

import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar,
  Edit3,
  Save,
  Camera,
  Shield,
  Bell,
  Palette,
  Settings
} from 'lucide-react';
import { User as UserType } from '@/type';
import CountryManager from '@/app/utils/CountryManager';

interface UserProfileProps {
  user: UserType | null;
}

export default function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || 'FR',
    city: user?.city || '',
    website: user?.website || '',
    bio: user?.bio || ''
  });
  const [activeTab, setActiveTab] = useState('profile');

  const countries = CountryManager.getAllCountries();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Ici on pourrait sauvegarder les modifications
    console.log('Sauvegarde du profil:', formData);
    setIsEditing(false);
    // TODO: Implémenter la sauvegarde réelle
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: UserIcon },
    { id: 'preferences', label: 'Préférences', icon: Settings },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="max-w-4xl space-y-8">
      {/* En-tête du profil */}
      <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center text-4xl font-bold">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <button className="btn btn-sm btn-circle btn-primary absolute -bottom-2 -right-2">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Informations principales */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user?.fullName}</h1>
              <p className="text-base-content/70 mb-4">{user?.email}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                <div className="badge badge-primary badge-lg">
                  {CountryManager.getCountryByCode(user?.country || 'FR')?.flag} 
                  {CountryManager.getCountryByCode(user?.country || 'FR')?.name}
                </div>
                <div className="badge badge-secondary badge-lg">
                  <Calendar className="w-4 h-4 mr-1" />
                  Membre depuis 2024
                </div>
              </div>

              <div className="flex justify-center md:justify-start gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  <Edit3 className="w-4 h-4" />
                  Modifier le profil
                </button>
                <button className="btn btn-outline">
                  <Palette className="w-4 h-4" />
                  Thème
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-100 p-2 shadow-lg">
        {tabs.map(tab => (
          <a
            key={tab.id}
            className={`tab gap-2 ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </a>
        ))}
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'profile' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Informations personnelles</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline btn-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  Modifier
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Nom complet</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Téléphone</span>
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Pays</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Ville</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Site web</span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Parlez-nous de vous..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                  ></textarea>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn btn-primary"
                  >
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-base-content/50" />
                    <div>
                      <p className="text-sm text-base-content/50">Nom</p>
                      <p className="font-medium">{user?.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-base-content/50" />
                    <div>
                      <p className="text-sm text-base-content/50">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-base-content/50" />
                    <div>
                      <p className="text-sm text-base-content/50">Téléphone</p>
                      <p className="font-medium">{user?.phone || 'Non renseigné'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-base-content/50" />
                    <div>
                      <p className="text-sm text-base-content/50">Pays</p>
                      <p className="font-medium">
                        {CountryManager.getCountryByCode(user?.country || 'FR')?.flag} {' '}
                        {CountryManager.getCountryByCode(user?.country || 'FR')?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-base-content/50" />
                    <div>
                      <p className="text-sm text-base-content/50">Ville</p>
                      <p className="font-medium">{user?.city || 'Non renseigné'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-base-content/50" />
                    <div>
                      <p className="text-sm text-base-content/50">Site web</p>
                      <p className="font-medium">{user?.website || 'Non renseigné'}</p>
                    </div>
                  </div>
                </div>

                {user?.bio && (
                  <div>
                    <p className="text-sm text-base-content/50 mb-2">Bio</p>
                    <p className="text-base-content">{user.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-6">Préférences</h2>
            
            <div className="space-y-6">
              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Mode sombre automatique</span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>

              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Notifications par email</span>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Langue par défaut</span>
                </label>
                <select className="select select-bordered max-w-xs">
                  <option>Français</option>
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Format de date</span>
                </label>
                <select className="select select-bordered max-w-xs">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-6">Sécurité</h2>
            
            <div className="space-y-6">
              <div className="alert alert-info">
                <Shield className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">Sécurité du compte</h3>
                  <div className="text-xs">Dernière connexion: Aujourd&apos;hui à 14:32</div>
                </div>
              </div>

              <div className="space-y-4">
                <button className="btn btn-outline w-full justify-start">
                  Changer le mot de passe
                </button>
                <button className="btn btn-outline w-full justify-start">
                  Authentification à deux facteurs
                </button>
                <button className="btn btn-outline w-full justify-start">
                  Sessions actives
                </button>
                <button className="btn btn-error btn-outline w-full justify-start">
                  Supprimer le compte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Nouveaux CV créés</span>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
              </div>

              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Mises à jour du service</span>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
              </div>

              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Conseils et astuces</span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>

              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Newsletter marketing</span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
