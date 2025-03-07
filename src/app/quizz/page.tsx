import React from 'react';
import { QuizzesListPage, getQuizzes } from '@/modules/quiz';

/**
 * Página principal de listagem de quizzes
 * Usa o componente modularizado do módulo quiz
 */
export default async function QuizzesPage() {
  // Busca quizzes usando a API do módulo
  const quizzes = await getQuizzes();
  
  // Renderiza a página de listagem de quizzes do módulo
  return <QuizzesListPage quizzes={quizzes} />;
} 