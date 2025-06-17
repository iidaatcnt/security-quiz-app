'use client';

import React, { useState } from 'react';
import { Question, QuizState } from '../data/types';
import { getRandomQuestions } from '../lib/utils';
import questionsData from '../data/questions.json';

const QuizComponent: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    quizQuestions: [],
    wrongQuestions: [],
    answered: false,
    selectedAnswer: null,
    showFeedback: false,
    gamePhase: 'start'
  });

  const questions: Question[] = questionsData as Question[];

  const startQuiz = () => {
    const randomQuestions = getRandomQuestions(questions, 10);
    setQuizState({
      ...quizState,
      quizQuestions: randomQuestions,
      currentQuestionIndex: 0,
      score: 0,
      wrongQuestions: [],
      gamePhase: 'playing'
    });
  };

  const handleAnswer = (selectedOption: 'A' | 'B') => {
    if (quizState.answered) return;

    const currentQuestion = quizState.quizQuestions[quizState.currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    let newScore = quizState.score;
    const newWrongQuestions = [...quizState.wrongQuestions];

    if (isCorrect) {
      newScore += 1;
    } else {
      newWrongQuestions.push(currentQuestion);
    }

    setQuizState({
      ...quizState,
      selectedAnswer: selectedOption,
      answered: true,
      showFeedback: true,
      score: newScore,
      wrongQuestions: newWrongQuestions
    });
  };

  const nextQuestion = () => {
    const nextIndex = quizState.currentQuestionIndex + 1;
    
    if (nextIndex < quizState.quizQuestions.length) {
      setQuizState({
        ...quizState,
        currentQuestionIndex: nextIndex,
        answered: false,
        selectedAnswer: null,
        showFeedback: false
      });
    } else {
      setQuizState({
        ...quizState,
        gamePhase: 'results'
      });
    }
  };

  const restartQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      quizQuestions: [],
      wrongQuestions: [],
      answered: false,
      selectedAnswer: null,
      showFeedback: false,
      gamePhase: 'start'
    });
  };

  const renderStartScreen = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          セキュリティ知識を確認しましょう
        </h2>
        <div className="text-gray-600 space-y-3 text-sm sm:text-base leading-relaxed">
          <p>このクイズは、ITセキュリティに関する知識を確認するものです。</p>
          <p>全10問のクイズで、それぞれ2つの選択肢から正しいものを選んでください。</p>
          <p>各問題に回答するとすぐに正誤判定と解説が表示され、最後に間違えた問題のまとめが表示されます。</p>
        </div>
      </div>
      <button
        onClick={startQuiz}
        className="w-full max-w-xs mx-auto bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-md hover:shadow-lg"
      >
        スタート
      </button>
    </div>
  );

  const renderQuestion = () => {
    if (quizState.quizQuestions.length === 0) return null;
    
    const currentQuestion = quizState.quizQuestions[quizState.currentQuestionIndex];
    const progress = ((quizState.currentQuestionIndex + 1) / quizState.quizQuestions.length) * 100;

    return (
      <div className="space-y-6">
        {/* プログレスバー */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* スコア表示 */}
        <div className="text-center bg-gray-50 py-3 rounded-lg">
          <span className="text-lg sm:text-xl font-semibold text-gray-700">
            スコア: <span className="text-blue-600">{quizState.score}</span> / {quizState.quizQuestions.length}
          </span>
        </div>

        {/* 問題カード */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold">
              問題 {quizState.currentQuestionIndex + 1}/{quizState.quizQuestions.length}
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 space-y-6">
            <p className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium">
              {currentQuestion.question}
            </p>

            {/* 選択肢 */}
            <div className="space-y-3">
              <button
                onClick={() => handleAnswer('A')}
                disabled={quizState.answered}
                className={`w-full p-4 sm:p-5 text-left border-2 rounded-xl transition-all duration-200 font-medium text-sm sm:text-base ${
                  quizState.selectedAnswer === 'A'
                    ? currentQuestion.correctAnswer === 'A'
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-red-500 bg-red-50 text-red-800'
                    : quizState.answered && currentQuestion.correctAnswer === 'A'
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 bg-white text-gray-700'
                } ${quizState.answered ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
              >
                <span className="font-bold text-blue-600 mr-3">A:</span>
                {currentQuestion.optionA}
              </button>

              <button
                onClick={() => handleAnswer('B')}
                disabled={quizState.answered}
                className={`w-full p-4 sm:p-5 text-left border-2 rounded-xl transition-all duration-200 font-medium text-sm sm:text-base ${
                  quizState.selectedAnswer === 'B'
                    ? currentQuestion.correctAnswer === 'B'
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-red-500 bg-red-50 text-red-800'
                    : quizState.answered && currentQuestion.correctAnswer === 'B'
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 bg-white text-gray-700'
                } ${quizState.answered ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
              >
                <span className="font-bold text-blue-600 mr-3">B:</span>
                {currentQuestion.optionB}
              </button>
            </div>

            {/* フィードバック */}
            {quizState.showFeedback && (
              <div className={`p-4 sm:p-5 rounded-xl border-l-4 ${
                quizState.selectedAnswer === currentQuestion.correctAnswer
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}>
                <p className={`font-bold text-lg mb-3 ${
                  quizState.selectedAnswer === currentQuestion.correctAnswer
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}>
                  {quizState.selectedAnswer === currentQuestion.correctAnswer ? '✅ 正解！' : '❌ 不正解！'}
                </p>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 次の問題ボタン */}
        {quizState.showFeedback && (
          <button
            onClick={nextQuestion}
            className="w-full max-w-xs mx-auto block bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-lg font-medium text-lg transition-colors shadow-md hover:shadow-lg"
          >
            {quizState.currentQuestionIndex < quizState.quizQuestions.length - 1 ? '次の問題' : '結果を見る'}
          </button>
        )}
      </div>
    );
  };

  const renderResults = () => (
    <div className="space-y-6">
      <div className="text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">クイズ結果</h2>
        <div className="text-xl sm:text-2xl">
          あなたのスコア: <span className="font-bold text-yellow-300">{quizState.score}</span> / {quizState.quizQuestions.length}
        </div>
        <div className="mt-2 text-blue-100">
          正答率: {Math.round((quizState.score / quizState.quizQuestions.length) * 100)}%
        </div>
      </div>

      {/* 間違えた問題 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">間違えた問題の復習</h3>
        </div>
        
        <div className="p-4 sm:p-6">
          {quizState.wrongQuestions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-green-600 font-bold text-xl mb-2">
                すべての問題に正解しました！
              </p>
              <p className="text-gray-600">
                おめでとうございます！
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {quizState.wrongQuestions.map((question, index) => (
                <div key={question.id} className="bg-red-50 border border-red-200 p-4 sm:p-5 rounded-xl">
                  <p className="font-bold mb-3 text-gray-800 text-sm sm:text-base">
                    問題 {index + 1}: {question.question}
                  </p>
                  <div className="space-y-2 text-sm sm:text-base">
                    <p className="text-red-700">
                      <span className="font-medium">❌ あなたの回答:</span> {question.correctAnswer === 'A' ? 'B' : 'A'} ({question.correctAnswer === 'A' ? question.optionB : question.optionA})
                    </p>
                    <p className="text-green-700">
                      <span className="font-medium">✅ 正解:</span> {question.correctAnswer} ({question.correctAnswer === 'A' ? question.optionA : question.optionB})
                    </p>
                    <p className="text-gray-700 mt-3 leading-relaxed">
                      <span className="font-medium">💡 解説:</span> {question.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={restartQuiz}
        className="w-full max-w-xs mx-auto block bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-lg font-medium text-lg transition-colors shadow-md hover:shadow-lg"
      >
        もう一度挑戦する
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 sm:p-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold">セキュリティクイズ</h1>
          </div>
          
          <div className="p-6 sm:p-8 lg:p-12">
            {quizState.gamePhase === 'start' && renderStartScreen()}
            {quizState.gamePhase === 'playing' && renderQuestion()}
            {quizState.gamePhase === 'results' && renderResults()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;