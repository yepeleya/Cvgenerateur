import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export interface PdfOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  format?: 'a4' | 'letter' | 'a3';
  orientation?: 'portrait' | 'landscape';
}

export class PdfGenerator {
  private static readonly DEFAULT_OPTIONS: Required<PdfOptions> = {
    filename: 'cv.pdf',
    quality: 1.0,
    scale: 3,
    format: 'a4',
    orientation: 'portrait'
  };

  static async generatePdf(
    element: HTMLElement, 
    options: PdfOptions = {}
  ): Promise<void> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    try {
      // Afficher un indicateur de chargement
      this.showLoadingIndicator();

      // Optimisation: attendre que les images soient chargées
      await this.waitForImages(element);

      // Générer le canvas avec des options optimisées
      const canvas = await html2canvas(element, {
        scale: config.scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        removeContainer: true,
        // Optimisations pour de meilleures performances
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // Créer le PDF avec les bonnes dimensions
      const imgData = canvas.toDataURL('image/jpeg', config.quality);
      
      const pageFormat = config.format.toUpperCase() as 'A4' | 'LETTER' | 'A3';
      
      const pdf = new jsPDF({
        orientation: config.orientation,
        unit: 'mm',
        format: pageFormat,
        compress: true
      });

      // Calculer les dimensions optimales
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const maxHeight = pdf.internal.pageSize.getHeight();

      if (pdfHeight > maxHeight) {
        // Si le contenu est trop grand, ajuster en gardant le ratio
        const ratio = maxHeight / pdfHeight;
        const adjustedWidth = pdfWidth * ratio;
        const adjustedHeight = maxHeight;
        
        pdf.addImage(imgData, 'JPEG', 
          (pdfWidth - adjustedWidth) / 2, 0, 
          adjustedWidth, adjustedHeight
        );
      } else {
        // Centrer verticalement si nécessaire
        const yOffset = (maxHeight - pdfHeight) / 2;
        pdf.addImage(imgData, 'JPEG', 0, yOffset, pdfWidth, pdfHeight);
      }

      // Ajouter des métadonnées
      pdf.setProperties({
        title: 'Mon CV',
        subject: 'Curriculum Vitae',
        author: 'CV Builder',
        creator: 'CV Builder App'
      });

      // Sauvegarder le fichier
      pdf.save(config.filename);

      this.hideLoadingIndicator();
      
      // Retourner une promesse résolue pour indiquer le succès
      return Promise.resolve();

    } catch (error) {
      this.hideLoadingIndicator();
      console.error('Erreur lors de la génération du PDF:', error);
      throw new Error('Échec de la génération du PDF. Veuillez réessayer.');
    }
  }

  private static async waitForImages(element: HTMLElement): Promise<void> {
    const images = element.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
      return new Promise<void>((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Continue même en cas d'erreur d'image
          // Timeout pour éviter d'attendre indéfiniment
          setTimeout(resolve, 5000);
        }
      });
    });

    await Promise.all(imagePromises);
  }

  private static showLoadingIndicator(): void {
    // Créer un indicateur de chargement temporaire
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'pdf-loading-indicator';
    loadingDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-family: system-ui;
      ">
        <div style="text-align: center;">
          <div style="
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px auto;
          "></div>
          <div>Génération du PDF en cours...</div>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(loadingDiv);
  }

  private static hideLoadingIndicator(): void {
    const loadingDiv = document.getElementById('pdf-loading-indicator');
    if (loadingDiv) {
      document.body.removeChild(loadingDiv);
    }
  }

  // Méthode pour prévisualiser avant génération
  static async previewPdf(element: HTMLElement): Promise<string> {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff'
    });

    return canvas.toDataURL('image/jpeg', 0.8);
  }
}
