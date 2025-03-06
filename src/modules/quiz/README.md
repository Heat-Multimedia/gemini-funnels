# Módulo de Quiz

Um módulo reutilizável para criar experiências de quiz e funis de captura de leads com Next.js e Supabase.

## Instalação

```bash
npm install @gemini-funnels/quiz-module
```

## Uso Básico

```jsx
import { QuizMain } from '@gemini-funnels/quiz-module';

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <QuizMain slug="seu-quiz-slug" />
    </div>
  );
}
```

## Componentes

### QuizMain

O componente principal que renderiza a experiência completa do quiz.

```jsx
<QuizMain 
  slug="seu-quiz-slug"
  // Propriedades adicionais, se necessário
/>
```

## Hooks

### useQuiz

Hook para gerenciar o estado e a lógica do quiz.

```jsx
import { useQuiz } from '@gemini-funnels/quiz-module';

function MinhaComponentePersonalizada() {
  const { quizState, nextQuestion, previousQuestion, recordAnswer } = useQuiz('seu-quiz-slug');
  
  // Seu código personalizado aqui
}
```

## Adaptadores

### SupabaseQuizAdapter

Adaptador para integração com Supabase.

```jsx
import { SupabaseQuizAdapter } from '@gemini-funnels/quiz-module';

const adapter = new SupabaseQuizAdapter(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Uso do adaptador
const quiz = await adapter.getQuizBySlug('seu-quiz-slug');
```

## Estrutura do Banco de Dados

O módulo espera a seguinte estrutura de tabelas no Supabase:

- `quizzes`: Tabela de quizzes
- `quiz_steps`: Tabela de passos/perguntas do quiz
- `quiz_sessions`: Tabela de sessões do usuário
- `quiz_events`: Tabela de eventos ocorridos durante o quiz
- `quiz_answers`: Tabela de respostas do usuário

## Requisitos

- Next.js 15.x ou superior
- React 18.x ou superior
- Supabase JS Client 2.x ou superior

## Licença

MIT 