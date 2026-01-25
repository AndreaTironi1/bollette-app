'use client';

import { useAuth } from '@/context/AuthContext';
import { APP_VERSION } from '@/lib/constants';
import { User, LogOut } from 'lucide-react';

export default function Header() {
  const { username, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Utente - Sinistra */}
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-5 h-5 text-indigo-600" />
            <span className="font-medium">{username}</span>
          </div>

          {/* Titolo - Centro */}
          <h1 className="text-xl font-bold text-gray-800">
            Bollette Analyzer
          </h1>

          {/* Versione e Logout - Destra */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              v{APP_VERSION}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
