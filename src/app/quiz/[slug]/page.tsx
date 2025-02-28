import React from 'react';
import QuizMain from '@/components/quiz/QuizMain';

interface QuizPageProps {
  params: {
    slug: string;
  };
}

const QuizPage: React.FC<QuizPageProps> = ({ params }) => {
  const { slug } = params;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-blue-50 to-white">
      <QuizMain slug={slug} />
    </div>
  );
};

export default QuizPage;
