import { PersonalDetails, Experience, Education, Language, Skill, Hobby, Country, CvTemplate, CvCustomization } from '@/type';

interface SimpleCvData {
  personalDetails: PersonalDetails;
  experiences: Experience[];
  educations: Education[];
  competences: Skill[];
  languages: Language[];
  hobbies: Hobby[];
}

export interface CvData {
  personalDetails: PersonalDetails;
  experiences: Experience[];
  educations: Education[];
  languages: Language[];
  competences: Skill[];
  hobbies: Hobby[];
  theme: string;
  customization?: CvCustomization; // Ajout des personnalisations complètes
  selectedCountry?: Country;
  selectedTemplate?: CvTemplate;
  createdAt: string;
  updatedAt: string;
}

export interface SavedCv {
  id: string;
  name: string;
  data: CvData;
  createdAt: string;
  updatedAt: string;
}

class CvStorageManager {
  private static readonly STORAGE_KEY = 'cv-builder-data';
  private static readonly CURRENT_CV_KEY = 'cv-builder-current';

  // Sauvegarder le CV actuel
  static saveCurrentCv(data: CvData): void {
    if (typeof window === 'undefined') return; // Vérification côté serveur
    
    try {
      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.CURRENT_CV_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw new Error('Impossible de sauvegarder le CV');
    }
  }

  // Charger le CV actuel
  static loadCurrentCv(): CvData | null {
    if (typeof window === 'undefined') return null; // Vérification côté serveur
    
    try {
      const saved = localStorage.getItem(this.CURRENT_CV_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      return null;
    }
  }

  // Sauvegarder un CV avec un nom
  static saveNamedCv(name: string, data: CvData): string {
    if (typeof window === 'undefined') throw new Error('localStorage non disponible');
    
    try {
      const cvId = `cv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const savedCv: SavedCv = {
        id: cvId,
        name: name.trim() || 'CV sans nom',
        data: {
          ...data,
          updatedAt: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const existingCvs = this.getSavedCvs();
      existingCvs.push(savedCv);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingCvs));
      
      return cvId;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde nommée:', error);
      throw new Error('Impossible de sauvegarder le CV');
    }
  }

  // Obtenir tous les CV sauvegardés
  static getSavedCvs(): SavedCv[] {
    // Vérification côté serveur plus robuste
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return [];
    }
    
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des CV:', error);
      return [];
    }
  }

  // Charger un CV spécifique
  static loadCv(cvId: string): SavedCv | null {
    try {
      const savedCvs = this.getSavedCvs();
      return savedCvs.find(cv => cv.id === cvId) || null;
    } catch (error) {
      console.error('Erreur lors du chargement du CV:', error);
      return null;
    }
  }

  // Supprimer un CV
  static deleteCv(cvId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const savedCvs = this.getSavedCvs();
      const updatedCvs = savedCvs.filter(cv => cv.id !== cvId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedCvs));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw new Error('Impossible de supprimer le CV');
    }
  }

  // Exporter tous les CV
  static exportAllCvs(): string {
    const savedCvs = this.getSavedCvs();
    return JSON.stringify(savedCvs, null, 2);
  }

  // Importer des CV
  static importCvs(jsonData: string): void {
    if (typeof window === 'undefined') throw new Error('localStorage non disponible');
    
    try {
      const importedCvs: SavedCv[] = JSON.parse(jsonData);
      const existingCvs = this.getSavedCvs();
      
      // Éviter les doublons en vérifiant les IDs
      const newCvs = importedCvs.filter(
        imported => !existingCvs.some(existing => existing.id === imported.id)
      );
      
      const allCvs = [...existingCvs, ...newCvs];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allCvs));
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      throw new Error('Format de fichier invalide');
    }
  }

  // Récupérer un CV spécifique par son ID
  static getSavedCv(id: string): SavedCv | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const savedCvs = this.getSavedCvs();
      return savedCvs.find(cv => cv.id === id) || null;
    } catch (error) {
      console.error('Erreur lors du chargement du CV:', error);
      return null;
    }
  }

  /**
   * Méthode de compatibilité pour sauvegarder un CV avec retour de statut
   */
  static saveCv(data: SimpleCvData): { success: boolean; message: string } {
    try {
      // Adapter les données au format CvData complet
      const now = new Date().toISOString();
      const fullCvData: CvData = {
        ...data,
        theme: 'default',
        createdAt: now,
        updatedAt: now
      };
      
      // Sauvegarde auto et nommée
      this.saveCurrentCv(fullCvData);
      const cvId = this.saveNamedCv(`CV-${data.personalDetails?.fullName || 'Anonyme'}`, fullCvData);
      
      return {
        success: true,
        message: `CV sauvegardé avec succès (ID: ${cvId})`
      };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return {
        success: false,
        message: 'Erreur lors de la sauvegarde du CV'
      };
    }
  }
}

export default CvStorageManager;
