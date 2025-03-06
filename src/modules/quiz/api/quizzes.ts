import { NextResponse } from 'next/server';
import { getAllQuizzes, getQuizBySlug } from '../templates';
import { createClient } from '@/lib/supabase/client';

/**
 * Recupera todos os quizzes disponíveis e formata para API
 */
export async function getAllQuizzesApi() {
  try {
    // Carregar quizzes do sistema de templates
    const quizzes = getAllQuizzes();
    
    // Transformar em formato para API
    const formattedQuizzes = quizzes.map(quiz => ({
      id: quiz.slug, // Usar slug como id
      title: quiz.title,
      description: quiz.description,
      slug: quiz.slug,
      created_at: new Date().toISOString(), // Data atual como placeholder
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: formattedQuizzes 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Erro inesperado ao buscar quizzes:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * Cria uma nova sessão para um quiz
 */
export async function createQuizSessionApi(slug: string, body: any) {
  try {
    // Validar o corpo da requisição
    if (!body || !body.quiz_id) {
      return NextResponse.json({ message: "ID do quiz é obrigatório" }, { status: 400 });
    }

    console.log('Creating session for quiz with slug:', slug);
    console.log('Request body:', body);
    
    const quiz_id = body.quiz_id;
    console.log('Quiz ID:', quiz_id, 'Slug:', slug);

    // Criar cliente Supabase
    const supabase = createClient();
    console.log('Supabase client created');

    // Verificar se o quiz existe
    console.log('Checking if quiz exists with slug:', slug);
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('slug', slug)
      .single();

    console.log('Quiz data:', quiz);
    
    if (quizError) {
      console.error('Error fetching quiz:', quizError);
      return NextResponse.json({ message: "Falha ao buscar quiz" }, { status: 500 });
    }

    if (!quiz) {
      console.log('Quiz not found with slug:', slug);
      return NextResponse.json({ message: "Quiz não encontrado" }, { status: 404 });
    }

    // Criar uma nova sessão com o passo inicial
    console.log('Creating new quiz session with quiz ID:', quiz.id);
    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert({
        quiz_id: quiz.id,
        session_token: crypto.randomUUID(),
        current_step: 'intro' // Inicializar com um valor padrão
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating quiz session:', sessionError);
      return NextResponse.json({ message: "Falha ao criar sessão de quiz" }, { status: 500 });
    }

    console.log('Session created successfully:', session);
    
    // Retornar a nova sessão
    return NextResponse.json(session, { status: 201 });
  } catch (e: any) {
    console.error('Unexpected error:', e);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
} 