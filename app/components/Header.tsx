import React from 'react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function Header({ darkMode, onToggleDark }: HeaderProps) {
  return (
    <header className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-900 dark:to-gray-800 shadow-lg">
      <div className="flex items-center gap-3">
        <img src="/profil.jpg" alt="Logo" className="h-10 w-10 rounded-full border-2 border-white" />
        <span className="text-white text-2xl font-bold tracking-tight">CV Pro Builder</span>
      </div>
      <nav className="hidden md:flex gap-6 text-white font-medium">
        <a href="/dashboard" className="hover:underline">Dashboard</a>
        <a href="/cv-pro" className="hover:underline">Créer un CV</a>
        <a href="/modèles" className="hover:underline">Modèles</a>
      </nav>
      <button
        onClick={onToggleDark}
        className="ml-4 p-2 rounded-full bg-white/20 hover:bg-white/40 transition"
        title={darkMode ? 'Mode clair' : 'Mode sombre'}
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m8.485-8.485h-1.5m-13.97 0h-1.5m15.364 6.364l-1.06-1.06m-10.607 0l-1.06 1.06m15.364-12.728l-1.06 1.06m-10.607 0l-1.06-1.06M12 7.5A4.5 4.5 0 1012 16.5a4.5 4.5 0 000-9z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-200">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.136 2.664-7.64 6.405-9.165a.75.75 0 01.908.325.75.75 0 01-.098.976A7.501 7.501 0 0012 19.5a7.48 7.48 0 006.614-3.938.75.75 0 01.976-.098.75.75 0 01.325.908z" />
          </svg>
        )}
      </button>
    </header>
  );
}
