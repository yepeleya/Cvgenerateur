import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { User, AuthResponse } from '@/type';

// Simuler une base de données en localStorage (en attendant le backend)
class AuthManager {
  private static readonly USERS_KEY = 'cv-generateur-users';
  private static readonly CURRENT_USER_KEY = 'cv-generateur-current-user';
  private static readonly JWT_SECRET = 'cv-generateur-secret-key-2025';
  private static readonly TOKEN_EXPIRY = '7d';

  // Créer un token simple pour le côté client
  private static generateToken(userId: string, email: string): string {
    const payload = {
      userId,
      email,
      timestamp: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 jours
    };
    return btoa(JSON.stringify(payload));
  }

  // Vérifier la validité d'un token
  private static verifyToken(token: string): { userId: string; email: string } | null {
    try {
      const payload = JSON.parse(atob(token));
      if (payload.expiresAt < Date.now()) {
        return null; // Token expiré
      }
      return { userId: payload.userId, email: payload.email };
    } catch {
      return null; // Token invalide
    }
  }

  // Inscription
  static async register(email: string, password: string, userData: Partial<User>): Promise<AuthResponse> {
    try {
      // Vérifications côté client uniquement
      if (typeof window === 'undefined') {
        return {
          success: false,
          message: 'Inscription disponible côté client uniquement'
        };
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUsers = this.getUsers();
      const userExists = existingUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (userExists) {
        return {
          success: false,
          message: 'Un compte avec cet email existe déjà'
        };
      }

      // Valider les données de base
      if (!email || !password || !userData.fullName) {
        return {
          success: false,
          message: 'Les champs email, mot de passe et nom complet sont obligatoires'
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          message: 'Le mot de passe doit contenir au moins 6 caractères'
        };
      }

      // Pour l'environnement de développement, utiliser un hash simple
      let hashedPassword: string;
      try {
        hashedPassword = await bcrypt.hash(password, 12);
      } catch {
        console.warn('Bcrypt non disponible, utilisation d\'un hash simple');
        // Fallback simple pour le développement
        hashedPassword = btoa(password + this.JWT_SECRET);
      }
      
      // Créer le nouvel utilisateur
      const newUser: User & { password: string } = {
        id: uuidv4(),
        email: email.toLowerCase().trim(),
        fullName: userData.fullName!.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        password: hashedPassword,
        // Ajouter les données optionnelles si fournies
        ...(userData.phone && { phone: userData.phone }),
        ...(userData.dateOfBirth && { dateOfBirth: userData.dateOfBirth }),
        ...(userData.gender && { gender: userData.gender }),
        ...(userData.nationality && { nationality: userData.nationality }),
        ...(userData.address && { address: userData.address }),
        ...(userData.city && { city: userData.city }),
        ...(userData.postalCode && { postalCode: userData.postalCode }),
        ...(userData.country && { country: userData.country }),
        ...(userData.profession && { profession: userData.profession }),
        ...(userData.company && { company: userData.company }),
        ...(userData.experienceLevel && { experienceLevel: userData.experienceLevel }),
        ...(userData.website && { website: userData.website }),
        ...(userData.linkedin && { linkedin: userData.linkedin }),
        ...(userData.github && { github: userData.github }),
        ...(userData.portfolio && { portfolio: userData.portfolio }),
        ...(userData.preferredLanguage && { preferredLanguage: userData.preferredLanguage }),
        ...(userData.timezone && { timezone: userData.timezone }),
        newsletter: userData.newsletter || false,
        marketingConsent: userData.marketingConsent || false,
        ...(userData.bio && { bio: userData.bio })
      };

      // Sauvegarder l'utilisateur
      existingUsers.push(newUser);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(existingUsers));

      // Générer un token
      const token = this.generateToken(newUser.id, newUser.email);

      // Sauvegarder le token dans les cookies
      Cookies.set('auth-token', token, { expires: 7 });

      // Sauvegarder l'utilisateur actuel
      const userForStorage: User = { ...newUser };
      delete (userForStorage as User & { password?: string }).password;
      this.setCurrentUser(userForStorage);

      return {
        success: true,
        message: 'Compte créé avec succès !',
        user: userForStorage,
        token
      };

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return {
        success: false,
        message: 'Erreur lors de la création du compte: ' + (error as Error).message
      };
    }
  }

  // Connexion
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      if (!email || !password) {
        return {
          success: false,
          message: 'Email et mot de passe requis'
        };
      }

      // Trouver l'utilisateur
      const users = this.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return {
          success: false,
          message: 'Email ou mot de passe incorrect'
        };
      }

      // Vérifier le mot de passe (avec fallback pour le hash simple)
      let passwordMatch = false;
      try {
        passwordMatch = await bcrypt.compare(password, user.password);
      } catch {
        // Fallback pour le hash simple
        const simpleHash = btoa(password + this.JWT_SECRET);
        passwordMatch = user.password === simpleHash;
      }

      if (!passwordMatch) {
        return {
          success: false,
          message: 'Email ou mot de passe incorrect'
        };
      }

      // Générer un token
      const token = this.generateToken(user.id, user.email);

      // Sauvegarder le token dans les cookies
      Cookies.set('auth-token', token, { expires: 7 });

      // Sauvegarder l'utilisateur actuel
      const userForStorage: User = { ...user };
      delete (userForStorage as User & { password?: string }).password;
      this.setCurrentUser(userForStorage);

      return {
        success: true,
        message: 'Connexion réussie !',
        user: userForStorage,
        token
      };

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return {
        success: false,
        message: 'Erreur lors de la connexion: ' + (error as Error).message
      };
    }
  }

  // Déconnexion
  static logout(): void {
    try {
      // Supprimer le token des cookies
      Cookies.remove('auth-token');
      
      // Supprimer l'utilisateur actuel
      localStorage.removeItem(this.CURRENT_USER_KEY);
      
      // Rediriger vers la page de connexion
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  // Vérifier si l'utilisateur est connecté
  static isAuthenticated(): boolean {
    try {
      const token = Cookies.get('auth-token');
      if (!token) return false;

      // Vérifier la validité du token
      return this.verifyToken(token) !== null;
    } catch {
      // Token invalide ou expiré
      this.logout();
      return false;
    }
  }

  // Obtenir l'utilisateur actuel
  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null; // Vérification côté serveur
    
    try {
      if (!this.isAuthenticated()) return null;
      
      const userStr = localStorage.getItem(this.CURRENT_USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  // Mettre à jour le profil utilisateur
  static async updateProfile(updatedData: Partial<User>): Promise<AuthResponse> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: 'Utilisateur non connecté'
        };
      }

      // Mettre à jour l'utilisateur dans la liste
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      if (userIndex === -1) {
        return {
          success: false,
          message: 'Utilisateur introuvable'
        };
      }

      // Mettre à jour les données
      const updatedUser: User = {
        ...users[userIndex],
        ...updatedData,
        updatedAt: new Date().toISOString()
      };

      delete (updatedUser as User & { password?: string }).password; // Ne pas inclure le mot de passe dans la réponse
      users[userIndex] = { ...users[userIndex], ...updatedData, updatedAt: new Date().toISOString() };
      
      // Sauvegarder
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      this.setCurrentUser(updatedUser);

      return {
        success: true,
        message: 'Profil mis à jour avec succès',
        user: updatedUser
      };

    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      return {
        success: false,
        message: 'Erreur lors de la mise à jour du profil'
      };
    }
  }

  // Méthodes privées
  private static getUsers(): (User & { password: string })[] {
    if (typeof window === 'undefined') return []; // Vérification côté serveur
    
    try {
      const usersStr = localStorage.getItem(this.USERS_KEY);
      return usersStr ? JSON.parse(usersStr) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  }

  private static setCurrentUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  // Méthode utilitaire pour obtenir le token
  static getToken(): string | null {
    return Cookies.get('auth-token') || null;
  }

  // Valider l'email
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default AuthManager;
