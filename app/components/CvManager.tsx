"use client";
import { useState, useEffect } from 'react';
import { Save, FolderOpen, Download, Upload, Trash2 } from 'lucide-react';
import CvStorageManager, { SavedCv, CvData } from '../utils/CvStorageManager';

interface CvManagerProps {
  currentCvData: CvData;
  onLoadCv: (cvData: CvData) => void;
}

export default function CvManager({ currentCvData, onLoadCv }: CvManagerProps) {
  const [savedCvs, setSavedCvs] = useState<SavedCv[]>([]);
  const [saveName, setSaveName] = useState('');
  const [showManager, setShowManager] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // S'assurer qu'on est côté client
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setSavedCvs(CvStorageManager.getSavedCvs());
    }
  }, []);

  const handleSaveCv = () => {
    if (!isClient || !saveName.trim()) return;
    
    try {
      CvStorageManager.saveNamedCv(saveName, currentCvData);
      setSavedCvs(CvStorageManager.getSavedCvs());
      setSaveName('');
      alert('CV sauvegardé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleLoadCv = (cvId: string) => {
    if (!isClient) return;
    
    const savedCv = CvStorageManager.loadCv(cvId);
    if (savedCv) {
      onLoadCv(savedCv.data);
      setShowManager(false);
      alert('CV chargé avec succès !');
    }
  };

  const handleDeleteCv = (cvId: string) => {
    if (!isClient) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
      try {
        CvStorageManager.deleteCv(cvId);
        setSavedCvs(CvStorageManager.getSavedCvs());
        alert('CV supprimé avec succès !');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleExportCvs = () => {
    if (!isClient) return;
    
    const data = CvStorageManager.exportAllCvs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-builder-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportCvs = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isClient) return;
    
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          CvStorageManager.importCvs(data);
          setSavedCvs(CvStorageManager.getSavedCvs());
          alert('CV importés avec succès !');
        } catch (error) {
          console.error('Erreur lors de l\'importation:', error);
          alert('Erreur lors de l\'importation. Vérifiez le format du fichier.');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  // Ne rien afficher tant qu'on n'est pas côté client
  if (!isClient) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Bouton pour ouvrir le gestionnaire */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowManager(!showManager)}
          className="btn btn-secondary btn-sm">
          <FolderOpen className="w-4 h-4" />
          Gérer les CV
        </button>
      </div>

      {/* Interface de gestion */}
      {showManager && (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body p-4">
            <h3 className="font-bold text-lg mb-4">Gestionnaire de CV</h3>
            
            {/* Sauvegarde rapide */}
            <div className="space-y-2 mb-4">
              <label className="label">
                <span className="label-text font-medium">Sauvegarder le CV actuel</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nom du CV..."
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  className="input input-bordered flex-1"
                />
                <button
                  onClick={handleSaveCv}
                  disabled={!saveName.trim()}
                  className="btn btn-primary">
                  <Save className="w-4 h-4" />
                  Sauver
                </button>
              </div>
            </div>

            <div className="divider"></div>

            {/* Actions d'import/export */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={handleExportCvs}
                className="btn btn-outline btn-sm">
                <Download className="w-4 h-4" />
                Exporter tous
              </button>
              <label className="btn btn-outline btn-sm">
                <Upload className="w-4 h-4" />
                Importer
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportCvs}
                  className="hidden"
                />
              </label>
            </div>

            {/* Liste des CV sauvegardés */}
            <div className="space-y-2">
              <h4 className="font-medium">CV sauvegardés ({savedCvs.length})</h4>
              {savedCvs.length === 0 ? (
                <p className="text-base-content/60 text-sm">Aucun CV sauvegardé</p>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {savedCvs.map((cv) => (
                    <div key={cv.id} className="flex items-center justify-between bg-base-100 p-3 rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium">{cv.name}</h5>
                        <p className="text-xs text-base-content/60">
                          Créé le {new Date(cv.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLoadCv(cv.id)}
                          className="btn btn-success btn-xs">
                          <FolderOpen className="w-3 h-3" />
                          Charger
                        </button>
                        <button
                          onClick={() => handleDeleteCv(cv.id)}
                          className="btn btn-error btn-xs">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
