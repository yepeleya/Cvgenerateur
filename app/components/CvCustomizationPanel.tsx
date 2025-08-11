'use client';

import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Layout, 
  Circle,
  Maximize,
  Minimize,
  Square
} from 'lucide-react';
import { CvTheme, CvCustomization } from '@/type';
import { predefinedThemes, colorSchemes, availableFonts, createCustomTheme } from '@/app/utils/CvThemes';

interface CvCustomizationPanelProps {
  customization: CvCustomization;
  onCustomizationChange: (customization: CvCustomization) => void;
  onClose: () => void;
}

export default function CvCustomizationPanel({
  customization,
  onCustomizationChange,
  onClose
}: CvCustomizationPanelProps) {
  const [activeTab, setActiveTab] = useState<'themes' | 'colors' | 'typography' | 'layout'>('themes');
  const [customColors, setCustomColors] = useState({
    primary: customization.theme.colors.primary,
    secondary: customization.theme.colors.secondary,
    accent: customization.theme.colors.accent
  });

  const updateTheme = (newTheme: CvTheme) => {
    onCustomizationChange({
      ...customization,
      theme: newTheme
    });
  };

  const updateColors = (colorType: 'primary' | 'secondary' | 'accent', color: string) => {
    const newColors = { ...customColors, [colorType]: color };
    setCustomColors(newColors);
    
    const newTheme = createCustomTheme(customization.theme, {
      colors: {
        ...customization.theme.colors,
        [colorType]: color
      }
    });
    
    updateTheme(newTheme);
    onCustomizationChange({
      ...customization,
      colorScheme: 'custom',
      customColors: newColors
    });
  };

  const applyColorScheme = (scheme: keyof typeof colorSchemes) => {
    const colors = colorSchemes[scheme];
    setCustomColors(colors);
    
    const newTheme = createCustomTheme(customization.theme, {
      colors: {
        ...customization.theme.colors,
        ...colors
      }
    });
    
    updateTheme(newTheme);
    onCustomizationChange({
      ...customization,
      colorScheme: scheme,
      customColors: colors
    });
  };

  const updateTypography = (field: string, value: string) => {
    const newTheme = createCustomTheme(customization.theme, {
      typography: {
        ...customization.theme.typography,
        [field]: value
      }
    });
    updateTheme(newTheme);
  };

  const updateLayout = (field: string, value: string) => {
    const newTheme = createCustomTheme(customization.theme, {
      layout: {
        ...customization.theme.layout,
        [field]: value
      }
    });
    updateTheme(newTheme);
  };

  const tabs = [
    { id: 'themes', label: 'Thèmes', icon: Palette },
    { id: 'colors', label: 'Couleurs', icon: Circle },
    { id: 'typography', label: 'Typographie', icon: Type },
    { id: 'layout', label: 'Disposition', icon: Layout }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Personnalisation du CV</h2>
          <button 
            onClick={onClose}
            className="btn btn-ghost btn-sm"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-lifted px-6 pt-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'themes' | 'colors' | 'typography' | 'layout')}
              className={`tab tab-lifted ${activeTab === tab.id ? 'tab-active' : ''}`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Thèmes Prédéfinis */}
          {activeTab === 'themes' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Thèmes Prédéfinis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {predefinedThemes.map(theme => (
                    <div
                      key={theme.id}
                      onClick={() => updateTheme(theme)}
                      className={`card cursor-pointer border-2 transition-all hover:shadow-lg ${
                        customization.theme.id === theme.id ? 'border-primary' : 'border-base-300'
                      }`}
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: theme.preview }}
                          ></div>
                          <div>
                            <h4 className="font-semibold">{theme.name}</h4>
                            <p className="text-xs text-base-content/60 capitalize">{theme.category}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: theme.colors.primary }}
                          ></div>
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: theme.colors.secondary }}
                          ></div>
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: theme.colors.accent }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Couleurs Personnalisées */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Schémas de Couleurs</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(colorSchemes).map(([key, colors]) => (
                    <div
                      key={key}
                      onClick={() => applyColorScheme(key as keyof typeof colorSchemes)}
                      className={`card cursor-pointer border-2 transition-all hover:shadow-lg ${
                        customization.colorScheme === key ? 'border-primary' : 'border-base-300'
                      }`}
                    >
                      <div className="card-body p-3">
                        <div className="text-xs font-semibold mb-2 capitalize">{key}</div>
                        <div className="flex gap-1">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: colors.primary }}
                          ></div>
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: colors.secondary }}
                          ></div>
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: colors.accent }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Couleurs Personnalisées</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Couleur Principale</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={customColors.primary}
                        onChange={(e) => updateColors('primary', e.target.value)}
                        className="w-12 h-12 rounded border"
                      />
                      <input
                        type="text"
                        value={customColors.primary}
                        onChange={(e) => updateColors('primary', e.target.value)}
                        className="input input-bordered flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Couleur Secondaire</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={customColors.secondary}
                        onChange={(e) => updateColors('secondary', e.target.value)}
                        className="w-12 h-12 rounded border"
                      />
                      <input
                        type="text"
                        value={customColors.secondary}
                        onChange={(e) => updateColors('secondary', e.target.value)}
                        className="input input-bordered flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Couleur d&apos;Accent</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={customColors.accent}
                        onChange={(e) => updateColors('accent', e.target.value)}
                        className="w-12 h-12 rounded border"
                      />
                      <input
                        type="text"
                        value={customColors.accent}
                        onChange={(e) => updateColors('accent', e.target.value)}
                        className="input input-bordered flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typographie */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Police des Titres</span>
                  </label>
                  <select
                    value={customization.theme.typography.headerFont}
                    onChange={(e) => updateTypography('headerFont', e.target.value)}
                    className="select select-bordered"
                  >
                    {availableFonts.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Police du Texte</span>
                  </label>
                  <select
                    value={customization.theme.typography.bodyFont}
                    onChange={(e) => updateTypography('bodyFont', e.target.value)}
                    className="select select-bordered"
                  >
                    {availableFonts.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Poids de Police</span>
                  </label>
                  <select
                    value={customization.theme.typography.fontWeight}
                    onChange={(e) => updateTypography('fontWeight', e.target.value)}
                    className="select select-bordered"
                  >
                    <option value="normal">Normal</option>
                    <option value="medium">Moyen</option>
                    <option value="semibold">Semi-gras</option>
                    <option value="bold">Gras</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Taille</span>
                  </label>
                  <select
                    value={customization.fontSize}
                    onChange={(e) => onCustomizationChange({
                      ...customization,
                      fontSize: e.target.value as 'small' | 'medium' | 'large'
                    })}
                    className="select select-bordered"
                  >
                    <option value="small">Petit</option>
                    <option value="medium">Moyen</option>
                    <option value="large">Grand</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Disposition */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Style de Disposition</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'modern', label: 'Moderne', icon: Maximize },
                      { value: 'classic', label: 'Classique', icon: Square },
                      { value: 'creative', label: 'Créatif', icon: Circle },
                      { value: 'minimal', label: 'Minimal', icon: Minimize }
                    ].map(style => (
                      <button
                        key={style.value}
                        onClick={() => updateLayout('style', style.value)}
                        className={`btn ${customization.theme.layout.style === style.value ? 'btn-primary' : 'btn-outline'}`}
                      >
                        <style.icon className="w-4 h-4 mr-2" />
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bordures Arrondies</span>
                  </label>
                  <select
                    value={customization.theme.layout.borderRadius}
                    onChange={(e) => updateLayout('borderRadius', e.target.value)}
                    className="select select-bordered"
                  >
                    <option value="none">Aucune</option>
                    <option value="small">Petite</option>
                    <option value="medium">Moyenne</option>
                    <option value="large">Grande</option>
                    <option value="full">Complète</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Ombre</span>
                  </label>
                  <select
                    value={customization.theme.layout.shadow}
                    onChange={(e) => updateLayout('shadow', e.target.value)}
                    className="select select-bordered"
                  >
                    <option value="none">Aucune</option>
                    <option value="small">Légère</option>
                    <option value="medium">Moyenne</option>
                    <option value="large">Forte</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Espacement</span>
                  </label>
                  <select
                    value={customization.spacing}
                    onChange={(e) => onCustomizationChange({
                      ...customization,
                      spacing: e.target.value as 'compact' | 'normal' | 'relaxed'
                    })}
                    className="select select-bordered"
                  >
                    <option value="compact">Compact</option>
                    <option value="normal">Normal</option>
                    <option value="relaxed">Aéré</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Afficher la Photo</span>
                </label>
                <input
                  type="checkbox"
                  checked={customization.showPhoto}
                  onChange={(e) => onCustomizationChange({
                    ...customization,
                    showPhoto: e.target.checked
                  })}
                  className="checkbox checkbox-primary"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-end gap-4">
          <button onClick={onClose} className="btn btn-ghost">
            Annuler
          </button>
          <button onClick={onClose} className="btn btn-primary">
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}
