import { createAdminClient } from '../adapters/supabase';
import { DashboardStats } from '../types';

/**
 * Obtém as estatísticas gerais para o dashboard
 * @param days Número de dias para filtrar os dados (7, 30 ou null para todos)
 */
export async function getDashboardStats(days?: number | null): Promise<DashboardStats> {
  const supabase = createAdminClient();
  
  try {
    // Configura filtro de data se necessário
    let dateFilter;
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      dateFilter = daysAgo.toISOString();
    }
    
    // Busca contagens em paralelo para melhor performance
    const [
      { data: totalLeadsData, error: leadsError },
      { data: totalSessionsData, error: sessionsError },
      { data: completionsData, error: completionsError },
      { data: dailyLeadsData, error: dailyLeadsError }
    ] = await Promise.all([
      // Total de leads
      supabase
        .from('leads')
        .select('count', { count: 'exact' })
        .gte('created_at', dateFilter ?? ''),
        
      // Total de sessões
      supabase
        .from('quiz_sessions')
        .select('count', { count: 'exact' })
        .gte('started_at', dateFilter ?? ''),
        
      // Sessões completadas
      supabase
        .from('quiz_sessions')
        .select('count', { count: 'exact' })
        .not('finished_at', 'is', null)
        .gte('started_at', dateFilter ?? ''),
        
      // Dados de leads por dia para o gráfico
      supabase
        .from('leads')
        .select('created_at')
        .gte('created_at', dateFilter ?? '')
        .order('created_at', { ascending: true })
    ]);
    
    if (leadsError) throw leadsError;
    if (sessionsError) throw sessionsError;
    if (completionsError) throw completionsError;
    if (dailyLeadsError) throw dailyLeadsError;
    
    // Calcula taxa de conversão
    const totalLeads = totalLeadsData?.count ?? 0;
    const totalSessions = totalSessionsData?.count ?? 0;
    const completions = completionsData?.count ?? 0;
    
    const conversionRate = totalSessions > 0 
      ? Math.round((totalLeads / totalSessions) * 100) 
      : 0;
    
    // Processa dados diários para o gráfico
    const dailyLeadsMap = new Map<string, number>();
    
    if (dailyLeadsData) {
      dailyLeadsData.forEach((lead) => {
        const date = new Date(lead.created_at).toLocaleDateString();
        dailyLeadsMap.set(date, (dailyLeadsMap.get(date) || 0) + 1);
      });
    }
    
    const dailyLeads = Array.from(dailyLeadsMap.entries()).map(([date, count]) => ({
      date,
      count
    }));
    
    return {
      totalLeads,
      totalSessions,
      conversionRate,
      quizCompletions: completions,
      dailyLeads
    };
    
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    throw error;
  }
} 