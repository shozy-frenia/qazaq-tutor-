import { useStore } from '../store/useStore.js';
import { getAllSubjects } from '../data/subjects.js';
import { Target, CheckCircle2, Flame, Award, TrendingUp } from 'lucide-react';

export default function ProgressView() {
  const { language, stats } = useStore();
  const subjects = getAllSubjects();
  
  const t = (ru, kz) => language === 'kz' ? kz : ru;
  
  const weekDays = language === 'kz' 
    ? ['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб', 'Жс']
    : ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  const maxProgress = Math.max(...stats.weeklyProgress);
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2.5">
        <span className="text-2xl">📊</span>
        {t('Ваш прогресс подготовки', 'Дайындық прогресіңіз')}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
            <Target size={14} />
            {t('Общий прогресс', 'Жалпы прогресс')}
          </h3>
          <div className="h-2 bg-dark-bg rounded-full overflow-hidden mb-3">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-kz-blue to-kz-gold transition-all duration-500"
              style={{ width: `${(stats.totalTopicsCompleted / stats.totalTopics) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>{Math.round((stats.totalTopicsCompleted / stats.totalTopics) * 100)}% {t('завершено', 'аяқталды')}</span>
            <span>{stats.totalTopicsCompleted}/{stats.totalTopics} {t('тем', 'тақырып')}</span>
          </div>
        </div>
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
            <CheckCircle2 size={14} />
            {t('Правильных ответов', 'Дұрыс жауаптар')}
          </h3>
          <div className="h-2 bg-dark-bg rounded-full overflow-hidden mb-3">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-kz-blue to-kz-gold transition-all duration-500"
              style={{ width: `${(stats.correctAnswers / Math.max(stats.totalAnswered, 1)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>{stats.totalAnswered > 0 ? Math.round((stats.correctAnswers / stats.totalAnswered) * 100) : 0}% {t('точность', 'дәлдік')}</span>
            <span>{stats.correctAnswers}/{stats.totalAnswered} {t('заданий', 'тапсырма')}</span>
          </div>
        </div>
        
        <div className
