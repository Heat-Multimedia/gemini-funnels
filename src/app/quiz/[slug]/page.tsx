import React from 'react';
import QuizClient from './page.client';

export default function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  return <QuizClient slug={slug} />;
}
