import React from 'react';
import { QuizMain } from '@/modules/quiz';

/**
 * Página de teste para verificar o funcionamento do módulo de quiz
 */
export default function TestModulePage() {
  // Usando um slug de quiz que sabemos que existe
  const slug = 'aprendizagem-ia-criancas';
  
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Teste do Módulo de Quiz
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <QuizMain slug={slug} />
        </div>
      </div>
    </div>
  );
} 