"use client";
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Globe } from 'lucide-react';
import AuthManager from '@/app/utils/AuthManager';
import CountryManager from '@/app/utils/CountryManager';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    country: 'FR'
  });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const countries = CountryManager.getAllCountries();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        // Connexion
        const result = await AuthManager.login(formData.email, formData.password);
        if (result.success) {
          setMessage({ type: 'success', text: result.message });
          // Redirection immédiate vers le dashboard
          router.push('/dashboard');
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      } else {
        // Inscription - Validation des champs
        if (!formData.fullName.trim()) {
          setMessage({ type: 'error', text: 'Le nom complet est requis' });
          setLoading(false);
          return;
        }

        if (formData.fullName.trim().length < 2) {
          setMessage({ type: 'error', text: 'Le nom doit contenir au moins 2 caractères' });
          setLoading(false);
          return;
        }

        if (!AuthManager.isValidEmail(formData.email)) {
          setMessage({ type: 'error', text: 'Adresse email invalide' });
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
          setLoading(false);
          return;
        }

        const result = await AuthManager.register(
          formData.email,
          formData.password,
          {
            fullName: formData.fullName.trim(),
            country: formData.country
          }
        );

        if (result.success) {
          setMessage({ type: 'success', text: result.message });
          // Redirection immédiate vers le dashboard
          router.push('/dashboard');
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">
              <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Tenena
              </span>
            </h1>
            <p className="text-base-content/60">
              {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte professionnel'}
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
              <span>{message.text}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom complet (inscription seulement) */}
            {!isLogin && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nom complet</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Votre nom complet"
                    className="input input-bordered w-full pl-10"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required={!isLogin}
                  />
                  <User className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  className="input input-bordered w-full pl-10"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Mail className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Mot de passe</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 pr-12"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Lock className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-5 w-5 text-base-content/40 hover:text-base-content cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {!isLogin && (
                <label className="label">
                  <span className="label-text-alt">
                    Minimum 6 caractères
                    {formData.password && formData.password.length < 6 && (
                      <span className="text-error ml-2">
                        ({formData.password.length}/6)
                      </span>
                    )}
                  </span>
                </label>
              )}
            </div>

            {/* Pays (inscription seulement) */}
            {!isLogin && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Pays</span>
                </label>
                <div className="relative">
                  <select
                    name="country"
                    className="select select-bordered w-full pl-10"
                    value={formData.country}
                    onChange={handleInputChange}
                    required={!isLogin}
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                  <Globe className="absolute left-3 top-3 h-5 w-5 text-base-content/40 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Bouton de soumission */}
            <div className="form-control mt-6">
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    {isLogin ? 'Connexion...' : 'Création du compte...'}
                  </>
                ) : (
                  isLogin ? 'Se connecter' : 'Créer mon compte'
                )}
              </button>
            </div>
          </form>

          {/* Basculer entre connexion et inscription */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-base-content/60">
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
              <button
                type="button"
                className="btn btn-link btn-sm"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage(null);
                  // Conserver l'email et mot de passe, réinitialiser le reste
                  setFormData(prev => ({ 
                    email: prev.email, 
                    password: prev.password, 
                    fullName: '', 
                    country: 'FR' 
                  }));
                }}
              >
                {isLogin ? 'Créer un compte' : 'Se connecter'}
              </button>
            </p>
            
            <p className="text-sm text-base-content/40">
              <button
                type="button"
                className="btn btn-link btn-xs"
                onClick={() => router.push('/')}
              >
                ← Retour à l&apos;accueil
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
