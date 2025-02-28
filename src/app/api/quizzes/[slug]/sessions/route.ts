import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';

// Define the request schema
const requestSchema = z.object({
  quiz_id: z.string().uuid(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Aguardar os parâmetros dinâmicos conforme recomendação do Next.js
    const awaitedParams = await params;
    const slug = awaitedParams.slug;
    console.log('Creating session for quiz with slug:', slug);
    
    // Validate the request body
    const body = await req.json();
    console.log('Request body:', body);
    
    const validatedBody = requestSchema.safeParse(body);

    if (!validatedBody.success) {
      console.log('Validation error:', validatedBody.error);
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const { quiz_id } = validatedBody.data;
    console.log('Quiz ID:', quiz_id, 'Slug:', slug);

    // Create supabase client
    const supabase = createClient();
    console.log('Supabase client created');

    // Check if the quiz exists
    console.log('Checking if quiz exists with slug:', slug);
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('slug', slug)
      .single();

    console.log('Quiz data:', quiz);
    
    if (quizError) {
      console.error('Error fetching quiz:', quizError);
      return NextResponse.json({ message: "Failed to fetch quiz" }, { status: 500 });
    }

    if (!quiz) {
      console.log('Quiz not found with slug:', slug);
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    // Create a new quiz session with current_step initialized
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
      return NextResponse.json({ message: "Failed to create quiz session" }, { status: 500 });
    }

    console.log('Session created successfully:', session);
    
    // Return the new session
    return NextResponse.json(session, { status: 201 });

  } catch (e: any) {
    console.error('Unexpected error:', e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}