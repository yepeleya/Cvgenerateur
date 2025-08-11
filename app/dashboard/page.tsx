'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  User, 
  Settings,
  Plus,
  Search,
  Grid3X3,
  List,
  Bell,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import AuthManager from '@/app/utils/AuthManager';
import { User as UserType } from '@/type';
import { useRouter } from 'next/navigation';
import CvGrid from '@/app/dashboard/components/CvGrid';
import UserProfile from '@/app/dashboard/components/UserProfile';
import DashboardStats from '@/app/dashboard/components/DashboardStats';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification
    if (typeof window === 'undefined') return;
    
    if (!AuthManager.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const currentUser = AuthManager.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    AuthManager.logout();
    router.push('/auth/login');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  const menuItems: Array<{
    id: string;
    label: string;
    icon: React.ElementType;
    action?: () => void;
  }> = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'cvs', label: 'Mes CV', icon: FileText },
    { id: 'create-cv', label: 'Créer un CV', icon: Plus, action: () => router.push('/cv-pro') },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/60">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Sidebar */}
      <div className="drawer lg:drawer-open">
        <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
        
        {/* Sidebar */}
        <div className="drawer-side">
          <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
          <aside className="min-h-full w-64 bg-base-100 shadow-xl">
            {/* Logo */}
            <div className="p-6 border-b border-base-200">
              <h1 className="text-2xl font-bold text-primary">
                CV<span className="text-secondary">Pro</span>
              </h1>
              <p className="text-sm text-base-content/60 mt-1">Par Tenena</p>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-base-200">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    <span className="font-bold">
                      {user?.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm truncate">{user?.fullName}</p>
                  <p className="text-xs text-base-content/60 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <nav className="p-4">
              <ul className="menu menu-compact">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <a
                      onClick={() => {
                        if (item.action) {
                          item.action();
                        } else {
                          setActiveTab(item.id);
                        }
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        activeTab === item.id 
                          ? 'bg-primary text-primary-content shadow-lg' 
                          : 'hover:bg-base-200'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Bottom Actions */}
            <div className="absolute bottom-4 left-4 right-4 space-y-2">
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-sm w-full justify-start gap-3"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDarkMode ? 'Mode clair' : 'Mode sombre'}
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm w-full justify-start gap-3 text-error"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </aside>
        </div>

        {/* Main Content */}
        <div className="drawer-content">
          {/* Top Bar */}
          <header className="bg-base-100 shadow-sm border-b border-base-200">
            <div className="flex items-center justify-between p-4 lg:px-6">
              <div className="flex items-center gap-4">
                <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost lg:hidden">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </label>
                
                <div className="hidden lg:block">
                  <h2 className="text-2xl font-bold text-base-content">
                    {menuItems.find(item => item.id === activeTab)?.label}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Search Bar */}
                {activeTab === 'cvs' && (
                  <div className="form-control hidden sm:block">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        className="input input-bordered input-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button className="btn btn-square btn-sm">
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* View Toggle */}
                {activeTab === 'cvs' && (
                  <div className="btn-group">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`btn btn-sm ${viewMode === 'grid' ? 'btn-active' : ''}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`btn btn-sm ${viewMode === 'list' ? 'btn-active' : ''}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Notifications */}
                <button className="btn btn-ghost btn-circle">
                  <div className="indicator">
                    <Bell className="w-5 h-5" />
                    <span className="badge badge-xs badge-primary indicator-item"></span>
                  </div>
                </button>

                {/* New CV Button */}
                <button
                  onClick={() => router.push('/cv-pro')}
                  className="btn btn-primary btn-sm gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nouveau CV</span>
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 lg:p-6">
            {activeTab === 'dashboard' && <DashboardStats user={user} />}
            {activeTab === 'cvs' && (
              <CvGrid 
                searchQuery={searchQuery} 
                viewMode={viewMode}
                onEditCv={(cvId: string) => router.push(`/cv-pro?loadCv=${cvId}`)}
              />
            )}
            {activeTab === 'profile' && <UserProfile user={user} />}
            {activeTab === 'settings' && (
              <div className="max-w-4xl space-y-6">
                {/* Paramètres généraux */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title mb-4">Paramètres généraux</h3>
                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Langue de l&apos;interface</span>
                        </label>
                        <select className="select select-bordered">
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Thème par défaut</span>
                        </label>
                        <select className="select select-bordered">
                          <option value="light">Clair</option>
                          <option value="dark">Sombre</option>
                          <option value="auto">Automatique</option>
                        </select>
                      </div>
                      
                      <div className="form-control">
                        <label className="cursor-pointer label">
                          <span className="label-text">Notifications par email</span>
                          <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </label>
                      </div>
                      
                      <div className="form-control">
                        <label className="cursor-pointer label">
                          <span className="label-text">Sauvegarde automatique</span>
                          <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Paramètres de compte */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title mb-4">Sécurité et compte</h3>
                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Changer le mot de passe</span>
                        </label>
                        <button className="btn btn-outline btn-sm w-fit">
                          Modifier le mot de passe
                        </button>
                      </div>
                      
                      <div className="form-control">
                        <label className="cursor-pointer label">
                          <span className="label-text">Authentification à deux facteurs</span>
                          <input type="checkbox" className="toggle toggle-secondary" />
                        </label>
                      </div>
                      
                      <div className="divider"></div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-error">Zone de danger</span>
                        </label>
                        <button className="btn btn-error btn-outline btn-sm w-fit">
                          Supprimer le compte
                        </button>
                        <label className="label">
                          <span className="label-text-alt text-error">
                            Cette action est irréversible
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export et données */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title mb-4">Données et export</h3>
                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Exporter mes données</span>
                        </label>
                        <button className="btn btn-outline btn-sm w-fit">
                          Télécharger mes données (JSON)
                        </button>
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Vider le cache</span>
                        </label>
                        <button className="btn btn-outline btn-sm w-fit">
                          Vider le cache du navigateur
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
