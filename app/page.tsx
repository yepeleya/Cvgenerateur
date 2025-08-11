"use client"
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import AuthManager from "./utils/AuthManager";
import AuthForm from "./components/AuthForm";

export default function HomePage() {
  // const { isDarkMode } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification au chargement - UNE SEULE FOIS
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = AuthManager.getCurrentUser();
        if (user) {
          // Si l'utilisateur est connecté, rediriger vers le dashboard
          router.replace('/dashboard');
        } else {
          // Si pas connecté, afficher le formulaire d'authentification
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Erreur de vérification auth:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Volontairement pas de dépendance router pour éviter les boucles

  // Fonction appelée après connexion/inscription réussie
  const handleAuthSuccess = () => {
    // Redirection immédiate vers le dashboard
    router.replace('/dashboard');
  };

  // Écran de chargement pendant la vérification initiale
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Chargement...</h2>
          <p className="text-gray-500 mt-2">Vérification de l&apos;authentification</p>
        </div>
      </div>
    );
  }

  // Afficher le formulaire d'authentification si pas connecté
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <AuthForm onSuccess={handleAuthSuccess} />
    </div>
  );
}
