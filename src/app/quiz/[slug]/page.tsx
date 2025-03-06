import React from 'react';
import { QuizMain } from '@/modules/quiz';

export default function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-blue-50 to-white">
      <QuizMain slug={slug} />
    </div>
  );
}
