import { NextResponse } from 'next/server';
// Importando do novo módulo de quiz
import { getAllQuizzes } from '@/modules/quiz/templates';

export async function GET() {
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