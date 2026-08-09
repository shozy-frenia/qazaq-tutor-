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
  
  
  const getTotalSubjectAnswered = () => {
    return Object.values(stats.subjectStats).reduce((sum, s) => sum + s.answered, 0);
  };
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2.5">
        <span className="text-2xl">📊</span>
        {t('Ваш прогресс', 'Сіздің прогресіңіз')}
      </h2>
      
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
          <div className="text-3xl font-extrabold text-green-500">{accuracy}%</div>
        </div>
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Flame size={14} />
            {t('Серия дней', 'Күндер сериясы')}
          </div>
          <div className="text-3xl font-extrabold text-orange-500">{stats.streak}</div>
        </div>
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Award size={14} />
            {t('Завершено тем', 'Аяқталған тақырыптар')}
          </div>
          <div className="text-3xl font-extrabold text-purple-500">{stats.completedSubjects.length}</div>
        </div>
      </div>
      
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-kz-blue" />
          {t('Активность за неделю', 'Апталық белсенділік')}
        </h3>
        
        <div className="flex items-end justify-between gap-2 h-40">
          {stats.weeklyProgress.map((value, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <div 
                className="w-full bg-kz-blue/20 rounded-t-lg relative overflow-hidden"
                style={{ height: `${(value / maxProgress) * 100}%`, minHeight: value > 0 ? '8px' : '4px' }}
              >
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-kz-blue rounded-t-lg transition-all duration-500"
                  style={{ height: '100%' }}
                />
              </div>
              <span className="text-xs text-slate-400">{weekDays[index]}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Target size={18} className="text-kz-blue" />
          {t('Прогресс по предметам', 'Пәндер бойынша прогресс')}
        </h3>
        
        <div className="space-y-4">
          {subjects.map((subject) => {
            const subjectStats = stats.subjectStats[subject.id] || { answered: 0, correct: 0 };
            const totalAnsweredAll = getTotalSubjectAnswered();
            const subjectPercentage = totalAnsweredAll > 0 
              ? Math.round((subjectStats.answered / totalAnsweredAll) * 100) 
              : 0;
            
            const isCompleted = stats.completedSubjects.includes(subject.id);
            
            return (
              <div key={subject.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-dark-bg">
                  {subject.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{language === 'kz' ? subject.nameKz : subject.name}</span>
                    <span className="text-sm text-slate-400">
                      {subjectStats.answered} {t('заданий', 'тапсырма')} · {subjectPercentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-kz-blue'}`}
                      style={{ width: `${Math.min(subjectPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                {isCompleted && (
                  <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
