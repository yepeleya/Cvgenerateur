'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Clock, Star, Calendar, Trash2, Edit, Download } from 'lucide-react';
import CvStorageManager, { SavedCv } from '@/app/utils/CvStorageManager';
import PdfGenerationModal from './PdfGenerationModal';

interface CvGridProps {
  searchQuery: string;
  viewMode: 'grid' | 'list';
  onEditCv: (cvId: string) => void;
}

export default function CvGrid({ searchQuery, viewMode, onEditCv }: CvGridProps) {
  const [cvs, setCvs] = useState<SavedCv[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCvs, setSelectedCvs] = useState<string[]>([]);
  
  // États pour le modal PDF
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedCvForPdf, setSelectedCvForPdf] = useState<SavedCv | null>(null);

  useEffect(() => {
    loadCvs();
  }, []);

  const loadCvs = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const allCvs = CvStorageManager.getSavedCvs();
      setCvs(allCvs);
    } catch (error) {
      console.error('Erreur lors du chargement des CV:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCvs = searchQuery
    ? cvs.filter(cv => 
        cv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.data.personalDetails.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cvs;

  const handleDeleteCv = (cvId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
      try {
        CvStorageManager.deleteCv(cvId);
        setCvs(cvs.filter(cv => cv.id !== cvId));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleDownloadCv = async (cv: SavedCv) => {
    try {
      // Utiliser le nouveau modal PDF au lieu d'ouvrir un nouvel onglet
      setSelectedCvForPdf(cv);
      setShowPdfModal(true);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du CV');
    }
  };

  const toggleCvSelection = (cvId: string) => {
    setSelectedCvs(prev => 
      prev.includes(cvId) 
        ? prev.filter(id => id !== cvId)
        : [...prev, cvId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (cvs.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="w-24 h-24 mx-auto text-base-content/30 mb-6" />
        <h3 className="text-2xl font-bold mb-4">Aucun CV créé</h3>
        <p className="text-base-content/60 mb-8 max-w-md mx-auto">
          Commencez par créer votre premier CV professionnel avec notre éditeur avancé
        </p>
        <button
          onClick={() => onEditCv('')}
          className="btn btn-primary btn-lg gap-2"
        >
          <FileText className="w-5 h-5" />
          Créer mon premier CV
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      {selectedCvs.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-primary font-medium">
              {selectedCvs.length} CV(s) sélectionné(s)
            </span>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-ghost">
                Exporter
              </button>
              <button 
                className="btn btn-sm btn-error"
                onClick={() => {
                  if (confirm(`Supprimer ${selectedCvs.length} CV(s) ?`)) {
                    selectedCvs.forEach(cvId => {
                      CvStorageManager.deleteCv(cvId);
                    });
                    setCvs(cvs.filter(cv => !selectedCvs.includes(cv.id)));
                    setSelectedCvs([]);
                  }
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CV Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCvs.map((cv) => (
            <div key={cv.id} className="group relative">
              <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Selection Checkbox */}
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={selectedCvs.includes(cv.id)}
                    onChange={() => toggleCvSelection(cv.id)}
                  />
                </div>

                {/* CV Preview */}
                <div className="relative h-48 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-primary/30" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="badge badge-primary badge-sm">
                      {cv.data.theme}
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="card-title text-lg truncate flex-1">{cv.name}</h3>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-opacity">
                        •••
                      </label>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                          <a onClick={() => onEditCv(cv.id)}>
                            <Edit className="w-4 h-4" />
                            Modifier
                          </a>
                        </li>
                        <li>
                          <a onClick={() => handleDownloadCv(cv)}>
                            <Download className="w-4 h-4" />
                            Télécharger
                          </a>
                        </li>
                        <li>
                          <a className="text-error" onClick={() => handleDeleteCv(cv.id)}>
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-base-content/60 text-sm truncate mb-3">
                    {cv.data.personalDetails.fullName}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-base-content/50">
                      <Calendar className="w-3 h-3" />
                      <span>Créé le {new Date(cv.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-base-content/50">
                      <Clock className="w-3 h-3" />
                      <span>Modifié {new Date(cv.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-warning" fill="currentColor" />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadCv(cv)}
                        className="btn btn-outline btn-sm"
                        title="Télécharger le CV"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditCv(cv.id)}
                        className="btn btn-primary btn-sm"
                        title="Modifier le CV"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCvs.map((cv) => (
            <div key={cv.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={selectedCvs.includes(cv.id)}
                    onChange={() => toggleCvSelection(cv.id)}
                  />
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{cv.name}</h3>
                    <p className="text-base-content/60">{cv.data.personalDetails.fullName}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-base-content/50">
                      <span>Créé: {new Date(cv.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Thème: {cv.data.theme}</span>
                      <span>•</span>
                      <span>{cv.data.experiences.length} expérience(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-warning" fill="currentColor" />
                      ))}
                    </div>
                    <button
                      onClick={() => handleDownloadCv(cv)}
                      className="btn btn-outline btn-sm"
                      title="Télécharger le CV"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditCv(cv.id)}
                      className="btn btn-primary btn-sm"
                      title="Modifier le CV"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {filteredCvs.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-base-content/60">
            Aucun CV trouvé pour &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
      
      {/* Modal de génération PDF */}
      <PdfGenerationModal
        isOpen={showPdfModal}
        onClose={() => {
          setShowPdfModal(false);
          setSelectedCvForPdf(null);
        }}
        cv={selectedCvForPdf}
      />
    </div>
  );
}
