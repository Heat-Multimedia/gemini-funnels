# Quiz Funnel System

Sistema de funis de quiz para captura de leads com múltiplos templates e rastreamento detalhado de respostas.

## Visão Geral

Este sistema permite criar e gerenciar funis de quiz para coleta de leads, com:

- Apresentação de quizzes em múltiplas etapas
- Rastreamento detalhado da jornada do usuário
- Análise de métricas de conversão
- Integração com sistemas de marketing via webhooks
- Suporte para múltiplos templates de quiz

## Configuração Inicial

1. Instale as dependências:

```bash
npm install
```

2. Configure o banco de dados Supabase:

```bash
# Instalar CLI do Supabase
npm install -g supabase

# Inicializar (se necessário)
supabase init

# Aplicar as migrações
supabase migration up
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do Projeto

```
src/
├── app/                  # Rotas Next.js
│   ├── api/              # API Routes
│   ├── quiz/[slug]/      # Páginas de quiz
│   └── auth/             # Páginas de autenticação
├── components/           # Componentes React
│   ├── ui/               # Componentes base de UI
│   └── quiz/             # Componentes específicos do quiz
├── hooks/                # Hooks personalizados
├── lib/                  # Utilitários compartilhados
│   ├── supabase/         # Cliente Supabase
│   ├── quiz-templates/   # Templates de quiz
│   └── validation/       # Schemas de validação
└── types/                # Tipos TypeScript
```

## Banco de Dados

O sistema utiliza Supabase como banco de dados. A estrutura inclui:

- `persons`: Armazena informações de pessoas únicas
- `quizzes`: Registra os diferentes tipos de quiz disponíveis
- `quiz_sessions`: Rastreia cada sessão de preenchimento
- `leads`: Vincula pessoas a sessões de quiz
- `quiz_answers`: Registra as respostas fornecidas
- `quiz_events`: Captura eventos durante a jornada do usuário

Para mais detalhes, consulte [supabase/README.md](./supabase/README.md).

## Templates de Quiz

Os templates de quiz são definidos em `/src/lib/quiz-templates/` e gerenciados pelo serviço `quiz-loader.ts`. Para adicionar um novo template:

1. Crie um novo arquivo no diretório de templates
2. Defina as etapas, perguntas e opções de resposta
3. O novo quiz será automaticamente registrado e disponível na plataforma

## Desenvolvimento

Para começar a desenvolver:

```bash
npm run dev        # Inicia o servidor de desenvolvimento
```

## Deploy

Para fazer deploy na Vercel:

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente necessárias
3. Execute o deploy

Para mais detalhes sobre deploy com Next.js, consulte a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying).