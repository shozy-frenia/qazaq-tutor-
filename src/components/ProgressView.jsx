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
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <Flame size={14} className="text-orange-400" />
            {t('Дней подряд', 'Кезек күндер')}
          </h3>
          <div className="text-4xl font-extrabold text-kz-gold mb-1">
            {stats.streak} 🔥
          </div>
          <div className="text-xs text-slate-400">
            {t('Лучшая серия:', 'Ең жақсы серия:')} {stats.bestStreak} {t('дней', 'күн')}
          </div>
        </div>
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <Award size={14} />
            {t('Средний балл', 'Орташа балл')}
          </h3>
          <div className="text-4xl font-extrabold text-kz-blue mb-1">
            {stats.averageScore}
          </div>
          <div className="text-xs text-slate-400">
            {t('Из 140 возможных', '140 мүмкіндіктен')}
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <TrendingUp size={18} className="text-kz-blue" />
        {t('Прогресс по предметам', 'Пәндер бойынша прогресс')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {subjects.map((subject) => {
          const progress = stats.subjectProgress[subject.id] || 0;
          return (
            <div key={subject.id} className="bg-dark-card border border-dark-border rounded-2xl p-5 flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: subject.iconBg }}
              >
                {subject.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">
                    {language === 'kz' ? subject.nameKz : subject.name}
                  </span>
                  <span className="text-sm font-bold text-kz-blue">{progress}%</span>
                </div>
                <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-kz-blue to-kz-gold transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <TrendingUp size={18} className="text-kz-blue" />
        {t('Динамика результатов', 'Нәтижелер динамикасы')}
      </h3>
      
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <div className="flex items-end justify-center gap-4 h-52 px-4">
          {stats.weeklyProgress.map((value, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div className="relative w-full flex justify-center">
                <div 
                  className="w-10 bg-gradient-to-t from-kz-blue to-kz-gold rounded-t-lg transition-all duration-500 relative group"
                  style={{ height: `${(value / maxProgress) * 160}px` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-kz-blue opacity-0 group-hover:opacity-100 transition-opacity">
                    {value}
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">{weekDays[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
