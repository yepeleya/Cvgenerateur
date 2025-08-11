import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PersonalDetails, Experience, Education, Skill, Language, Hobby } from '@/type';
import * as culori from 'culori';

export interface CvData {
  personalDetails: PersonalDetails;
  experiences: Experience[];
  educations: Education[];
  competences: Skill[];
  languages: Language[];
  hobbies: Hobby[];
}

/**
 * HELPER DE PURGE OKLCH : Conversion définitive OKLCH → RGB avec culori
 * Écrase directement les valeurs calculées juste avant la capture
 * PURGE GLOBALE : Scanne TOUT le document pour éliminer OKLCH partout
 */
// Conversion OKLCH -> RGB (sécurisée)
const convertOklchInString = (input: string): string => {
  return input.replace(/oklch\([^)]+\)/gi, (m) => {
    try { const parsed = culori.parse(m); return parsed ? (culori.formatRgb(parsed) || 'rgb(0,0,0)') : 'rgb(0,0,0)'; } catch { return 'rgb(0,0,0)'; }
  });
};

// Construit un clone "canvas safe" : toutes les couleurs résolues et inlinées, aucune trace OKLCH
function buildCanvasSafeClone(source: HTMLElement): HTMLElement {
  // Fonction utilitaire pour convertir les couleurs OKLCH en RGB dans tous les styles inline du clone
  // Convertit toutes les couleurs OKLCH en RGB dans les styles inline ET calculés
  const convertOklchInElement = (el: HTMLElement) => {
    // Pour chaque propriété CSS calculée, si elle contient oklch, on la convertit en RGB inline
    const computed = window.getComputedStyle(el);
    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i];
      const val = computed.getPropertyValue(prop);
      if (val && val.includes('oklch')) {
        el.style.setProperty(prop, convertOklchInString(val));
      }
    }
    // Parcours récursif
    Array.from(el.children).forEach(child => {
      if (child instanceof HTMLElement) convertOklchInElement(child);
    });
  };
  // Clone profond du contenu du CV avec styles inline pour conserver la personnalisation
  const clone = source.cloneNode(true) as HTMLElement;
  clone.id = 'cv-canvas-safe-clone';
  clone.style.position = 'absolute';
  clone.style.left = '-10000px';
  clone.style.top = '0';
  clone.style.pointerEvents = 'none';
  // Optionnel : forcer un fond blanc pour éviter les fonds transparents
  clone.style.background = '#fff';
  // Astuce : copier les styles calculés pour chaque élément (pour garder la personnalisation)
  const copyComputedStyles = (src: HTMLElement, dest: HTMLElement) => {
    const computed = window.getComputedStyle(src);
    for (const key of computed) {
      dest.style.setProperty(key, computed.getPropertyValue(key));
    }
    Array.from(src.children).forEach((child, i) => {
      if (dest.children[i]) copyComputedStyles(child as HTMLElement, dest.children[i] as HTMLElement);
    });
  };
  copyComputedStyles(source, clone);
  // Conversion OKLCH → RGB sur tout le clone
  convertOklchInElement(clone);
  // 1. Conversion des variables CSS (custom properties) dans le style du clone
  const styleVars = window.getComputedStyle(source);
  for (let i = 0; i < styleVars.length; i++) {
    const prop = styleVars[i];
    if (prop.startsWith('--')) {
      const val = styleVars.getPropertyValue(prop);
      if (val && val.includes('oklch')) {
        clone.style.setProperty(prop, convertOklchInString(val));
      }
    }
  }
  // (On retire le style global qui forçait noir/blanc pour permettre la personnalisation réelle)
  // 3. Parcours récursif du clone pour remplacer toutes les couleurs OKLCH dans tous les styles calculés et variables CSS
  const purgeOklchRecursive = (el: HTMLElement) => {
    const computed = window.getComputedStyle(el);
    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i];
      const val = computed.getPropertyValue(prop);
      if (val && val.includes('oklch')) {
        el.style.setProperty(prop, convertOklchInString(val));
      }
    }
    // Variables CSS
    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i];
      if (prop.startsWith('--')) {
        const val = computed.getPropertyValue(prop);
        if (val && val.includes('oklch')) {
          el.style.setProperty(prop, convertOklchInString(val));
        }
      }
    }
    // Pseudo-éléments (before/after)
    ['::before', '::after'].forEach(pseudo => {
      const pseudoStyle = window.getComputedStyle(el, pseudo);
      for (let i = 0; i < pseudoStyle.length; i++) {
        const prop = pseudoStyle[i];
        const val = pseudoStyle.getPropertyValue(prop);
        if (val && val.includes('oklch')) {
          el.style.setProperty(prop, convertOklchInString(val));
        }
      }
    });
    Array.from(el.children).forEach(child => {
      if (child instanceof HTMLElement) purgeOklchRecursive(child);
    });
  };
  purgeOklchRecursive(clone);
  // 4. Désactiver tous les liens <link rel=stylesheet> dans le clone
  Array.from(clone.querySelectorAll('link[rel="stylesheet"]')).forEach((link: Element) => {
    (link as HTMLLinkElement).disabled = true;
  });
  console.log('✅ Clone PDF : purge OKLCH récursive et désactivation des stylesheets effectuée.');
  return clone;
}

// Diagnostic : détecter et logger les couleurs OKLCH restantes (avant html2canvas)
function logRemainingOklch(tag: string, root: ParentNode = document): void {
  const rx = /oklch\(/i;
  let count = 0;
  root.querySelectorAll?.('*').forEach((n) => {
    const el = n as HTMLElement;
    const cs = getComputedStyle(el);
    ['color','backgroundColor','borderColor'].forEach(p => {
      const v = cs.getPropertyValue(p);
      if (rx.test(v)) { count++; console.warn(`[OKLCH][${tag}] ${p}:`, v, el); }
    });
  });
  console.log(`[OKLCH CHECK][${tag}] ${count} occurrence(s).`);
}

export class CvPdfGenerator {
  /**
   * Génération du PDF avec purge OKLCH définitive
   */
  static async generatePdf(cvData: CvData): Promise<boolean> {
    console.log('🚀 GÉNÉRATION PDF - Méthode purge OKLCH avec culori...');
    try {
      // Trouver l'élément CV principal
      const cvContainer = document.getElementById('cv-preview-container');
      if (!cvContainer) {
        console.error('🔍 Éléments disponibles:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
        throw new Error('Élément CV non trouvé (ID: cv-preview-container)');
      }

      console.log('✅ Élément CV trouvé:', cvContainer);

      // Clonage fidèle du CV
      const workingClone = buildCanvasSafeClone(cvContainer);
      document.body.appendChild(workingClone);

      // Conversion OKLCH → RGB sur toutes les propriétés CSS calculées du clone (et enfants)
      const purgeOklchRecursive = (el: HTMLElement) => {
        const computed = window.getComputedStyle(el);
        for (let i = 0; i < computed.length; i++) {
          const prop = computed[i];
          const val = computed.getPropertyValue(prop);
          if (val && val.includes('oklch')) {
            el.style.setProperty(prop, convertOklchInString(val));
          }
        }
        Array.from(el.children).forEach(child => {
          if (child instanceof HTMLElement) purgeOklchRecursive(child);
        });
      };
      purgeOklchRecursive(workingClone);

      logRemainingOklch('CLONE_PRE_CAPTURE', workingClone);

      // Options html2canvas pour une meilleure fidélité
      const canvas = await html2canvas(workingClone, {
        useCORS: true,
        allowTaint: false,
        logging: true,
        background: '#fff'
      });

      // Retirer le clone
      document.body.removeChild(workingClone);

      console.log('📄 Création du PDF...');

      // Générer le PDF avec jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Télécharger le PDF
      const fileName = `CV-${cvData.personalDetails?.fullName?.replace(/\s+/g, '-') || 'Anonyme'}.pdf`;
      pdf.save(fileName);

      console.log('✅ PDF généré avec succès !');
      return true;

    } catch (error) {
      console.error('❌ Erreur génération PDF:', error);
      throw error;
    }
  }

  /**
   * Alias pour maintenir la compatibilité avec les appels existants
   */
  static async downloadPdf(cvData: CvData): Promise<boolean> {
    return this.generatePdf(cvData);
  }
}
