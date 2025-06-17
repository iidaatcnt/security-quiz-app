import { Question } from '../data/types';

/**
 * 配列からランダムに指定した数の要素を選択する
 * @param array 元の配列
 * @param count 選択する要素数
 * @returns ランダムに選択された要素の配列
 */
export function getRandomQuestions(array: Question[], count: number): Question[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * カテゴリ別に問題を分類する
 * @param questions 問題の配列
 * @returns カテゴリ別に分類された問題のオブジェクト
 */
export function groupQuestionsByCategory(questions: Question[]): Record<string, Question[]> {
  return questions.reduce((groups, question) => {
    const category = question.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(question);
    return groups;
  }, {} as Record<string, Question[]>);
}

/**
 * スコアに基づいてパフォーマンスレベルを取得する
 * @param score 獲得スコア
 * @param total 合計問題数
 * @returns パフォーマンスレベル
 */
export function getPerformanceLevel(score: number, total: number): {
  level: string;
  message: string;
  color: string;
} {
  const percentage = (score / total) * 100;
  
  if (percentage >= 90) {
    return {
      level: "エキスパート",
      message: "素晴らしい！セキュリティエキスパートレベルです。",
      color: "text-green-600"
    };
  } else if (percentage >= 80) {
    return {
      level: "上級者",
      message: "非常に良い結果です。セキュリティ意識が高いですね。",
      color: "text-blue-600"
    };
  } else if (percentage >= 70) {
    return {
      level: "中級者",
      message: "良い結果です。基本的なセキュリティ知識を持っています。",
      color: "text-yellow-600"
    };
  } else if (percentage >= 60) {
    return {
      level: "初級者",
      message: "基礎はできています。さらなる学習で向上できます。",
      color: "text-orange-600"
    };
  } else {
    return {
      level: "要復習",
      message: "セキュリティの基礎を復習することをお勧めします。",
      color: "text-red-600"
    };
  }
}

/**
 * 配列をシャッフルする（Fisher-Yatesアルゴリズム）
 * @param array シャッフルする配列
 * @returns シャッフルされた新しい配列
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
