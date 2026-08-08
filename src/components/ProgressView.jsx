import { useStore } from '../store/useStore.js';
import { getAllSubjects } from '../data/subjects.js';
import { Target, CheckCircle2, Flame, Award, TrendingUp, BookOpen } from 'lucide-react';

export default function ProgressView() {
  const { language, stats } = useStore();
  const subjects = getAllSubjects();
  
  const t = (ru, kz) => language === 'kz' ? kz : ru;
  
  const weekDays = language === 'kz' 
    ? ['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб', 'Жс']
    : ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  const maxProgress = Math.max(...stats.weeklyProgress, 1);
  
  const accuracy = stats.totalAnswered > 0 
    ? Math.round((stats.correctAnswers / stats.totalAnswered) * 100) 
    : 0;
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2.5">
        <span className="text-2xl">📊</span>
        {t('Ваш прогресс', 'Сіздің прогресіңіз')}
      </h2>
      
      {/* Общая статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <BookOpen size={14} />
            {t('Решено заданий', 'Шешілген тапсырмалар')}
          </div>
          <div className="text-3xl font-extrabold text-kz-blue">{stats.totalAnswered}</div>
        </div>
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <CheckCircle2 size={14} />
            {t('Правильных', 'Дұрыстары')}
          </div>
