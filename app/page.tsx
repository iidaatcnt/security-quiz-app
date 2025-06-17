import QuizComponent from '../components/QuizComponent';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <QuizComponent />
    </main>
  );
}

export const metadata = {
  title: 'セキュリティクイズアプリ',
  description: 'ITセキュリティの知識を楽しくクイズ形式で学習できるアプリケーションです。',
};