"use client";
import React, { useState, useEffect } from 'react';
import { Globe, Layout, Palette } from 'lucide-react';
import CountryManager from '@/app/utils/CountryManager';
import { Country, CvTemplate } from '@/type';

interface CountryTemplateSelectorProps {
  selectedCountry: string;
  selectedTemplate: string;
  selectedTheme: string;
  onCountryChange: (countryCode: string) => void;
  onTemplateChange: (templateId: string) => void;
  onThemeChange: (theme: string) => void;
}

export default function CountryTemplateSelector({ 
  selectedCountry,
  selectedTemplate,
  selectedTheme,
  onCountryChange,
  onTemplateChange,
  onThemeChange
}: CountryTemplateSelectorProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [templates, setTemplates] = useState<CvTemplate[]>([]);

  // Themes DaisyUI disponibles
  const availableThemes = [
    'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 
    'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 
    'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe',
    'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business',
    'acid', 'lemonade', 'night', 'coffee', 'winter'
  ];

  useEffect(() => {
    // Charger tous les pays
    const allCountries = CountryManager.getAllCountries();
    setCountries(allCountries);
    
    // Si aucun pays sélectionné, sélectionner la Côte d'Ivoire par défaut
    if (!selectedCountry && allCountries.length > 0) {
      onCountryChange('CI');
    }
  }, [selectedCountry, onCountryChange]);

  useEffect(() => {
    // Charger les templates du pays sélectionné
    if (selectedCountry) {
      const country = CountryManager.getCountryByCode(selectedCountry);
      if (country && country.cvTemplates) {
        setTemplates(country.cvTemplates);
        
        // Si aucun template sélectionné, sélectionner le premier disponible
        if (!selectedTemplate && country.cvTemplates.length > 0) {
          onTemplateChange(country.cvTemplates[0].id);
        }
      }
    }
  }, [selectedCountry, selectedTemplate, onTemplateChange]);

  return (
    <div className="bg-base-200 p-4 rounded-lg space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Layout className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Personnalisation du CV</h3>
      </div>

      {/* Sélection du pays */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Pays / Format CV
          </span>
        </label>
        <select 
          className="select select-bordered w-full"
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
        >
          <option value="">Sélectionnez un pays</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sélection du template */}
      {templates.length > 0 && (
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Modèle de CV
            </span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={selectedTemplate}
            onChange={(e) => onTemplateChange(e.target.value)}
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          {selectedTemplate && (
            <label className="label">
              <span className="label-text-alt text-xs opacity-70">
                {templates.find(t => t.id === selectedTemplate)?.description}
              </span>
            </label>
          )}
        </div>
      )}

      {/* Sélection du thème */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Thème de couleurs
          </span>
        </label>
        <select 
          className="select select-bordered w-full"
          value={selectedTheme}
          onChange={(e) => onThemeChange(e.target.value)}
        >
          {availableThemes.map((theme) => (
            <option key={theme} value={theme}>
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Aperçu des recommandations */}
      {selectedCountry && (
        <div className="alert alert-info">
          <div className="flex-1">
            <div className="text-sm">
              <strong>Conseils pour {countries.find(c => c.code === selectedCountry)?.name} :</strong>
              <div className="mt-1 text-xs">
                {CountryManager.getCulturalRecommendations(selectedCountry)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
