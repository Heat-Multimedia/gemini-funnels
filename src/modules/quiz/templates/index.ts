// Arquivo de índice para exportar funcionalidades relacionadas a templates

// Exportar todas as funções do loader
export * from './loader';

// Exportar os templates disponíveis
export { quizTemplate as aprendizagemQuiz } from './aprendizagem-ia-criancas';
export { quizTemplate as transformacaoDigitalQuiz } from './transformacao-digital-negocios';

// Inicialização dos templates no registro
import { registerQuizTemplate } from './loader';
import { quizTemplate as aprendizagemQuiz } from './aprendizagem-ia-criancas';
import { quizTemplate as transformacaoDigitalQuiz } from './transformacao-digital-negocios';

// Registrar os templates disponíveis
registerQuizTemplate('aprendizagem-ia-criancas', aprendizagemQuiz);
registerQuizTemplate('transformacao-digital-negocios', transformacaoDigitalQuiz); 