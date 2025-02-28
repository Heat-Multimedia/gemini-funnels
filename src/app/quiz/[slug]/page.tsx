import React from 'react';
import QuizMain from '@/components/quiz/QuizMain';
import Link from 'next/link';

interface QuizPageProps {
  params: {
    slug: string;
  };
}

const QuizPage: React.FC<QuizPageProps> = ({ params }) => {
  const { slug } = params;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-center md:justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors hidden md:block">
            Quiz Funnel System
          </Link>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-1 hidden md:inline">Você está fazendo:</span>
            <h1 className="text-md font-medium text-gray-800">
              {slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h1>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto">
        <QuizMain slug={slug} />
      </div>
      
      <footer className="mt-auto py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Quiz Funnel System. Todos os direitos reservados.</p>
          <div className="flex mt-2 md:mt-0 space-x-4">
            <Link href="/termos" className="text-xs text-gray-500 hover:text-gray-700">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="text-xs text-gray-500 hover:text-gray-700">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuizPage;
