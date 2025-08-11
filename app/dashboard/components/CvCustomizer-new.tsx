"use client";

import React, { useState, useEffect } from 'react';
import { Palette, Type, Layout, Eye, Save, RotateCcw, Sparkles, Download } from 'lucide-react';
import { CvTheme, CvThemeManager } from '../../utils/CvThemeManager';
import ThemeSelector from './ThemeSelector';

interface CvCustomizerProps {
  onCustomizationChange?: (customization: any) => void;
}

const CvCustomizer: React.FC<CvCustomizerProps> = ({ onCustomizationChange }) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'colors' | 'typography' | 'layout'>('themes');
  const [currentTheme, setCurrentTheme] = useState<CvTheme | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Initialiser avec les préférences utilisateur
  useEffect(() => {
    const preferences = CvThemeManager.loadUserPreferences();
    if (preferences) {
      const theme = CvThemeManager.getThemeById(preferences.themeId);
      if (theme) {
        setCurrentTheme(theme);
        CvThemeManager.setCurrentTheme(theme);
      }
    }
  }, []);

  const handleThemeSelect = (theme: CvTheme) => {
    setCurrentTheme(theme);
    CvThemeManager.saveUserPreferences({ themeId: theme.id, customizations: {} });
    onCustomizationChange?.(theme);
  };

  const handleReset = () => {
    if (currentTheme) {
      const originalTheme = CvThemeManager.getThemeById(currentTheme.id.replace('-custom', ''));
      if (originalTheme) {
        handleThemeSelect(originalTheme);
      }
    }
  };

  const tabs = [
    { id: 'themes' as const, label: 'Thèmes', icon: Palette, color: 'text-purple-600' },
    { id: 'colors' as const, label: 'Couleurs', icon: Palette, color: 'text-blue-600' },
    { id: 'typography' as const, label: 'Typographie', icon: Type, color: 'text-green-600' },
    { id: 'layout' as const, label: 'Mise en page', icon: Layout, color: 'text-orange-600' }
  ];

  return (
    <div className="cv-customizer bg-white rounded-xl shadow-lg border overflow-hidden">
      {/* En-tête avec onglets */}
      <div className="border-b bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Personnalisation CV</h3>
                <p className="text-sm text-gray-600">Créez un CV unique qui vous ressemble</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`btn btn-sm gap-2 transition-all ${
                  isPreviewMode ? 'btn-primary' : 'btn-outline'
                }`}
              >
                <Eye className="h-4 w-4" />
                {isPreviewMode ? 'Édition' : 'Aperçu'}
              </button>
              
              <button className="btn btn-outline btn-sm gap-2">
                <Save className="h-4 w-4" />
                Sauvegarder
              </button>
              
              <button onClick={handleReset} className="btn btn-ghost btn-sm gap-2">
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Onglets de navigation */}
          <div className="flex gap-1 bg-white rounded-lg p-1 border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="p-6">
        {activeTab === 'themes' && (
          <div className="space-y-6">
            <ThemeSelector
              currentTheme={currentTheme}
              onThemeSelect={handleThemeSelect}
              showPreview={true}
            />
          </div>
        )}

        {/* Interface simplifiée pour les autres onglets */}
        {activeTab === 'colors' && (
          <div className="text-center py-12">
            <Palette className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">Personnalisation des couleurs</h4>
            <p className="text-gray-500 mb-6">
              Utilisez l'onglet "Thèmes" pour sélectionner et personnaliser les couleurs de votre CV
            </p>
            <button 
              onClick={() => setActiveTab('themes')} 
              className="btn btn-primary"
            >
              Retour aux thèmes
            </button>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="text-center py-12">
            <Type className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">Personnalisation de la typographie</h4>
            <p className="text-gray-500 mb-6">
              Utilisez l'onglet "Thèmes" pour sélectionner et personnaliser les polices de votre CV
            </p>
            <button 
              onClick={() => setActiveTab('themes')} 
              className="btn btn-primary"
            >
              Retour aux thèmes
            </button>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="text-center py-12">
            <Layout className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">Personnalisation de la mise en page</h4>
            <p className="text-gray-500 mb-6">
              Utilisez l'onglet "Thèmes" pour sélectionner et personnaliser la mise en page de votre CV
            </p>
            <button 
              onClick={() => setActiveTab('themes')} 
              className="btn btn-primary"
            >
              Retour aux thèmes
            </button>
          </div>
        )}
      </div>

      {/* Pied de page avec actions */}
      <div className="border-t bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {currentTheme ? `Thème: ${currentTheme.name}` : 'Aucun thème sélectionné'}
          </div>
          
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm">
              Prévisualiser le CV
            </button>
            <button className="btn btn-primary btn-sm">
              Appliquer les changements
            </button>
            {currentTheme && (
              <button 
                onClick={() => {
                  const themeJson = CvThemeManager.exportTheme(currentTheme);
                  const blob = new Blob([themeJson], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${currentTheme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="btn btn-ghost btn-sm gap-1"
              >
                <Download className="h-4 w-4" />
                Exporter
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvCustomizer;
