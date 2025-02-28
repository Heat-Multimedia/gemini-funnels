import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';

// Define the request schema
const requestSchema = z.object({
  step_id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Aguardar os parâmetros dinâmicos conforme recomendação do Next.js
    const awaitedParams = await params;
    const sessionId = awaitedParams.sessionId;
    
    // Validate the request body
    const body = await req.json();
    const validatedBody = requestSchema.safeParse(body);

    if (!validatedBody.success) {
      console.log(validatedBody.error);
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const { step_id, question, answer } = validatedBody.data;

    // Create supabase client
    const supabase = createClient();

    // Log the data being inserted
    console.log('Inserting quiz answer:', {
      session_id: sessionId,
      step_id,
      question,
      answer,
    });

    // Create a new quiz answer
    const { data: quizAnswer, error: quizAnswerError } = await supabase
      .from('quiz_answers')
      .insert({
        session_id: sessionId, // Corrected column name to match database schema
        step_id,
        question,
        answer,
      })
      .select()
      .single();

    if (quizAnswerError) {
      console.error('Error creating quiz answer:', quizAnswerError);
      return NextResponse.json({ message: "Failed to create quiz answer" }, { status: 500 });
    }

    console.log('Quiz answer created successfully:', quizAnswer);

    // Return the new quiz answer
    return NextResponse.json(quizAnswer, { status: 201 });

  } catch (e: any) {
    console.error('Unexpected error in answers API:', e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}