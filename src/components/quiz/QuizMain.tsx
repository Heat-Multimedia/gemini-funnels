'use client';

import React, { useState, useEffect } from 'react';
import useQuiz from '@/hooks/useQuiz';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Define question types
type QuestionData = {
  id: string;
  [key: string]: any;
};

// Define quiz components props
interface QuizMainProps {
  slug: string;
}

// Progress bar component
const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  const percentage = Math.round((current / (total - 1)) * 100);
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-1 text-xs text-gray-500">
        <span>Progresso</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Loading spinner component
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center my-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Error message component
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
    <strong className="font-bold">Erro! </strong>
    <span className="block sm:inline">{message}</span>
  </div>
);

// Apenas o botão de avançar - removemos o botão voltar
const NextButton: React.FC<{ 
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}> = ({ onClick, disabled = false, className = '', children }) => (
  <Button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-3 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md ${className}`}
  >
    {children || 'Avançar'}
  </Button>
);

// Main quiz component
const QuizMain: React.FC<QuizMainProps> = ({ slug }) => {
  const { quizState, nextQuestion, previousQuestion, recordAnswer, getCurrentStepId } = useQuiz(slug);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    acceptedTerms: false
  });

  // Desagrupar as perguntas para uma melhor experiência 
  // Cada pergunta terá sua própria categoria mas será individual
  const defaultQuestions: QuestionData[] = [
    {
      id: 'opening',
      title: 'Seu filho pode aprender mais rápido e se destacar na escola! Descubra como em 1 minuto!',
      subtitle: 'Responda algumas perguntas e veja como acelerar o aprendizado do seu filho com uma nova tecnologia!',
    },
    {
      id: 'age',
      category: 'demographics',
      question: 'Qual a idade do seu filho?',
      options: ['6 anos', '7 anos', '8 anos', '9 anos', '10 anos'],
    },
    {
      id: 'tech',
      category: 'demographics',
      question: 'Seu filho já usa tecnologia para aprender?',
      options: [
        'Sim, ele adora aprender no celular/tablet', 
        'Sim, mas só para tarefas escolares', 
        'Não, mas quero que ele use melhor a tecnologia', 
        'Não, prefiro métodos tradicionais'
      ],
    },
    {
      id: 'socialProof',
      text: 'Mais de 1.000 pais já estão usando essa estratégia para acelerar o aprendizado dos filhos!',
      image: 'URL_IMAGEM_PROVA_SOCIAL',
    },
    {
      id: 'difficulty',
      category: 'diagnostic',
      question: 'Seu filho tem dificuldade em aprender novos conteúdos?',
      options: ['Sim, ele demora para entender', 'Às vezes, depende do assunto', 'Não, ele aprende rápido'],
    },
    {
      id: 'distraction',
      category: 'diagnostic',
      question: 'Ele se distrai com facilidade durante os estudos?',
      options: ['Sim, qualquer coisa tira a atenção dele', 'Às vezes, mas consigo trazer de volta', 'Não, ele é bem focado'],
    },
    {
      id: 'help',
      category: 'diagnostic',
      question: 'Você sente que poderia ajudar mais no aprendizado dele, mas não sabe como?',
      options: ['Sim, quero ajudá-lo mais, mas não sei como', 'Tento ajudar, mas não tenho tempo', 'Não, ele aprende bem sozinho'],
    },
    {
      id: 'ai',
      category: 'diagnostic',
      question: 'Você já tentou usar inteligência artificial para ajudar no aprendizado do seu filho?',
      options: ['Sim, mas não deu certo', 'Não, mas quero testar', 'Não, acho complicado', 'Sim, e funcionou muito bem'],
    },
    {
      id: 'pain',
      category: 'painPoints',
      question: 'Quais desses problemas você já percebeu no aprendizado do seu filho? (Escolha até 3)',
      options: [
        'Dificuldade de concentração', 
        'Falta de motivação para estudar', 
        'Dificuldade para entender textos', 
        'Problemas com cálculos matemáticos', 
        'Medo de provas e testes', 
        'Falta de apoio para aprender em casa'
      ],
      multiSelect: true,
      maxSelections: 3,
    },
    {
      id: 'feeling',
      category: 'painPoints',
      question: 'Como você se sente ao ver seu filho com dificuldades para aprender?',
      options: [
        'Preocupado(a), porque isso pode afetar o futuro dele', 
        'Frustrado(a), porque não sei como ajudar', 
        'Normal, acho que faz parte do processo'
      ],
    },
    {
      id: 'desire',
      question: 'Se pudesse melhorar apenas um aspecto do aprendizado do seu filho, qual seria?',
      options: [
        'Melhorar a concentração', 
        'Ajudá-lo a entender conteúdos mais rápido', 
        'Tornar o estudo mais divertido', 
        'Aumentar a confiança dele nos estudos'
      ],
    },
    {
      id: 'testimonials',
      text: 'Veja o que pais que já usaram o método estão dizendo!',
      image: 'URL_IMAGEM_DEPOIMENTOS',
    },
    {
      id: 'helpPromise',
      text: 'A boa notícia é que existe uma forma simples e acessível de transformar o aprendizado do seu filho!',
      question: 'Você gostaria de aprender como usar o ChatGPT para acelerar o aprendizado do seu filho em apenas 14 dias?',
      options: ['Sim! Quero ajudar meu filho a aprender mais rápido!'],
    },
    {
      id: 'microCommitment',
      question: 'Qual o seu nível de motivação para ajudar seu filho a aprender melhor?',
      options: ['Estou muito motivado(a)!', 'Quero testar, mas tenho dúvidas', 'Tenho interesse, mas preciso saber mais'],
    },
    {
      id: 'loading',
      text: 'Analisando suas respostas... Criando plano personalizado para o aprendizado do seu filho...',
    },
    {
      id: 'solution',
      title: 'Parabéns! Seu filho está pronto para aprender mais rápido e se destacar nos estudos!',
      text: 'Com base nas suas respostas, seu filho pode melhorar a concentração, aprender de forma mais interativa e se destacar na escola usando nosso método com ChatGPT!',
      comparisonImage: 'URL_IMAGEM_COMPARACAO',
      benefits: ['Passo a passo para usar o ChatGPT no aprendizado', 'Exercícios práticos para aplicar com seu filho', 'Técnicas para manter a atenção e o foco'],
      price: 'Oferta especial para quem fez o quiz!',
      cta: 'Quero transformar o aprendizado do seu filho agora!',
    },
  ];

  // Usar os defaultQuestions como fallback
  const questions = defaultQuestions;
  
  // Garantir que sempre existe um currentQuestion válido
  const currentQuestion = questions[quizState.currentQuestionIndex] || questions[0];
  const currentStepId = getCurrentStepId?.() || currentQuestion.id;
  
  // Option selection handler with manual advance
  const handleOptionSelect = (questionId: string, option: string, isMultiSelect = false, maxSelections = 1) => {
    setSelectedOptions(prev => {
      // For multi-select questions
      if (isMultiSelect) {
        const currentSelections = prev[questionId] || [];
        
        // If option is already selected, remove it
        if (currentSelections.includes(option)) {
          return {
            ...prev,
            [questionId]: currentSelections.filter(item => item !== option)
          };
        }
        
        // If max selections reached, don't add more
        if (currentSelections.length >= maxSelections) {
          return prev;
        }
        
        // Add the new option
        return {
          ...prev,
          [questionId]: [...currentSelections, option]
        };
      }
      
      // For single-select questions - no auto advance, just select
      return {
        ...prev,
        [questionId]: [option]
      };
    });
  };

  // Simplified answer submission
  const handleAnswer = (questionId: string) => {
    if (selectedOptions[questionId] && selectedOptions[questionId].length > 0) {
      // For multi-select, join the answers with a comma
      const answer = selectedOptions[questionId].join(', ');
      
      // Record the answer
      recordAnswer(questionId, answer);
      
      // Clear selection for this question
      setSelectedOptions(prev => ({
        ...prev,
        [questionId]: []
      }));
      
      // Simply advance to next question
      nextQuestion();
    }
  };

  // Simplified navigation handlers
  const handleNext = () => {
    nextQuestion();
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  // Check if the current question is a sub-question
  const isSubQuestion = (questionData: QuestionData) => {
    return questionData && questionData.subQuestions && questionData.subQuestions.length > 0;
  };

  // Get the current sub-question index
  const [currentSubQuestionIndex, setCurrentSubQuestionIndex] = useState(0);

  // Reset sub-question index when moving to a new question
  useEffect(() => {
    setCurrentSubQuestionIndex(0);
  }, [quizState.currentQuestionIndex]);

  // Handle next sub-question
  const handleNextSubQuestion = (questionId: string) => {
    // Evitar processamento se estiver em transição
    if (isTransitioning) return;
    
    if (selectedOptions[questionId] && selectedOptions[questionId].length > 0) {
      // Indicar que está em transição para evitar cliques múltiplos
      setIsTransitioning(true);
      
      // Record the answer
      const answer = selectedOptions[questionId].join(', ');
      recordAnswer(questionId, answer);
      
      // Clear selection for this question
      setSelectedOptions(prev => ({
        ...prev,
        [questionId]: []
      }));
      
      // Move to next sub-question or next main question
      const subQuestions = currentQuestion.subQuestions;
      if (subQuestions && currentSubQuestionIndex < subQuestions.length - 1) {
        setCurrentSubQuestionIndex(prev => prev + 1);
        // Resetar estado de transição após um breve momento
        setTimeout(() => setIsTransitioning(false), 300);
      } else {
        nextQuestion();
        setIsTransitioning(false);
      }
    }
  };

  // Render the current question based on its type
  const renderQuestion = () => {
    // Show loading state
    if (quizState.isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <LoadingSpinner />
          <p className="text-center mt-4">Carregando quiz...</p>
        </div>
      );
    }

    // Show error state
    if (quizState.error) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <ErrorMessage message={quizState.error} />
          <p className="text-center mt-4">
            Tente novamente mais tarde ou entre em contato com o suporte.
          </p>
          <Button 
            className="mt-6 w-full py-3"
            onClick={() => window.location.href = '/'}
          >
            Voltar para a página inicial
          </Button>
        </div>
      );
    }

    // Adicionar animações suaves
    const transitionClass = "animate-fadeIn";

    return (
      <div className={`w-full max-w-md mx-auto ${transitionClass}`}>
        {/* Opening screen */}
        {currentQuestion.id === 'opening' && (
          <div className="flex flex-col items-center text-center p-4">
            <h2 className="text-2xl font-bold mb-4">{currentQuestion.title}</h2>
            <p className="text-gray-600 mb-8">{currentQuestion.subtitle}</p>
            <NextButton 
              onClick={handleNext}
              className="py-4 text-lg font-semibold"
            >
              Começar
            </NextButton>
          </div>
        )}

        {/* Pergunta padrão com uma única opção de resposta */}
        {(currentQuestion.question && !currentQuestion.multiSelect && currentQuestion.options) && (
          <div className="flex flex-col items-center p-4 animate-slideIn">
            <h2 className="text-xl font-semibold mb-6 text-center">
              {currentQuestion.question}
            </h2>
            
            <div className="w-full space-y-3">
              {currentQuestion.options?.map((option: string) => {
                const questionId = currentQuestion.id;
                const isSelected = selectedOptions[questionId]?.includes(option);
                
                return (
                  <button
                    key={option}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => handleOptionSelect(questionId, option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            
            {/* Botão de avançar */}
            <div className="mt-6 w-full">
              <NextButton 
                onClick={() => handleAnswer(currentQuestion.id)}
                disabled={!selectedOptions[currentQuestion.id]?.length}
              />
            </div>
          </div>
        )}
        
        {/* Pergunta com múltipla escolha */}
        {(currentQuestion.question && currentQuestion.multiSelect && currentQuestion.options) && (
          <div className="flex flex-col items-center p-4 animate-slideIn">
            <h2 className="text-xl font-semibold mb-6 text-center">
              {currentQuestion.question}
            </h2>
            
            <div className="w-full space-y-3">
              {currentQuestion.options?.map((option: string, index: number) => {
                const questionId = currentQuestion.id;
                const isSelected = selectedOptions[questionId]?.includes(option);
                
                return (
                  <button
                    key={option}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => handleOptionSelect(
                      questionId, 
                      option, 
                      true, 
                      currentQuestion.maxSelections
                    )}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 mr-3 rounded border flex items-center justify-center transition-all duration-300 ${
                        isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                      }`}>
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white animate-fadeIn" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {option}
                    </div>
                  </button>
                );
              })}
              
              <div className="mt-6">
                <NextButton 
                  onClick={() => handleAnswer(currentQuestion.id)}
                  disabled={!selectedOptions[currentQuestion.id]?.length}
                />
              </div>
              
              {currentQuestion.maxSelections && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Selecione até {currentQuestion.maxSelections} opções
                </p>
              )}
            </div>
          </div>
        )}

        {/* Social proof screen */}
        {currentQuestion.id === 'socialProof' && (
          <div className="flex flex-col items-center text-center p-4 animate-fadeIn">
            <p className="text-lg mb-4 font-medium">{currentQuestion.text}</p>
            <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-indigo-100 mb-6 rounded-lg flex items-center justify-center shadow-md">
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mb-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <p className="text-gray-700">Prova Social</p>
              </div>
            </div>
            <NextButton 
              onClick={handleNext}
            />
          </div>
        )}

        {/* Esta seção foi substituída pelas perguntas padrão desagrupadas acima */}

        {/* Testimonials screen */}
        {currentQuestion.id === 'testimonials' && (
          <div className="flex flex-col items-center text-center p-4 animate-fadeIn">
            <p className="text-lg mb-4 font-medium">{currentQuestion.text}</p>
            <div className="w-full bg-gradient-to-r from-indigo-100 to-purple-100 mb-6 rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm animate-slideIn" style={{animationDelay: '0.1s'}}>
                  <p className="italic text-gray-600">"Este método transformou a maneira como meu filho estuda. Ele está muito mais engajado e aprende muito mais rápido!"</p>
                  <p className="text-right text-sm font-medium text-gray-800 mt-2">— Maria S., mãe de Pedro (8 anos)</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm animate-slideIn" style={{animationDelay: '0.3s'}}>
                  <p className="italic text-gray-600">"Minha filha tinha dificuldade com matemática. Com essa abordagem, ela superou seus bloqueios e agora adora resolver problemas!"</p>
                  <p className="text-right text-sm font-medium text-gray-800 mt-2">— Carlos M., pai de Ana (9 anos)</p>
                </div>
              </div>
            </div>
            <NextButton 
              onClick={handleNext}
            />
          </div>
        )}

        {/* Esta seção foi substituída pelas perguntas padrão desagrupadas acima */}

        {/* Esta seção foi substituída pelas perguntas padrão desagrupadas acima */}

        {/* Loading screen - Adicionamos um formulário para captura de leads */}
        {currentQuestion.id === 'loading' && (
          <div className="flex flex-col items-center text-center p-4">
            <h2 className="text-xl font-semibold mb-6">Quase lá! Preencha seus dados para ver os resultados</h2>
            
            <div className="w-full max-w-md mb-6 p-6 bg-white rounded-lg shadow-md">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite seu nome"
                  value={leadData.name}
                  onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                  value={leadData.email}
                  onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(00) 00000-0000"
                  value={leadData.phone}
                  onChange={(e) => {
                    // Implementar máscara para telefone
                    const value = e.target.value;
                    // Remove todos os caracteres não numéricos
                    const numbersOnly = value.replace(/\D/g, '');
                    
                    // Aplica a formatação conforme quantidade de dígitos
                    let formattedValue = '';
                    if (numbersOnly.length <= 2) {
                      formattedValue = numbersOnly.replace(/^(\d{0,2})/, '($1');
                    } else if (numbersOnly.length <= 7) {
                      formattedValue = numbersOnly.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                    } else {
                      formattedValue = numbersOnly.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                    }
                    
                    // Limita a 11 dígitos (DDD + 9 dígitos)
                    if (numbersOnly.length > 11) {
                      return;
                    }
                    
                    setLeadData(prev => ({ ...prev, phone: formattedValue }));
                  }}
                />
              </div>
              
              <div className="mb-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 mr-2"
                    checked={leadData.acceptedTerms}
                    onChange={(e) => setLeadData(prev => ({ ...prev, acceptedTerms: e.target.checked }))}
                    required
                  />
                  <span className="text-xs text-gray-600 text-left">
                    Concordo em receber comunicações e aceito os termos de uso e política de privacidade.
                  </span>
                </label>
              </div>
              
              <Button 
                className="w-full py-3" 
                onClick={async (e) => {
                  e.preventDefault(); // Prevenir comportamento padrão
                  
                  // Validar formulário
                  if (!leadData.name || !leadData.email || !leadData.acceptedTerms) {
                    alert('Por favor, preencha todos os campos obrigatórios');
                    return;
                  }
                  
                  try {
                    // Mostrar loader enquanto salva os dados
                    const button = e.currentTarget as HTMLButtonElement;
                    button.innerText = "Processando...";
                    button.disabled = true;

                    // Salvar dados do lead localmente
                    recordAnswer('lead_name', leadData.name);
                    recordAnswer('lead_email', leadData.email);
                    recordAnswer('lead_phone', leadData.phone || '');
                    
                    // Extrair apenas os números do telefone para salvar no banco
                    const phoneNumbersOnly = leadData.phone.replace(/\D/g, '');
                    
                    // Salvar dados na API de leads
                    if (quizState.sessionId) {
                      // Log dos dados que estão sendo enviados
                      console.log('Enviando dados do lead:', {
                        name: leadData.name,
                        email: leadData.email,
                        phone: phoneNumbersOnly,
                        quiz_id: slug,
                        session_id: quizState.sessionId,
                      });
                      
                      const response = await fetch('/api/leads', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          name: leadData.name,
                          email: leadData.email,
                          phone: phoneNumbersOnly,
                          quiz_id: slug,
                          session_id: quizState.sessionId,
                          additional_data: {
                            answers: quizState.answers || {}
                          }
                        }),
                      });
                      
                      const responseData = await response.json();
                      
                      if (!response.ok) {
                        console.error('Erro ao salvar dados do lead:', responseData.error);
                        const button = e.currentTarget as HTMLButtonElement;
                        button.innerText = "Ver Meus Resultados";
                        button.disabled = false;
                        alert('Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.');
                        return;
                      }
                      
                      console.log('Lead salvo com sucesso:', responseData);
                    }
                    
                    // Avançar para os resultados
                    handleNext();
                  } catch (error) {
                    console.error('Erro ao processar lead:', error);
                    alert('Ocorreu um erro ao processar seus dados. Por favor, tente novamente.');
                  }
                }}
              >
                Ver Meus Resultados
              </Button>
            </div>
            
            {/* Removemos o loading spinner que causava redirecionamento prematuro */}
          </div>
        )}

        {/* Solution screen */}
        {currentQuestion.id === 'solution' && (
          <div className="flex flex-col items-center text-center p-4 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">{currentQuestion.title}</h2>
            <p className="text-lg mb-6">{currentQuestion.text}</p>
            
            <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-indigo-500 mb-6 rounded-lg flex items-center justify-center text-white">
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">Resultados Personalizados</p>
              </div>
            </div>
            
            <div className="w-full bg-blue-50 p-6 rounded-lg mb-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">O que você recebe?</h3>
              <ul className="space-y-3 text-left">
                {currentQuestion.benefits?.map((benefit: string, index: number) => (
                  <li key={benefit} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="w-full bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg mb-6 border-l-4 border-yellow-400">
              <p className="text-lg font-medium text-yellow-800">{currentQuestion.price}</p>
            </div>
            
            <Button 
              className="w-full py-4 text-lg font-semibold mb-4 shadow-md"
              onClick={() => window.location.href = '/checkout'}
            >
              {currentQuestion.cta}
            </Button>
            
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Pagamento 100% seguro</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 px-4">
      {/* Progress bar */}
      {quizState.currentQuestionIndex > 0 && quizState.currentQuestionIndex < quizState.totalQuestions - 1 && (
        <ProgressBar 
          current={quizState.currentQuestionIndex} 
          total={quizState.totalQuestions} 
        />
      )}
      
      {/* Main content */}
      {renderQuestion()}
      
      {/* Não mostrar botões de navegação - agora controlados diretamente em cada pergunta */}
    </div>
  );
};

export default QuizMain;