export interface Question {
  id: number;
  category: string;
  question: string;
  optionA: string;
  optionB: string;
  correctAnswer: 'A' | 'B';
  explanation: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  quizQuestions: Question[];
  wrongQuestions: Question[];
  answered: boolean;
  selectedAnswer: 'A' | 'B' | null;
  showFeedback: boolean;
  gamePhase: 'start' | 'playing' | 'results';
}