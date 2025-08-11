"use client";
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Shield, Check, AlertCircle } from 'lucide-react';
import AuthManager from '@/app/utils/AuthManager';
import CountryManager from '@/app/utils/CountryManager';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Connexion
    email: '',
    password: '',
    // Inscription - Informations de base
    fullName: '',
    confirmPassword: '',
    // Inscription - Informations personnelles (optionnelles)
    phone: '',
    dateOfBirth: '',
    gender: '',
    // Inscription - Adresse (optionnelle)
    address: '',
    city: '',
    postalCode: '',
    country: '',
    // Inscription - Professionnel (optionnel)
    profession: '',
    company: '',
    experienceLevel: '',
    // Inscription - Consentements
    termsAccepted: false,
    privacyAccepted: false,
    newsletter: false,
    marketingConsent: false
  });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [currentStep, setCurrentStep] = useState(1); // Pour formulaire multi-étapes

  const countries = CountryManager.getAllCountries();

  // Validation de force du mot de passe
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  // Validation des champs
  const validateForm = (): string | null => {
    if (!isLogin) {
      // Validation inscription
      if (!formData.fullName.trim()) return 'Le nom complet est requis';
      if (formData.fullName.trim().length < 2) return 'Le nom doit contenir au moins 2 caractères';
      
      if (!formData.password) return 'Le mot de passe est requis';
      if (formData.password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
      if (passwordStrength < 60) return 'Le mot de passe n\'est pas assez sécurisé';
      
      if (formData.password !== formData.confirmPassword) return 'Les mots de passe ne correspondent pas';
      
      if (!formData.termsAccepted) return 'Vous devez accepter les conditions d\'utilisation';
      if (!formData.privacyAccepted) return 'Vous devez accepter la politique de confidentialité';

      // Validation email
      if (!AuthManager.isValidEmail(formData.email)) return 'Adresse email invalide';
      
      // Validation téléphone si fourni
      if (formData.phone && !/^[+]?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
        return 'Numéro de téléphone invalide';
      }
    } else {
      // Validation connexion
      if (!formData.email || !formData.password) return 'Email et mot de passe requis';
    }
    return null;
  };

  // Validation des étapes
  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.fullName && 
               formData.email && 
               formData.password && 
               formData.confirmPassword && 
               formData.password === formData.confirmPassword &&
               passwordStrength >= 60;
      case 2:
        return true; // Tous les champs de l'étape 2 sont optionnels
      case 3:
        return formData.termsAccepted && formData.privacyAccepted;
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validation des champs
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Connexion
        const result = await AuthManager.login(formData.email, formData.password);
        if (result.success) {
          setMessage({ type: 'success', text: result.message });
          // Redirection immédiate vers le dashboard après connexion
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/dashboard');
          }
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      } else {
        // Inscription - Préparer les données utilisateur
        const userData = {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim() || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          gender: (formData.gender as 'male' | 'female' | 'other' | 'prefer-not-to-say') || undefined,
          address: formData.address.trim() || undefined,
          city: formData.city.trim() || undefined,
          postalCode: formData.postalCode.trim() || undefined,
          country: formData.country || undefined,
          profession: formData.profession.trim() || undefined,
          company: formData.company.trim() || undefined,
          experienceLevel: (formData.experienceLevel as 'entry' | 'junior' | 'mid' | 'senior' | 'executive') || undefined,
          newsletter: formData.newsletter,
          marketingConsent: formData.marketingConsent
        };

        const result = await AuthManager.register(
          formData.email,
          formData.password,
          userData
        );

        if (result.success) {
          setMessage({ type: 'success', text: result.message });
          // Redirection immédiate vers le dashboard après inscription
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/dashboard');
          }
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setMessage({ type: 'error', text: 'Une erreur est survenue' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Calculer la force du mot de passe en temps réel
      if (name === 'password' && !isLogin) {
        setPasswordStrength(calculatePasswordStrength(value));
      }
    }
  };

  return (
    <div className={`card w-full ${isLogin ? 'max-w-md' : 'max-w-4xl'} bg-base-100 shadow-2xl`}>
      <div className="card-body">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tenena
            </span>
          </h1>
          <p className="text-base-content/60">
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte professionnel gratuitement'}
          </p>
          {!isLogin && (
            <div className="mt-4">
              <div className="steps steps-horizontal w-full">
                <div className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>Compte</div>
                <div className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>Profil</div>
                <div className={`step ${currentStep >= 3 ? 'step-primary' : ''}`}>Préférences</div>
              </div>
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
            <span>{message.text}</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {isLogin ? (
            /* === FORMULAIRE DE CONNEXION === */
            <div className="space-y-4">
              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Adresse email</span>
                </label>
                <div className="input-group">
                  <span className="bg-base-200">
                    <Mail size={20} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    className="input input-bordered w-full"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mot de passe</span>
                </label>
                <div className="input-group">
                  <span className="bg-base-200">
                    <Lock size={20} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Votre mot de passe"
                    className="input input-bordered w-full"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-square"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* === FORMULAIRE D'INSCRIPTION MULTI-ÉTAPES === */
            <div className="space-y-6">
              {/* Étape 1: Informations de base */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-full">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <User className="text-primary" size={20} />
                      Informations de base
                    </h3>
                  </div>

                  {/* Nom complet */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Nom complet *</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Jean Dupont"
                      className="input input-bordered w-full"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email *</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="jean@exemple.com"
                      className="input input-bordered w-full"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Mot de passe */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Mot de passe *</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Min. 8 caractères"
                        className="input input-bordered w-full pr-12"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {/* Indicateur de force du mot de passe */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Force du mot de passe</span>
                          <span>{passwordStrength}%</span>
                        </div>
                        <progress 
                          className={`progress progress-sm w-full ${
                            passwordStrength < 40 ? 'progress-error' : 
                            passwordStrength < 70 ? 'progress-warning' : 
                            'progress-success'
                          }`} 
                          value={passwordStrength} 
                          max="100"
                        ></progress>
                      </div>
                    )}
                  </div>

                  {/* Confirmation mot de passe */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Confirmer le mot de passe *</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Retapez votre mot de passe"
                      className="input input-bordered w-full"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          <AlertCircle size={14} className="inline mr-1" />
                          Les mots de passe ne correspondent pas
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* Étape 2: Profil personnel et professionnel */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-full">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <User className="text-primary" size={20} />
                      Profil personnel et professionnel
                    </h3>
                  </div>

                  {/* Téléphone */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Téléphone</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+33 6 12 34 56 78"
                      className="input input-bordered w-full"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Date de naissance */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date de naissance</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="input input-bordered w-full"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Genre */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Genre</span>
                    </label>
                    <select
                      name="gender"
                      className="select select-bordered w-full"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Sélectionner</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                      <option value="other">Autre</option>
                      <option value="prefer-not-to-say">Préfère ne pas dire</option>
                    </select>
                  </div>

                  {/* Profession */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Profession</span>
                    </label>
                    <input
                      type="text"
                      name="profession"
                      placeholder="Développeur Web"
                      className="input input-bordered w-full"
                      value={formData.profession}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Entreprise */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Entreprise actuelle</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      placeholder="Mon Entreprise"
                      className="input input-bordered w-full"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Niveau d'expérience */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Niveau d&apos;expérience</span>
                    </label>
                    <select
                      name="experienceLevel"
                      className="select select-bordered w-full"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                    >
                      <option value="">Sélectionner</option>
                      <option value="entry">Débutant (0-1 an)</option>
                      <option value="junior">Junior (1-3 ans)</option>
                      <option value="mid">Intermédiaire (3-5 ans)</option>
                      <option value="senior">Senior (5+ ans)</option>
                      <option value="executive">Cadre dirigeant</option>
                    </select>
                  </div>

                  {/* Adresse */}
                  <div className="form-control col-span-full">
                    <label className="label">
                      <span className="label-text">Adresse</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="123 Rue de la Paix"
                      className="input input-bordered w-full"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Ville et Code postal */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Ville</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Paris"
                      className="input input-bordered w-full"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Code postal</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="75001"
                      className="input input-bordered w-full"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Pays */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Pays de résidence</span>
                    </label>
                    <select
                      name="country"
                      className="select select-bordered w-full"
                      value={formData.country}
                      onChange={handleInputChange}
                    >
                      <option value="">Sélectionner un pays</option>
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Étape 3: Consentements et préférences */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="text-primary" size={20} />
                    Consentements et préférences
                  </h3>

                  {/* Consentements obligatoires */}
                  <div className="bg-base-200 p-4 rounded-lg space-y-4">
                    <h4 className="font-medium text-error">Consentements obligatoires *</h4>
                    
                    <div className="form-control">
                      <label className="cursor-pointer label justify-start gap-3">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          className="checkbox checkbox-primary"
                          checked={formData.termsAccepted}
                          onChange={handleInputChange}
                        />
                        <span className="label-text">
                          J&apos;accepte les{' '}
                          <a href="#" className="link link-primary">conditions d&apos;utilisation</a>
                        </span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="cursor-pointer label justify-start gap-3">
                        <input
                          type="checkbox"
                          name="privacyAccepted"
                          className="checkbox checkbox-primary"
                          checked={formData.privacyAccepted}
                          onChange={handleInputChange}
                        />
                        <span className="label-text">
                          J&apos;accepte la{' '}
                          <a href="#" className="link link-primary">politique de confidentialité</a>
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Préférences optionnelles */}
                  <div className="bg-base-100 border border-base-300 p-4 rounded-lg space-y-4">
                    <h4 className="font-medium text-base-content">Préférences marketing (optionnel)</h4>
                    
                    <div className="form-control">
                      <label className="cursor-pointer label justify-start gap-3">
                        <input
                          type="checkbox"
                          name="newsletter"
                          className="checkbox checkbox-secondary"
                          checked={formData.newsletter}
                          onChange={handleInputChange}
                        />
                        <span className="label-text">
                          Je souhaite recevoir les actualités et conseils par email
                        </span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="cursor-pointer label justify-start gap-3">
                        <input
                          type="checkbox"
                          name="marketingConsent"
                          className="checkbox checkbox-secondary"
                          checked={formData.marketingConsent}
                          onChange={handleInputChange}
                        />
                        <span className="label-text">
                          J&apos;accepte de recevoir des offres personnalisées
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Informations de sécurité */}
                  <div className="alert alert-info">
                    <Shield size={20} />
                    <div>
                      <h4 className="font-bold">Vos données sont protégées</h4>
                      <div className="text-sm">
                        • Chiffrement bout-en-bout<br/>
                        • Conformité RGPD<br/>
                        • Vous pouvez modifier ou supprimer vos données à tout moment
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Boutons de navigation et soumission */}
          <div className="flex justify-between items-center pt-4">
            {!isLogin && currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="btn btn-outline"
              >
                Précédent
              </button>
            )}

            <div className="flex-1"></div>

            {!isLogin && currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="btn btn-primary"
                disabled={!isStepValid(currentStep)}
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    {isLogin ? 'Se connecter' : 'Créer mon compte'}
                    {!isLogin && <Check size={16} className="ml-1" />}
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Switch entre connexion et inscription */}
        <div className="divider">OU</div>
        
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="btn btn-ghost w-full"
        >
          {isLogin ? (
            <>
              <User size={18} />
              Créer un nouveau compte
            </>
          ) : (
            <>
              <Mail size={18} />
              J&apos;ai déjà un compte
            </>
          )}
        </button>

        {/* Informations complémentaires */}
        <div className="text-center mt-4">
          <p className="text-sm text-base-content/60">
            {isLogin ? (
              "Pas encore de compte ? Créez-en un gratuitement"
            ) : (
              "En créant un compte, vous acceptez nos conditions d'utilisation"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
