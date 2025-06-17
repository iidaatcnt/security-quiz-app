'use client';

import React, { useState, useEffect } from 'react';
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

  const questions: Question[] = questionsData;

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
    let newWrongQuestions = [...quizState.wrongQuestions];

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
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">セキュリティ知識を確認しましょう</h2>
      <div className="mb-6 text-gray-600 space-y-4">
        <p>このクイズは、ITセキュリティに関する知識を確認するものです。</p>
        <p>全10問のクイズで、それぞれ2つの選択肢から正しいものを選んでください。</p>
        <p>各問題に回答するとすぐに正誤判定と解説が表示され、最後に間違えた問題のまとめが表示されます。</p>
      </div>
      <button
        onClick={startQuiz}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
      <div>
        {/* プログレスバー */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* スコア表示 */}
        <div className="text-center mb-6">
          <span className="text-lg font-medium">
            スコア: {quizState.score} / {quizState.quizQuestions.length}
          </span>
        </div>

        {/* 問題カード */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            問題 {quizState.currentQuestionIndex + 1}/{quizState.quizQuestions.length}
          </h2>
          <p className="text-gray-700 mb-6">{currentQuestion.question}</p>

          {/* 選択肢 */}
          <div className="space-y-3">
            <button
              onClick={() => handleAnswer('A')}
              disabled={quizState.answered}
              className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                quizState.selectedAnswer === 'A'
                  ? currentQuestion.correctAnswer === 'A'
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : quizState.answered && currentQuestion.correctAnswer === 'A'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              } ${quizState.answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              A: {currentQuestion.optionA}
            </button>

            <button
              onClick={() => handleAnswer('B')}
              disabled={quizState.answered}
              className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                quizState.selectedAnswer === 'B'
                  ? currentQuestion.correctAnswer === 'B'
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : quizState.answered && currentQuestion.correctAnswer === 'B'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              } ${quizState.answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              B: {currentQuestion.optionB}
            </button>
          </div>

          {/* フィードバック */}
          {quizState.showFeedback && (
            <div className={`mt-6 p-4 rounded-lg ${
              quizState.selectedAnswer === currentQuestion.correctAnswer
                ? 'bg-green-100 border-l-4 border-green-500'
                : 'bg-red-100 border-l-4 border-red-500'
            }`}>
              <p className="font-bold mb-2">
                {quizState.selectedAnswer === currentQuestion.correctAnswer ? '正解！' : '不正解！'}
              </p>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        {/* 次の問題ボタン */}
        {quizState.showFeedback && (
          <button
            onClick={nextQuestion}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {quizState.currentQuestionIndex < quizState.quizQuestions.length - 1 ? '次の問題' : '結果を見る'}
          </button>
        )}
      </div>
    );
  };

  const renderResults = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">クイズ結果</h2>
      
      <div className="text-center mb-6">
        <p className="text-xl">
          あなたのスコア: <span className="font-bold text-blue-600">{quizState.score}</span> / {quizState.quizQuestions.length}
        </p>
      </div>

      {/* 間違えた問題 */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">間違えた問題:</h3>
        {quizState.wrongQuestions.length === 0 ? (
          <p className="text-green-600 font-medium text-center py-8">
            すべての問題に正解しました！おめでとうございます！
          </p>
        ) : (
          <div className="space-y-4">
            {quizState.wrongQuestions.map((question, index) => (
              <div key={question.id} className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-bold mb-2">問題 {index + 1}: {question.question}</p>
                <p className="mb-1">
                  <span className="font-medium">あなたの回答:</span> {question.correctAnswer === 'A' ? 'B' : 'A'} ({question.correctAnswer === 'A' ? question.optionB : question.optionA})
                </p>
                <p className="mb-2">
                  <span className="font-medium">正解:</span> {question.correctAnswer} ({question.correctAnswer === 'A' ? question.optionA : question.optionB})
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">解説:</span> {question.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={restartQuiz}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        もう一度挑戦する
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">セキュリティクイズ</h1>
        
        {quizState.gamePhase === 'start' && renderStartScreen()}
        {quizState.gamePhase === 'playing' && renderQuestion()}
        {quizState.gamePhase === 'results' && renderResults()}
      </div>
    </div>
  );
};

export default QuizComponent;