'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  TrendingUp, 
  Award,
  BarChart3,
  Download,
  Share2,
  Star
} from 'lucide-react';
import CvStorageManager, { SavedCv } from '@/app/utils/CvStorageManager';
import { User as UserType } from '@/type';

interface DashboardStatsProps {
  user: UserType | null;
}

export default function DashboardStats({ user }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    totalCvs: 0,
    recentActivity: 0,
    completionRate: 0,
    downloads: 0
  });

  const [recentCvs, setRecentCvs] = useState<SavedCv[]>([]);
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadStats();
  }, []);

  const loadStats = () => {
    if (typeof window === 'undefined') return;

    try {
      const cvs = CvStorageManager.getSavedCvs();
      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const recentActivity = cvs.filter(cv => 
        new Date(cv.updatedAt) > lastWeek
      ).length;

      // Calculer le taux de completion basé sur les champs remplis
      const completionRates = cvs.map(cv => {
        const fields = [
          cv.data.personalDetails.fullName,
          cv.data.personalDetails.email,
          cv.data.personalDetails.phone,
          cv.data.experiences.length > 0,
          cv.data.educations.length > 0,
          cv.data.competences.length > 0
        ];
        return (fields.filter(Boolean).length / fields.length) * 100;
      });

      const avgCompletion = completionRates.length > 0 
        ? completionRates.reduce((a, b) => a + b, 0) / completionRates.length 
        : 0;

      setStats({
        totalCvs: cvs.length,
        recentActivity,
        completionRate: Math.round(avgCompletion),
        downloads: 0 // On charge les vraies données côté client sans Math.random
      });

      // CV récents (3 derniers)
      const sortedCvs = cvs
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3);
      setRecentCvs(sortedCvs);

    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const statCards = [
    {
      title: 'Total CV',
      value: stats.totalCvs,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+2 ce mois',
      trendUp: true
    },
    {
      title: 'Activité récente',
      value: stats.recentActivity,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: 'Cette semaine',
      trendUp: true
    },
    {
      title: 'Completion',
      value: `${stats.completionRate}%`,
      icon: Award,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      trend: 'Moyenne',
      trendUp: stats.completionRate > 70
    },
    {
      title: 'Téléchargements',
      value: stats.downloads,
      icon: Download,
      color: 'text-info',
      bgColor: 'bg-info/10',
      trend: '+12 ce mois',
      trendUp: true
    }
  ];

  return (
    <div className="space-y-8">
      {!isClient ? (
        // Skeleton loading state pour éviter les problèmes d'hydratation
        <div className="space-y-8">
          <div className="hero bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl">
            <div className="hero-content text-center py-16">
              <div className="max-w-md">
                <div className="skeleton h-10 w-48 mb-4 mx-auto"></div>
                <div className="skeleton h-4 w-64 mb-6 mx-auto"></div>
                <div className="flex gap-4 justify-center">
                  <div className="skeleton h-12 w-32"></div>
                  <div className="skeleton h-12 w-32"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="skeleton h-16 w-16 mb-4"></div>
                  <div className="skeleton h-8 w-20 mb-2"></div>
                  <div className="skeleton h-4 w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Contenu réel affiché uniquement côté client
        <>
      {/* Welcome Section */}
      <div className="hero bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl">
        <div className="hero-content text-center py-16">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">
              Bonjour, {user?.fullName?.split(' ')[0]} ! 👋
            </h1>
            <p className="text-base-content/70 text-lg mb-6">
              Prêt à créer des CV exceptionnels ? Votre tableau de bord vous attend.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/cv-pro'}
              >
                <FileText className="w-5 h-5" />
                Nouveau CV
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => setShowDetailedAnalytics(!showDetailedAnalytics)}
              >
                <BarChart3 className="w-5 h-5" />
                Voir les analyses
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`text-sm ${stat.trendUp ? 'text-success' : 'text-error'}`}>
                  {stat.trend}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <p className="text-base-content/60">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Analytics Section */}
      {showDetailedAnalytics && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Analyses détaillées</h2>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => setShowDetailedAnalytics(false)}
            >
              Masquer
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique d'activité */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="font-bold mb-4">Activité des 7 derniers jours</h3>
                <div className="space-y-2">
                  {[...Array(7)].map((_, i) => {
                    const day = new Date();
                    day.setDate(day.getDate() - (6 - i));
                    const dayName = day.toLocaleDateString('fr-FR', { weekday: 'short' });
                    const activity = Math.max(0, stats.recentActivity - Math.abs(i - 3)); // Simulation basée sur les vraies données
                    
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-8 text-xs">{dayName}</span>
                        <div className="flex-1 bg-base-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${activity * 10}%` }}
                          ></div>
                        </div>
                        <span className="text-xs w-6">{activity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Répartition par type de CV */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="font-bold mb-4">Types de CV créés</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>CV Moderne</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-base-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-sm">60%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>CV Classique</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-base-200 rounded-full h-2">
                        <div className="bg-secondary h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <span className="text-sm">30%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>CV Créatif</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-base-200 rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <span className="text-sm">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils et recommandations */}
            <div className="card bg-base-100 shadow-lg lg:col-span-2">
              <div className="card-body">
                <h3 className="font-bold mb-4">Recommandations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-info/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-info" />
                      <span className="font-medium">Profil</span>
                    </div>
                    <p className="text-sm text-base-content/70">
                      Ajoutez une photo professionnelle pour augmenter vos chances de 40%
                    </p>
                  </div>
                  <div className="p-4 bg-warning/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-warning" />
                      <span className="font-medium">Expérience</span>
                    </div>
                    <p className="text-sm text-base-content/70">
                      Détaillez davantage vos réalisations avec des chiffres concrets
                    </p>
                  </div>
                  <div className="p-4 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-success" />
                      <span className="font-medium">Compétences</span>
                    </div>
                    <p className="text-sm text-base-content/70">
                      Excellent ! Votre section compétences est bien remplie
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent CVs */}
        <div className="xl:col-span-2">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">CV récents</h3>
                <button className="btn btn-ghost btn-sm">Voir tout</button>
              </div>

              {recentCvs.length > 0 ? (
                <div className="space-y-4">
                  {recentCvs.map((cv) => (
                    <div key={cv.id} className="flex items-center gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{cv.name}</h4>
                        <p className="text-sm text-base-content/60">
                          Modifié {new Date(cv.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="badge badge-primary badge-sm">
                          {cv.data.theme}
                        </div>
                        <button className="btn btn-ghost btn-sm">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                  <p className="text-base-content/60">Aucun CV récent</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Create */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="text-lg font-bold mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button className="btn btn-primary w-full justify-start gap-3">
                  <FileText className="w-5 h-5" />
                  Nouveau CV
                </button>
                <button className="btn btn-outline w-full justify-start gap-3">
                  <Download className="w-5 h-5" />
                  Importer CV
                </button>
                <button className="btn btn-outline w-full justify-start gap-3">
                  <Share2 className="w-5 h-5" />
                  Partager lien
                </button>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card bg-gradient-to-br from-success/10 to-info/10 shadow-lg">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-warning" />
                <h3 className="font-bold">Conseil du jour</h3>
              </div>
              <p className="text-sm">
                Personnalisez la couleur et la typographie de votre CV pour le rendre unique et professionnel.
              </p>
              <button className="btn btn-sm btn-ghost w-full mt-4">
                En savoir plus
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="font-bold mb-4">Progression</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Profile complété</span>
                    <span>85%</span>
                  </div>
                  <progress className="progress progress-primary w-full" value="85" max="100"></progress>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CV créés</span>
                    <span>{Math.min(stats.totalCvs * 20, 100)}%</span>
                  </div>
                  <progress className="progress progress-secondary w-full" value={Math.min(stats.totalCvs * 20, 100)} max="100"></progress>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
