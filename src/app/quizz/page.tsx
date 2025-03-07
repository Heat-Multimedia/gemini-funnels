import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

async function getQuizzes() {
  try {
    const supabase = createServerComponentClient<Database>({ cookies });
    
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching quizzes:', error);
      throw new Error('Failed to fetch quizzes');
    }
    
    return quizzes || [];
  } catch (err) {
    console.error('Error in getQuizzes:', err);
    return [];
  }
}

export default async function QuizzesPage() {
  const quizzes = await getQuizzes();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      {/* Quizzes Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Quizzes Disponíveis
          </h1>
          
          {quizzes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">Não há quizzes disponíveis no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 mb-6 h-20 overflow-hidden">{quiz.description}</p>
                  <Link 
                    href={`/quiz/${quiz.slug}`}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Iniciar quiz <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50 mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que usar nossos quizzes?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rápido e Eficiente</h3>
              <p className="text-gray-600">Obtenha resultados personalizados em menos de 2 minutos.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Soluções Precisas</h3>
              <p className="text-gray-600">Algoritmos avançados para encontrar exatamente o que você precisa.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalizado</h3>
              <p className="text-gray-600">Cada recomendação é adaptada às suas necessidades específicas.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 