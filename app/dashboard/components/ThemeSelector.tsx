"use client";

import React, { useState, useEffect } from 'react';
import { CvTheme, CvThemeManager, cvThemes } from '../../utils/CvThemeManager';
import { Palette, Download, Upload, Shuffle, Eye, Settings, Check } from 'lucide-react';

interface ThemeSelectorProps {
  onThemeSelect: (theme: CvTheme) => void;
  currentTheme?: CvTheme | null;
  showPreview?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  onThemeSelect, 
  currentTheme,
  showPreview = true
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CvTheme['category'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredThemes, setFilteredThemes] = useState(cvThemes);

  // Filtrer les thèmes
  useEffect(() => {
    let filtered = cvThemes;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(theme => theme.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(theme => 
        theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredThemes(filtered);
  }, [selectedCategory, searchTerm]);

  // Catégories avec compteurs
  const categories = [
    { id: 'all' as const, name: 'Tous', count: cvThemes.length },
    { id: 'professional' as const, name: 'Professionnel', count: cvThemes.filter(t => t.category === 'professional').length },
    { id: 'creative' as const, name: 'Créatif', count: cvThemes.filter(t => t.category === 'creative').length },
    { id: 'modern' as const, name: 'Moderne', count: cvThemes.filter(t => t.category === 'modern').length },
    { id: 'minimalist' as const, name: 'Minimaliste', count: cvThemes.filter(t => t.category === 'minimalist').length },
    { id: 'corporate' as const, name: 'Corporate', count: cvThemes.filter(t => t.category === 'corporate').length }
  ];

  const handleThemeSelect = (theme: CvTheme) => {
    onThemeSelect(theme);
    CvThemeManager.setCurrentTheme(theme);
  };

  const handlePreviewTheme = (theme: CvTheme) => {
    if (showPreview) {
      CvThemeManager.setCurrentTheme(theme);
    }
  };

  const generateRandomTheme = () => {
    const randomTheme = CvThemeManager.generateRandomTheme();
    handleThemeSelect(randomTheme);
  };

  const exportTheme = (theme: CvTheme) => {
    const themeJson = CvThemeManager.exportTheme(theme);
    const blob = new Blob([themeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const themeJson = e.target?.result as string;
      const importedTheme = CvThemeManager.importTheme(themeJson);
      if (importedTheme) {
        handleThemeSelect(importedTheme);
      } else {
        alert('Erreur lors de l\'import du thème. Vérifiez le format du fichier.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="theme-selector bg-white rounded-xl shadow-lg p-6 border">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sélection du Thème</h3>
            <p className="text-sm text-gray-600">Choisissez le style parfait pour votre CV</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={generateRandomTheme}
            className="btn btn-outline btn-sm gap-2 hover:scale-105 transition-transform"
            title="Thème aléatoire"
          >
            <Shuffle className="h-4 w-4" />
            Aléatoire
          </button>
          
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-outline btn-sm gap-2">
              <Settings className="h-4 w-4" />
              Options
            </button>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-white rounded-lg border w-48 mt-1">
              <li>
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Importer un thème
                  <input
                    type="file"
                    accept=".json"
                    onChange={importTheme}
                    className="hidden"
                  />
                </label>
              </li>
              {currentTheme && (
                <li>
                  <button onClick={() => exportTheme(currentTheme)}>
                    <Download className="h-4 w-4" />
                    Exporter le thème actuel
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un thème..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`btn btn-sm gap-2 transition-all duration-200 ${
              selectedCategory === category.id
                ? 'btn-primary'
                : 'btn-outline hover:btn-primary hover:scale-105'
            }`}
          >
            {category.name}
            <span className="badge badge-sm">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grille des thèmes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredThemes.map((theme) => (
          <div
            key={theme.id}
            className={`theme-card p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              currentTheme?.id === theme.id
                ? 'border-primary shadow-lg ring-2 ring-primary/20'
                : 'border-gray-200 hover:border-primary/50'
            }`}
            onClick={() => handleThemeSelect(theme)}
            onMouseEnter={() => handlePreviewTheme(theme)}
          >
            {/* Indicateur de sélection */}
            {currentTheme?.id === theme.id && (
              <div className="absolute top-2 right-2 p-1 bg-primary rounded-full">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}

            {/* Aperçu des couleurs */}
            <div className="flex gap-1 mb-3">
              <div 
                className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div 
                className="w-6 h-8 rounded-lg border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.colors.secondary }}
              />
              <div 
                className="w-4 h-8 rounded-lg border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.colors.accent }}
              />
            </div>

            {/* Informations du thème */}
            <div className="mb-3">
              <h4 className="font-semibold text-gray-900 mb-1">{theme.name}</h4>
              <p className="text-xs text-gray-600 mb-2">{theme.description}</p>
              
              <div className="flex items-center gap-2 text-xs">
                <span 
                  className={`badge badge-sm ${
                    theme.category === 'professional' ? 'badge-primary' :
                    theme.category === 'creative' ? 'badge-secondary' :
                    theme.category === 'modern' ? 'badge-accent' :
                    theme.category === 'minimalist' ? 'badge-neutral' :
                    'badge-info'
                  }`}
                >
                  {theme.category}
                </span>
                
                {theme.layout.columns === 2 && (
                  <span className="badge badge-outline badge-xs">2 colonnes</span>
                )}
                
                {theme.animations.enabled && (
                  <span className="badge badge-outline badge-xs">Animé</span>
                )}
              </div>
            </div>

            {/* Typographie preview */}
            <div 
              className="text-xs p-2 rounded-lg border bg-gray-50"
              style={{ 
                fontFamily: theme.typography.headingFont,
                color: theme.colors.text 
              }}
            >
              <div className="font-semibold mb-1" style={{ fontWeight: theme.typography.headingWeight }}>
                Titre Principal
              </div>
              <div className="text-xs opacity-75" style={{ fontWeight: theme.typography.bodyWeight }}>
                Texte du contenu
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviewTheme(theme);
                }}
                className="btn btn-ghost btn-xs gap-1"
                title="Aperçu"
              >
                <Eye className="h-3 w-3" />
                Aperçu
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  exportTheme(theme);
                }}
                className="btn btn-ghost btn-xs gap-1"
                title="Exporter"
              >
                <Download className="h-3 w-3" />
                Export
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucun thème trouvé */}
      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Palette className="h-12 w-12 mx-auto opacity-50" />
          </div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">Aucun thème trouvé</h4>
          <p className="text-sm text-gray-500">
            Essayez de modifier vos critères de recherche ou de sélectionner une autre catégorie.
          </p>
        </div>
      )}

      {/* Thème actuellement sélectionné */}
      {currentTheme && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div 
                className="w-4 h-4 rounded border border-white/50"
                style={{ backgroundColor: currentTheme.colors.primary }}
              />
              <div 
                className="w-4 h-4 rounded border border-white/50"
                style={{ backgroundColor: currentTheme.colors.secondary }}
              />
              <div 
                className="w-4 h-4 rounded border border-white/50"
                style={{ backgroundColor: currentTheme.colors.accent }}
              />
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-900">
                Thème actuel: <span className="text-primary">{currentTheme.name}</span>
              </p>
              <p className="text-xs text-gray-600">{currentTheme.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
