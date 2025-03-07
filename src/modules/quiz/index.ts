/**
 * Módulo de Quiz
 * Contém componentes, hooks e funções para implementação de quizzes interativos
 */

// Exportação direta do componente principal
export { default as QuizMain } from './components/QuizMain';

// Exportações de tipos
export * from './types';

// Exportação dos componentes de UI
export * from './components/ui';

// Exportações de hooks
export { default as useQuiz } from './hooks/useQuiz';

// Outras exportações serão habilitadas quando os arquivos forem verificados
// export * from './api';
// export * from './adapters/supabase'; 