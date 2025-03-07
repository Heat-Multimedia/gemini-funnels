'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica do componente QuizMain
const QuizMain = dynamic(() => import('@/modules/quiz').then((mod) => mod.QuizMain), {
  loading: () => <p>Carregando módulo de quiz...</p>
});

/**
 * Componente cliente para o quiz
 */
export default function QuizClient({ slug }: { slug: string }) {
  return (
    <div className="p-4 border rounded-lg">
      <QuizMain slug={slug} />
    </div>
  );
} 