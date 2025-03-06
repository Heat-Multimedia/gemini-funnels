import { createClient } from '@supabase/supabase-js';
import type { Quiz, QuizStep, QuizEvent, EventType } from '../types';

/**
 * Adapter para interação com o Supabase.
 * Encapsula todas as operações de banco de dados relacionadas ao quiz.
 */
export class SupabaseQuizAdapter {
  private client;
  
  /**
   * Cria uma nova instância do adapter.
   * @param supabaseUrl URL do projeto Supabase
   * @param supabaseKey Chave de API do Supabase
   */
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
  }
  
  /**
   * Recupera um quiz pelo seu slug.
   * @param slug O slug único do quiz
   * @returns O quiz encontrado ou null
   */
  async getQuizBySlug(slug: string): Promise<Quiz | null> {
    const { data, error } = await this.client
      .from('quizzes')
      .select(`
        id, 
        title, 
        slug,
        quiz_steps (*)
      `)
      .eq('slug', slug)
      .single();
      
    if (error || !data) return null;
    
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      steps: data.quiz_steps.map((step: any) => ({
        id: step.id,
        title: step.title,
        type: step.type,
        content: step.content,
        options: step.options,
        nextStep: step.next_step
      }))
    };
  }
  
  /**
   * Cria uma nova sessão de quiz.
   * @param quizId ID do quiz
   * @returns ID da sessão criada ou null em caso de erro
   */
  async createSession(quizId: string): Promise<string | null> {
    const { data, error } = await this.client
      .from('quiz_sessions')
      .insert({
        quiz_id: quizId,
        current_step: 'intro',
        session_token: crypto.randomUUID()
      })
      .select('id')
      .single();
      
    if (error || !data) return null;
    return data.id;
  }
  
  /**
   * Registra um evento ocorrido durante o quiz.
   * @param sessionId ID da sessão do quiz
   * @param event Evento a ser registrado
   * @returns true se o evento foi registrado com sucesso
   */
  async recordEvent(sessionId: string, event: QuizEvent): Promise<boolean> {
    const { error } = await this.client
      .from('quiz_events')
      .insert({
        session_id: sessionId,
        event_type: event.type,
        event_data: event.data,
        step_id: event.stepId
      });
      
    return !error;
  }
  
  /**
   * Registra uma resposta do usuário.
   * @param sessionId ID da sessão do quiz
   * @param stepId ID da etapa (pergunta)
   * @param answer Resposta do usuário
   * @returns true se a resposta foi registrada com sucesso
   */
  async recordAnswer(sessionId: string, stepId: string, answer: string): Promise<boolean> {
    const { error } = await this.client
      .from('quiz_answers')
      .insert({
        session_id: sessionId,
        step_id: stepId,
        answer
      });
      
    return !error;
  }
  
  /**
   * Registra conclusão da sessão de quiz.
   * @param sessionId ID da sessão a ser concluída
   * @returns true se a sessão foi concluída com sucesso
   */
  async completeSession(sessionId: string): Promise<boolean> {
    const { error } = await this.client
      .from('quiz_sessions')
      .update({ finished_at: new Date().toISOString() })
      .eq('id', sessionId);
      
    return !error;
  }
  
  /**
   * Registra dados do lead capturado no quiz.
   * @param sessionId ID da sessão do quiz
   * @param name Nome do lead
   * @param email Email do lead
   * @param phone Telefone do lead (opcional)
   * @returns ID do lead criado ou null em caso de erro
   */
  async submitLead(
    sessionId: string, 
    name: string, 
    email: string, 
    phone?: string
  ): Promise<string | null> {
    // Transação para criar pessoa e associar à sessão
    const { data, error } = await this.client.rpc('create_lead', {
      p_name: name,
      p_email: email,
      p_phone: phone || null,
      p_session_id: sessionId
    });
    
    if (error || !data) return null;
    return data;
  }
} 