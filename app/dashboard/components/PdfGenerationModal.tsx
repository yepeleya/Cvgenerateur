'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { SavedCv } from '@/app/utils/CvStorageManager';
import { CvPdfGenerator } from '@/app/utils/CvPdfGenerator';
import CvPreviewWithTemplates from '@/app/components/CvPreviewWithTemplates';

interface PdfGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cv: SavedCv | null;
}

export default function PdfGenerationModal({ isOpen, onClose, cv }: PdfGenerationModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [previewReady, setPreviewReady] = useState(false);

  useEffect(() => {
    if (isOpen && cv) {
      // Petit délai pour que le DOM se mette à jour
      setTimeout(() => {
        setPreviewReady(true);
      }, 500);
    } else {
      setPreviewReady(false);
    }
  }, [isOpen, cv]);

  const handleGeneratePdf = async () => {
    if (!cv) return;

    setIsGenerating(true);
    setMessage(null);

    try {
      console.log('Génération PDF pour:', cv.name);
      
      // Attendre que l'aperçu soit complètement rendu
      await new Promise(resolve => setTimeout(resolve, 1000));

      const success = await CvPdfGenerator.downloadPdf({
        personalDetails: cv.data.personalDetails,
        experiences: cv.data.experiences,
        educations: cv.data.educations,
        competences: cv.data.competences || [],
        languages: cv.data.languages,
        hobbies: cv.data.hobbies
      });

      if (success) {
        setMessage({
          type: 'success',
          text: 'CV téléchargé avec succès !'
        });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error('Échec de la génération PDF');
      }
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erreur lors de la génération du PDF'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen || !cv) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl max-h-[90vh] w-full overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="text-white">
            <h3 className="text-xl font-bold">Génération PDF - {cv.name}</h3>
            <p className="text-blue-100 text-sm mt-1">Préparation de votre CV pour téléchargement</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost text-white hover:bg-white/20 btn-circle"
            disabled={isGenerating}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {message && (
          <div className="p-4">
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)] bg-gray-50">
          <div id="cv-preview-container" className="bg-white rounded-lg shadow-lg">
            {previewReady && (
              <CvPreviewWithTemplates
                personalDetails={cv.data.personalDetails}
                file={null}
                theme={cv.data.theme || 'cupcake'}
                selectedCountry={cv.data.selectedCountry?.code || 'CI'}
                selectedTemplate={cv.data.selectedTemplate?.id || 'ci-francophone'}
                experiences={cv.data.experiences}
                educations={cv.data.educations}
                languages={cv.data.languages}
                competences={cv.data.competences || []}
                hobbies={cv.data.hobbies}
                download={false}
                customFont={cv.data.customization?.theme.typography.bodyFont}
                customColors={cv.data.customization?.theme.colors ? {
                  primary: cv.data.customization.theme.colors.primary,
                  secondary: cv.data.customization.theme.colors.secondary,
                  accent: cv.data.customization.theme.colors.accent
                } : undefined}
                customSpacing={cv.data.customization?.spacing === 'relaxed' ? 'spacious' : cv.data.customization?.spacing}
              />
            )}
            {!previewReady && (
              <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                  <div className="loading loading-spinner loading-lg text-primary"></div>
                  <p className="text-gray-600">Préparation de l&apos;aperçu...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t flex justify-between items-center bg-white">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            {previewReady ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                Prêt pour l&apos;export PDF
              </>
            ) : (
              <>
                <div className="loading loading-spinner loading-sm"></div>
                Préparation en cours...
              </>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isGenerating}
            >
              Fermer
            </button>
            <button
              onClick={handleGeneratePdf}
              className={`btn btn-primary gap-2 shadow-lg ${isGenerating ? 'loading' : ''}`}
              disabled={isGenerating || !previewReady}
            >
              {!isGenerating && <Download className="w-5 h-5" />}
              {isGenerating ? 'Génération...' : 'Télécharger PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
