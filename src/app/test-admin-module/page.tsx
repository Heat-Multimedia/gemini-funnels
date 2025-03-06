import React from 'react';
import { Dashboard } from '@/modules/admin';

/**
 * Página de teste para verificar o funcionamento dos componentes do módulo Admin
 */
export default function TestAdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Página de Teste - Módulo Admin
      </h1>
      
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <Dashboard />
      </div>
    </div>
  );
}
