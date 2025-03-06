// Serviço para carregar os templates de quiz dinamicamente

import { quizTemplate as aprendizagemQuiz } from './aprendizagem-ia-criancas';
import { quizTemplate as transformacaoDigitalQuiz } from './transformacao-digital-negocios';
import { QuestionData } from './aprendizagem-ia-criancas';

// Tipo para o template completo do quiz
export interface QuizTemplate {
  slug: string;
  title: string;
  description: string;
  questions: QuestionData[];
  testimonials: {
    text: string;
    author: string;
  }[];
  questionOrder: string[];
}

// Todos os quizzes disponíveis
const quizzes: Record<string, QuizTemplate> = {
  'aprendizagem-ia-criancas': aprendizagemQuiz,
  'transformacao-digital-negocios': transformacaoDigitalQuiz,
};

/**
 * Carrega um quiz específico pelo slug
 */
export function getQuizBySlug(slug: string): QuizTemplate | null {
  return quizzes[slug] || null;
}

/**
 * Lista todos os quizzes disponíveis
 */
export function getAllQuizzes(): QuizTemplate[] {
  return Object.values(quizzes);
}

/**
 * Obtém uma questão específica de um quiz pelo ID
 */
export function getQuestionById(quiz: QuizTemplate, questionId: string): QuestionData | null {
  return quiz.questions.find(q => q.id === questionId) || null;
}

/**
 * Obtém o índice de uma questão com base na ordem definida
 */
export function getQuestionIndex(quiz: QuizTemplate, questionId: string): number {
  return quiz.questionOrder.indexOf(questionId);
}

/**
 * Obtém o total de questões no quiz
 */
export function getTotalQuestions(quiz: QuizTemplate): number {
  return quiz.questionOrder.length;
}

/**
 * Obtém o ID da questão baseado no índice
 */
export function getQuestionIdByIndex(quiz: QuizTemplate, index: number): string | null {
  if (index < 0 || index >= quiz.questionOrder.length) {
    return null;
  }
  
  return quiz.questionOrder[index];
}

/**
 * Obtém os depoimentos associados ao quiz
 */
export function getTestimonials(quiz: QuizTemplate) {
  return quiz.testimonials;
}

export type { QuestionData }; 