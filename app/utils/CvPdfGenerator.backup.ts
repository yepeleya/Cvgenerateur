import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PersonalDetails, Experience, Education, Skill, Language, Hobby, CvTheme } from '@/type';

export interface CvData {
  personalDetails: PersonalDetails;
  experiences: Experience[];
  educations: Education[];
  competences: Skill[];
  languages: Language[];
  hobbies: Hobby[];
}

export class CvPdfGenerator {
  // Solution DÉFINITIVE OKLCH → Mode PDF avec couleurs HSL/HEX compatibles
  private static convertOklchColors(element: HTMLElement): void {
    console.log('🎨 ACTIVATION MODE PDF - Conversion OKLCH → HSL/HEX...');
    
    // ÉTAPE 1: Activer le mode PDF pour désactiver OKLCH
    document.body.classList.add('pdf-mode');
    element.classList.add('pdf-mode');
    
    // ÉTAPE 2: Supprimer TOUS les thèmes DaisyUI (source principale d'OKLCH)
    const allElementsForCleanup = element.querySelectorAll('*');
    allElementsForCleanup.forEach(el => {
      el.removeAttribute('data-theme');
      if (el.classList) {
        el.classList.remove(...Array.from(el.classList).filter(c => c.includes('theme')));
      }
    });

    // ÉTAPE 3: Injecter CSS MODE PDF avec couleurs HSL/HEX compatibles
    const pdfModeStyle = document.createElement('style');
    pdfModeStyle.id = 'pdf-mode-oklch-fix';
    pdfModeStyle.textContent = `
      /* MODE PDF - Remplacement OKLCH par HSL/HEX compatibles */
      .pdf-mode {
        /* Variables CSS racine avec HSL au lieu d'OKLCH */
        --primary: hsl(259, 94%, 51%);
        --primary-content: hsl(0, 0%, 100%);
        --secondary: hsl(314, 100%, 47%);
        --secondary-content: hsl(0, 0%, 100%);
        --accent: hsl(174, 60%, 51%);
        --accent-content: hsl(0, 0%, 0%);
        --neutral: hsl(214, 20%, 14%);
        --neutral-content: hsl(0, 0%, 100%);
        --base-100: hsl(0, 0%, 100%);
        --base-200: hsl(0, 0%, 95%);
        --base-300: hsl(180, 2%, 90%);
        --base-content: hsl(215, 28%, 17%);
        
        /* Couleurs forcées pour les éléments */
        color: #333333 !important;
        background-color: #ffffff !important;
      }
      
      /* Classes de couleurs spécifiques DaisyUI en mode PDF */
      .pdf-mode .text-primary { color: hsl(259, 94%, 51%) !important; }
      .pdf-mode .text-secondary { color: hsl(314, 100%, 47%) !important; }
      .pdf-mode .text-accent { color: hsl(174, 60%, 51%) !important; }
      .pdf-mode .text-neutral { color: hsl(214, 20%, 14%) !important; }
      .pdf-mode .text-base-content { color: hsl(215, 28%, 17%) !important; }
      
      .pdf-mode .bg-primary { background-color: hsl(259, 94%, 51%) !important; color: white !important; }
      .pdf-mode .bg-secondary { background-color: hsl(314, 100%, 47%) !important; color: white !important; }
      .pdf-mode .bg-accent { background-color: hsl(174, 60%, 51%) !important; color: black !important; }
      .pdf-mode .bg-neutral { background-color: hsl(214, 20%, 14%) !important; color: white !important; }
      .pdf-mode .bg-base-100 { background-color: hsl(0, 0%, 100%) !important; }
      .pdf-mode .bg-base-200 { background-color: hsl(0, 0%, 95%) !important; }
      .pdf-mode .bg-base-300 { background-color: hsl(180, 2%, 90%) !important; }
      
      /* Classes Tailwind courantes */
      .pdf-mode .text-orange-600 { color: #ea580c !important; }
      .pdf-mode .text-blue-600 { color: #2563eb !important; }
      .pdf-mode .text-gray-600 { color: #4b5563 !important; }
      .pdf-mode .text-gray-700 { color: #374151 !important; }
      .pdf-mode .text-gray-800 { color: #1f2937 !important; }
      
      .pdf-mode .bg-orange-100 { background-color: #fed7aa !important; }
      .pdf-mode .bg-blue-100 { background-color: #dbeafe !important; }
      .pdf-mode .bg-gray-50 { background-color: #f9fafb !important; }
      
      /* Bordures */
      .pdf-mode .border-orange-300 { border-color: #fdba74 !important; }
      .pdf-mode .border-blue-500 { border-color: #3b82f6 !important; }
      
      /* Suppression complète des variables CSS problématiques */
      .pdf-mode * {
        --tw-bg-opacity: 1 !important;
        --tw-text-opacity: 1 !important;
        --tw-border-opacity: 1 !important;
      }
    `;
    document.head.appendChild(pdfModeStyle);

    // ÉTAPE 4: Forcer les styles inline pour être sûr
    console.log(`🔧 Forçage manuel des couleurs sur ${allElementsForCleanup.length} éléments...`);
    
    allElementsForCleanup.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        try {
          // Supprimer TOUT style inline contenant oklch
          const inlineStyle = el.getAttribute('style');
          if (inlineStyle) {
            if (inlineStyle.includes('oklch') || inlineStyle.includes('--')) {
              el.removeAttribute('style');
              console.log(`🗑️ Style inline OKLCH supprimé de l'élément ${index}`);
            } else {
              // Nettoyer les propriétés CSS une par une
              const cleanStyle = inlineStyle
                .replace(/oklch\([^)]+\)/g, '#333333')
                .replace(/--[^:;]+:[^;]+;?/g, '')
                .replace(/;+/g, ';')
                .replace(/^;+|;+$/g, '');
              
              if (cleanStyle !== inlineStyle) {
                el.setAttribute('style', cleanStyle);
                console.log(`� Style inline nettoyé pour l'élément ${index}`);
              }
            }
          }
          
          // Forcer des styles de base ULTRA-SIMPLES
          if (el.classList.contains('text-orange-600') || el.classList.contains('text-primary')) {
            el.style.setProperty('color', '#e67e22', 'important');
          }
          if (el.classList.contains('text-blue-600')) {
            el.style.setProperty('color', '#3498db', 'important');
          }
          if (el.classList.contains('bg-primary')) {
            el.style.setProperty('background-color', '#3498db', 'important');
            el.style.setProperty('color', '#ffffff', 'important');
          }
          if (el.classList.contains('bg-orange-100')) {
            el.style.setProperty('background-color', '#fdeaa7', 'important');
          }
          if (el.classList.contains('bg-blue-100')) {
            el.style.setProperty('background-color', '#dff9fb', 'important');
          }
          
        } catch (err) {
          console.warn(`⚠️ Erreur lors du nettoyage de l'élément ${index}:`, err);
        }
      }
    });

    // ÉTAPE 4: Attendre que les styles soient VRAIMENT appliqués
    console.log('⏳ Attente de l\'application des styles...');
    
    // Nettoyer après un délai plus long
    setTimeout(() => {
      const styleEl = document.getElementById('ultra-basic-pdf-style');
      if (styleEl?.parentNode) {
        document.head.removeChild(styleEl);
        console.log('🧹 Style ultra-basique supprimé');
      }
    }, 2000); // Délai plus long pour s'assurer que html2canvas a terminé
    
    console.log('✅ Nettoyage ULTRA-AGRESSIF terminé');
  }

  // Méthode pour nettoyer le mode PDF et restaurer l'état normal
  private static cleanupPdfMode(): void {
    console.log('🧹 Nettoyage du mode PDF...');
    
    // Supprimer la classe pdf-mode
    document.body.classList.remove('pdf-mode');
    
    // Supprimer le style injecté
    const pdfModeStyle = document.getElementById('pdf-mode-oklch-fix');
    if (pdfModeStyle?.parentNode) {
      document.head.removeChild(pdfModeStyle);
    }
    
    const ultraBasicStyle = document.getElementById('ultra-basic-pdf-style');
    if (ultraBasicStyle?.parentNode) {
      document.head.removeChild(ultraBasicStyle);
    }
    
    const forceBasicTheme = document.getElementById('force-basic-theme-pdf');
    if (forceBasicTheme?.parentNode) {
      document.head.removeChild(forceBasicTheme);
    }
    
    console.log('✅ Mode PDF nettoyé');
  }

  static async downloadPdf(cvData: CvData): Promise<boolean> {
    try {
      const fileName = `CV_${cvData.personalDetails.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('🚀 Début de la génération PDF pour:', fileName);
      
      // SOLUTION ULTRA-AGRESSIVE: Forcer un thème sans OKLCH AVANT la génération
      console.log('🎨 Préparation ultra-agressive de l\'environnement...');
      
      // 1. Sauvegarder le thème actuel
      const originalTheme = document.documentElement.getAttribute('data-theme');
      
      // 2. Forcer un thème ultra-basique SANS OKLCH
      document.documentElement.removeAttribute('data-theme');
      document.body.removeAttribute('data-theme');
      
      // 3. Injecter un CSS de base ultra-simple
      const forceBasicTheme = document.createElement('style');
      forceBasicTheme.id = 'force-basic-theme-pdf';
      forceBasicTheme.textContent = `
        :root {
          --color-primary: #3498db;
          --color-secondary: #2c3e50;
          --color-accent: #e67e22;
          --color-neutral: #7f8c8d;
          --color-base-100: #ffffff;
          --color-base-200: #f8f9fa;
          --color-base-300: #e9ecef;
          --color-base-content: #2c3e50;
        }
        
        * {
          --tw-bg-opacity: 1 !important;
          --tw-text-opacity: 1 !important;
          --tw-border-opacity: 1 !important;
        }
      `;
      document.head.appendChild(forceBasicTheme);
      
      // Attendre que le nouveau thème soit appliqué
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await this.generatePdf('cv-preview-container', fileName);
      console.log('✅ Résultat de génération PDF:', result);
      
      // 4. Restaurer le thème original et nettoyer
      setTimeout(() => {
        if (originalTheme) {
          document.documentElement.setAttribute('data-theme', originalTheme);
        }
        
        // Utiliser la nouvelle méthode de nettoyage
        this.cleanupPdfMode();
        
        console.log('🔄 Thème original restauré');
      }, 3000);
      
      return result;
    } catch (error) {
      console.error('❌ Erreur dans downloadPdf:', error);
      
      // Ne pas relancer l'erreur, juste retourner false
      // pour éviter les problèmes de communication asynchrone
      return false;
    }
  }

  // Version ultra-robuste qui gère TOUS les cas d'erreur
  private static async generatePdf(elementId: string, fileName: string): Promise<boolean> {
    let clonedElement: HTMLElement | null = null;
    
    try {
      console.log('🔍 Recherche de l\'élément:', elementId);
      
      // ÉTAPE 1: Trouver l'élément avec plusieurs tentatives
      let element = document.getElementById(elementId);
      let attempts = 0;
      const maxAttempts = 15;
      
      while (!element && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 300));
        element = document.getElementById(elementId);
        attempts++;
        console.log(`⏳ Tentative ${attempts}/${maxAttempts}: Recherche de l'élément`);
      }
      
      if (!element) {
        console.error('❌ Élément non trouvé après', maxAttempts, 'tentatives');
        return false;
      }

      console.log('✅ Élément trouvé, préparation pour la capture...');

      // ÉTAPE 2: Créer un clone COMPLET de l'élément
      clonedElement = element.cloneNode(true) as HTMLElement;
      
      // ÉTAPE 3: Nettoyer AGRESSIVEMENT les couleurs OKLCH
      console.log('🎨 Nettoyage des couleurs OKLCH...');
      this.convertOklchColors(clonedElement);
      
      // ÉTAPE 4: Préparer l'élément pour la capture (invisible)
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-10000px';
      clonedElement.style.top = '0';
      clonedElement.style.zIndex = '-9999';
      clonedElement.style.visibility = 'hidden';
      clonedElement.style.pointerEvents = 'none';
      
      // ÉTAPE 5: Ajouter temporairement au DOM
      document.body.appendChild(clonedElement);
      
      // ÉTAPE 6: Attendre BEAUCOUP plus longtemps que tout soit rendu et que les styles OKLCH soient éliminés
      console.log('⏳ Attente de 2.5 secondes pour l\'application complète des styles...');
      await new Promise(resolve => setTimeout(resolve, 2500)); // Augmenté à 2.5 secondes

      console.log('📸 Début de la capture avec html2canvas...');
      
      // ÉTAPE 7: Capturer avec configuration ultra-sécurisée
      const canvas = await html2canvas(clonedElement, {
        useCORS: true,
        allowTaint: false,
        background: '#ffffff',
        logging: false
      });

      console.log('✅ Capture terminée, dimensions:', canvas.width, 'x', canvas.height);

      // ÉTAPE 8: Créer le PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Calculer les dimensions optimales
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Ajouter la première page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= pageHeight;

      // Ajouter des pages supplémentaires si nécessaire
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
      }

      // ÉTAPE 9: Télécharger le PDF
      console.log('💾 Téléchargement du PDF:', fileName);
      pdf.save(fileName);
      console.log('🎉 PDF téléchargé avec succès !');
      
      return true;

    } catch (error) {
      console.error('💥 Erreur lors de la génération PDF:', error);
      
      // Gestion spécifique des erreurs
      if (error instanceof Error) {
        if (error.message.includes('oklch') || error.message.includes('color function')) {
          console.error('🎨 Erreur de couleur OKLCH détectée');
        } else if (error.message.includes('tainted')) {
          console.error('🖼️ Erreur d\'image externe détectée');
        } else if (error.message.includes('network') || error.message.includes('Network')) {
          console.error('🌐 Erreur réseau détectée');
        }
      }
      
      return false;
    } finally {
      // ÉTAPE 10: Nettoyage OBLIGATOIRE
      try {
        if (clonedElement && clonedElement.parentNode) {
          document.body.removeChild(clonedElement);
          console.log('🧹 Élément cloné supprimé');
        }
        
        // Supprimer le style OKLCH killer s'il existe
        const oklchKiller = document.getElementById('oklch-killer');
        if (oklchKiller && oklchKiller.parentNode) {
          document.head.removeChild(oklchKiller);
          console.log('🧹 Style OKLCH killer supprimé');
        }
      } catch (cleanupError) {
        console.warn('⚠️ Erreur lors du nettoyage:', cleanupError);
      }
    }
  }

}

export class CvStorageManager {
  private static readonly STORAGE_KEY = 'saved_cvs';

  static saveCv(cvData: CvData, theme: CvTheme, templateId: string): { success: boolean; message: string } {
    try {
      const existingCvs = this.getSavedCvs();
      const cvId = `cv_${Date.now()}`;
      
      const newCv = {
        id: cvId,
        data: cvData,
        theme,
        templateId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: cvData.personalDetails.fullName || 'CV sans nom'
      };

      existingCvs.push(newCv);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingCvs));

      return {
        success: true,
        message: `CV "${newCv.name}" sauvegardé avec succès !`
      };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return {
        success: false,
        message: 'Erreur lors de la sauvegarde. Veuillez réessayer.'
      };
    }
  }

  static getSavedCvs(): Array<{
    id: string;
    data: CvData;
    theme: CvTheme;
    templateId: string;
    createdAt: string;
    updatedAt: string;
    name: string;
  }> {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Erreur lors du chargement des CVs:', error);
      return [];
    }
  }

  static updateCv(cvId: string, cvData: CvData, theme: CvTheme): { success: boolean; message: string } {
    try {
      const existingCvs = this.getSavedCvs();
      const cvIndex = existingCvs.findIndex(cv => cv.id === cvId);
      
      if (cvIndex === -1) {
        return {
          success: false,
          message: 'CV non trouvé'
        };
      }

      existingCvs[cvIndex] = {
        ...existingCvs[cvIndex],
        data: cvData,
        theme,
        updatedAt: new Date().toISOString(),
        name: cvData.personalDetails.fullName || 'CV sans nom'
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingCvs));

      return {
        success: true,
        message: `CV "${existingCvs[cvIndex].name}" mis à jour avec succès !`
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      return {
        success: false,
        message: 'Erreur lors de la mise à jour. Veuillez réessayer.'
      };
    }
  }

  static deleteCv(cvId: string): { success: boolean; message: string } {
    try {
      const existingCvs = this.getSavedCvs();
      const filteredCvs = existingCvs.filter(cv => cv.id !== cvId);
      
      if (filteredCvs.length === existingCvs.length) {
        return {
          success: false,
          message: 'CV non trouvé'
        };
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredCvs));

      return {
        success: true,
        message: 'CV supprimé avec succès !'
      };
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return {
        success: false,
        message: 'Erreur lors de la suppression. Veuillez réessayer.'
      };
    }
  }
}
