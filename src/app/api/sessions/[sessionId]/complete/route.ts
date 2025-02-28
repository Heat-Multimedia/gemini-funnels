import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Aguardar os parâmetros dinâmicos conforme recomendação do Next.js
    const awaitedParams = await params;
    const sessionId = awaitedParams.sessionId;

    // Create supabase client
    const supabase = createClient();

    // Update the quiz session to mark it as complete
    const { data: updatedSession, error: updatedSessionError } = await supabase
      .from('quiz_sessions')
      .update({ finished_at: new Date() })
      .eq('id', sessionId)
      .select()
      .single();

    if (updatedSessionError) {
      console.error(updatedSessionError);
      return NextResponse.json({ message: "Failed to complete quiz session" }, { status: 500 });
    }

    // Return the updated session
    return NextResponse.json(updatedSession, { status: 200 });

  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
