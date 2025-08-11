"use client";
import React, { useState, useEffect } from 'react';

import { FileText, Trash2, Eye, Plus, Calendar, Globe, User } from 'lucide-react';
import AuthManager from '@/app/utils/AuthManager';
import CvStorageManager, { SavedCv } from '@/app/utils/CvStorageManager';
import CountryManager from '@/app/utils/CountryManager';
import { User as UserType } from '@/type';
import { useRouter } from 'next/navigation';

export default function MyCvPage() {
  // const { isDarkMode } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [myCvs, setMyCvs] = useState<SavedCv[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Vérifier l'authentification seulement côté client
    if (typeof window === 'undefined') return;
    
    // Vérifier l'authentification
    if (!AuthManager.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const currentUser = AuthManager.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadUserCvs();
    }
  }, [router]);

  const loadUserCvs = () => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      // Charger tous les CV et filtrer par utilisateur
      const allCvs = CvStorageManager.getSavedCvs();
      const currentUser = AuthManager.getCurrentUser();
      
      if (currentUser) {
        // Filtrer les CV par utilisateur (basé sur l'email pour l'instant)
        const userCvs = allCvs.filter(cv => {
          // Si le CV a des données personnelles avec un email, on compare
          if (cv.data.personalDetails.email) {
            return cv.data.personalDetails.email === currentUser.email;
          }
          // Sinon, on considère que tous les CV sans email appartiennent à l'utilisateur courant
          // (pour la compatibilité avec les anciens CV)
          return !cv.data.personalDetails.email;
        });
        setMyCvs(userCvs);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des CV:', error);
      setMyCvs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCvs = searchQuery
    ? myCvs.filter(cv => {
        const searchTerm = searchQuery.toLowerCase();
        return cv.name.toLowerCase().includes(searchTerm) ||
               (cv.data.personalDetails.fullName || '').toLowerCase().includes(searchTerm) ||
               (cv.data.personalDetails.email || '').toLowerCase().includes(searchTerm);
      })
    : myCvs;

  const handleDeleteCv = async (cvId: string) => {
    if (!isClient || typeof window === 'undefined') return;
    
    const cvToDelete = myCvs.find(cv => cv.id === cvId);
    const cvName = cvToDelete?.name || 'ce CV';
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${cvName}" ?`)) {
      try {
        CvStorageManager.deleteCv(cvId);
        setMyCvs(myCvs.filter(cv => cv.id !== cvId));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du CV. Veuillez réessayer.');
      }
    }
  };

  const handleEditCv = (cvId: string) => {
    const cv = myCvs.find(c => c.id === cvId);
    if (cv) {
      // Charger le CV dans l'éditeur
      router.push(`/cv-pro?loadCv=${cvId}`);
    }
  };

  const getCountryInfo = () => {
    // Essayer de déterminer le pays basé sur le thème ou d'autres données
    // Pour l'instant, on utilise le pays de l'utilisateur
    if (user && user.country) {
      return CountryManager.getCountryByCode(user.country);
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Tenena
                </span>
              </h1>
              <p className="text-base-content/60 mt-1">Mes CV sauvegardés</p>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span>{user.fullName}</span>
                  {getCountryInfo() && (
                    <div className="badge badge-outline">
                      {getCountryInfo()?.flag} {getCountryInfo()?.name}
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={() => router.push('/cv-pro')}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4" />
                Nouveau CV
              </button>
              
              <button
                onClick={() => {
                  AuthManager.logout();
                  router.push('/');
                }}
                className="btn btn-ghost btn-sm"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Barre de recherche et statistiques */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <FileText className="w-8 h-8" />
              </div>
              <div className="stat-title">Total CV</div>
              <div className="stat-value text-primary">{myCvs.length}</div>
            </div>
          </div>

          <div className="form-control w-full max-w-xs">
            <input
              type="text"
              placeholder="Rechercher un CV..."
              className="input input-bordered"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Liste des CV */}
        {myCvs.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-24 h-24 mx-auto text-base-content/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun CV sauvegardé</h3>
            <p className="text-base-content/60 mb-6">
              Commencez par créer votre premier CV professionnel
            </p>
            <button
              onClick={() => router.push('/cv-pro')}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Créer mon premier CV
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCvs.map((cv) => (
              <div key={cv.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body">
                  {/* En-tête du CV */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="card-title text-lg truncate">{cv.name}</h3>
                      <p className="text-sm text-base-content/60 truncate">
                        {cv.data.personalDetails.fullName || 'Sans nom'}
                      </p>
                    </div>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-sm">
                        •••
                      </label>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                          <a onClick={() => handleEditCv(cv.id)}>
                            <Eye className="w-4 h-4" />
                            Modifier
                          </a>
                        </li>
                        <li>
                          <a onClick={() => handleDeleteCv(cv.id)} className="text-error">
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Informations du CV */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Créé le {new Date(cv.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4" />
                      <span>Thème: {cv.data.theme || 'Standard'}</span>
                    </div>

                    {cv.data.experiences && cv.data.experiences.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">{cv.data.experiences.length}</span> expérience(s)
                      </div>
                    )}

                    {cv.data.educations && cv.data.educations.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">{cv.data.educations.length}</span> formation(s)
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-end">
                    <button
                      onClick={() => handleEditCv(cv.id)}
                      className="btn btn-primary btn-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Ouvrir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message si aucun résultat de recherche */}
        {filteredCvs.length === 0 && searchQuery && myCvs.length > 0 && (
          <div className="text-center py-16">
            <p className="text-base-content/60">
              Aucun CV trouvé pour &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
