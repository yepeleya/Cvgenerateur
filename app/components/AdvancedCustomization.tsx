'use client';

import React, { useState } from 'react';
import { Palette, Type, Brush, Move, RotateCcw } from 'lucide-react';

interface AdvancedCustomizationProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
  selectedColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  onColorsChange: (colors: { primary: string; secondary: string; accent: string }) => void;
  selectedSpacing: 'compact' | 'normal' | 'spacious';
  onSpacingChange: (spacing: 'compact' | 'normal' | 'spacious') => void;
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

const AdvancedCustomization: React.FC<AdvancedCustomizationProps> = ({
  selectedFont,
  onFontChange,
  selectedColors,
  onColorsChange,
  selectedSpacing,
  onSpacingChange,
  selectedTheme,
  onThemeChange
}) => {
  const [hasChanges, setHasChanges] = useState(false);

  const defaultSettings = {
    font: 'Inter',
    colors: {
      primary: '#3B82F6',
      secondary: '#1F2937',
      accent: '#F59E0B'
    },
    spacing: 'normal' as const,
    theme: 'cupcake'
  };

  const resetToDefaults = () => {
    onFontChange(defaultSettings.font);
    onColorsChange(defaultSettings.colors);
    onSpacingChange(defaultSettings.spacing);
    onThemeChange(defaultSettings.theme);
    setHasChanges(false);
  };
  const availableFonts = [
    'Inter',
    'Poppins',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Playfair Display',
    'Source Sans Pro',
    'Nunito',
    'Raleway'
  ];

  const availableThemes = [
    { id: 'light', name: 'Clair', colors: ['#ffffff', '#f8fafc', '#e2e8f0'] },
    { id: 'dark', name: 'Sombre', colors: ['#1f2937', '#374151', '#4b5563'] },
    { id: 'cupcake', name: 'Cupcake', colors: ['#fef7f0', '#f4e2d8', '#e0b4d6'] },
    { id: 'corporate', name: 'Corporate', colors: ['#181a2a', '#24293f', '#3b4972'] },
    { id: 'retro', name: 'Rétro', colors: ['#e4d6b7', '#c4a484', '#a87c7c'] },
    { id: 'cyberpunk', name: 'Cyberpunk', colors: ['#ffff00', '#ff00ff', '#00ffff'] },
    { id: 'valentine', name: 'Valentine', colors: ['#e96d7b', '#f0a6ca', '#f7c8e0'] },
    { id: 'halloween', name: 'Halloween', colors: ['#f28c18', '#6d3dc0', '#1e1926'] }
  ];

  const handleColorChange = (colorType: 'primary' | 'secondary' | 'accent', value: string) => {
    onColorsChange({
      ...selectedColors,
      [colorType]: value
    });
    setHasChanges(true);
  };

  const handleFontChange = (font: string) => {
    onFontChange(font);
    setHasChanges(true);
  };

  const handleSpacingChange = (spacing: 'compact' | 'normal' | 'spacious') => {
    onSpacingChange(spacing);
    setHasChanges(true);
  };

  const handleThemeChange = (theme: string) => {
    onThemeChange(theme);
    setHasChanges(true);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header avec boutons reset et validation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Personnalisation Avancée</h2>
          <p className="text-gray-600 mt-1">Créez un CV unique selon vos préférences</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Bouton de validation */}
          <button
            onClick={() => {
              setHasChanges(false);
              // Confirmer que les modifications ont été appliquées
              console.log('Modifications validées:', {
                font: selectedFont,
                colors: selectedColors,
                theme: selectedTheme,
                spacing: selectedSpacing
              });
            }}
            className={`btn gap-2 ${
              hasChanges ? 'btn-primary animate-pulse' : 'btn-outline btn-primary'
            }`}
            title="Appliquer les modifications"
            disabled={!hasChanges}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {hasChanges ? 'Valider les changements' : 'Modifications appliquées'}
          </button>
          
          {/* Bouton reset */}
          <button
            onClick={resetToDefaults}
            className={`btn btn-outline gap-2 hover:btn-secondary ${
              hasChanges ? 'btn-warning' : 'btn-secondary'
            }`}
            title="Restaurer les paramètres par défaut"
            disabled={!hasChanges}
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Section Typographie */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Type className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Typographie</h3>
            <p className="text-sm text-gray-600">Choisissez la police qui vous représente</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableFonts.map((font) => (
            <button
              key={font}
              onClick={() => handleFontChange(font)}
              className={`p-4 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
                selectedFont === font
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              style={{ fontFamily: font }}
            >
              <div className="font-semibold text-gray-800 mb-1">{font}</div>
              <div className="text-sm text-gray-500">Aa Bb Cc 123</div>
            </button>
          ))}
        </div>
      </div>

      {/* Section Couleurs personnalisées */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Couleurs Personnalisées</h3>
            <p className="text-sm text-gray-600">Créez votre palette unique</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Couleur Primaire */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Couleur Primaire
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={selectedColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer hover:border-blue-400 transition-colors"
                title="Sélectionnez la couleur primaire"
              />
              <input
                type="text"
                value={selectedColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="input input-bordered flex-1 text-sm hover:border-blue-400 focus:border-blue-500"
                placeholder="#3B82F6"
                title="Code couleur hexadécimal"
              />
            </div>
          </div>

          {/* Couleur Secondaire */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Couleur Secondaire
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={selectedColors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer hover:border-blue-400 transition-colors"
                title="Sélectionnez la couleur secondaire"
              />
              <input
                type="text"
                value={selectedColors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="input input-bordered flex-1 text-sm hover:border-blue-400 focus:border-blue-500"
                placeholder="#1F2937"
                title="Code couleur hexadécimal"
              />
            </div>
          </div>

          {/* Couleur d'accent */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Couleur d&apos;Accent
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={selectedColors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer hover:border-blue-400 transition-colors"
                title="Sélectionnez la couleur d'accent"
              />
              <input
                type="text"
                value={selectedColors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="input input-bordered flex-1 text-sm hover:border-blue-400 focus:border-blue-500"
                placeholder="#F59E0B"
                title="Code couleur hexadécimal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Thèmes prédéfinis */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Brush className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Thèmes Prédéfinis</h3>
            <p className="text-sm text-gray-600">Ou choisissez un thème existant</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                selectedTheme === theme.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex gap-1 mb-3">
                {theme.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
              <div className="text-sm font-semibold text-gray-800">{theme.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Section Espacement */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Move className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Espacement</h3>
            <p className="text-sm text-gray-600">Ajustez la densité du contenu</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'compact', name: 'Compact', desc: 'Plus de contenu' },
            { id: 'normal', name: 'Normal', desc: 'Équilibré' },
            { id: 'spacious', name: 'Spacieux', desc: 'Plus aéré' }
          ].map((spacing) => (
            <button
              key={spacing.id}
              onClick={() => handleSpacingChange(spacing.id as 'compact' | 'normal' | 'spacious')}
              className={`p-4 rounded-xl border-2 text-center transition-all hover:shadow-lg ${
                selectedSpacing === spacing.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="font-semibold text-gray-800 mb-1">{spacing.name}</div>
              <div className="text-xs text-gray-500">{spacing.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Aperçu des couleurs */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-4">Aperçu de votre palette</h4>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div 
              className="h-12 rounded-lg shadow-sm flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: selectedColors.primary }}
            >
              Primaire
            </div>
          </div>
          <div className="flex-1">
            <div 
              className="h-12 rounded-lg shadow-sm flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: selectedColors.secondary }}
            >
              Secondaire
            </div>
          </div>
          <div className="flex-1">
            <div 
              className="h-12 rounded-lg shadow-sm flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: selectedColors.accent }}
            >
              Accent
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCustomization;
