"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthManager from "./utils/AuthManager";

export default function HomePage() {
  const router = useRouter();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const user = AuthManager.getCurrentUser();
    if (user) {
      // Si l'utilisateur est connecté, rediriger vers le dashboard
      router.push('/dashboard');
      return;
    }
    
    // Si pas connecté, rediriger vers la page de connexion
    router.push('/auth/login');
  }, [router]);

  // Afficher un écran de chargement pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Chargement...</h2>
        <p className="text-gray-500 mt-2">Redirection en cours</p>
      </div>
    </div>
  );
}
