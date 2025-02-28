import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';

// Define the request schema with valid event types
const requestSchema = z.object({
  event_type: z.enum(['page_view', 'button_click', 'form_submit', 'quiz_start', 'quiz_complete', 'step_complete', 'step_view', 'answer', 'submit_lead', 'webhook_success', 'webhook_failure']),
  step_id: z.string().optional(),
  event_data: z.record(z.any()).optional(),
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
      console.log('Validation error:', validatedBody.error);
      return NextResponse.json({ message: "Invalid request body", error: validatedBody.error.format() }, { status: 400 });
    }

    const { event_type, step_id, event_data } = validatedBody.data;

    // Prepare the event data to insert
    const eventDataToInsert: Record<string, any> = {
      session_id: sessionId, // Corrected column name to match database schema
      event_type,
    };

    // Only add step_id and event_data if they exist
    if (step_id) {
      eventDataToInsert.event_data = { step_id, ...event_data };
    } else if (event_data) {
      eventDataToInsert.event_data = event_data;
    }

    // Log the data being inserted
    console.log('Inserting quiz event:', eventDataToInsert);

    // Create supabase client
    const supabase = createClient();

    // Create a new quiz event
    const { data: quizEvent, error: quizEventError } = await supabase
      .from('quiz_events')
      .insert(eventDataToInsert)
      .select()
      .single();

    if (quizEventError) {
      console.error('Error creating quiz event:', quizEventError);
      return NextResponse.json({ message: "Failed to create quiz event", error: quizEventError }, { status: 500 });
    }

    console.log('Quiz event created successfully:', quizEvent);

    // Return the new quiz event
    return NextResponse.json(quizEvent, { status: 201 });

  } catch (e: any) {
    console.error('Unexpected error in events API:', e);
    return NextResponse.json({ message: "Internal server error", error: e.message }, { status: 500 });
  }
}