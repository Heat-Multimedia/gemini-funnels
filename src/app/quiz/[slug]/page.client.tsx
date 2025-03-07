'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica do componente QuizMain
const QuizMain = dynamic(() => import('@/modules/quiz').then((mod) => mod.QuizMain), {
  loading: () => <p>Carregando quiz...</p>
});

/**
 * Componente cliente para o quiz
 */
export default function QuizClient({ slug }: { slug: string }) {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-blue-50 to-white">
      <QuizMain slug={slug} />
    </div>
  );
} 