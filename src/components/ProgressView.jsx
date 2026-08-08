import { useStore } from '../store/useStore.js';

export default function ProgressView() {
  const { language, stats } = useStore();
  const t = (ru, kz) => language === 'kz' ? kz : ru;
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold mb-6">📊 {t('Ваш прогресс', 'Сіздің прогресіңіз')}</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-2">{t('Прогресс', 'Прогресс')}</div>
          <div className="text-3xl font-extrabold text-kz-blue">{Math.round((stats.totalTopicsCompleted / stats.totalTopics) * 100)}%</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-2">{t('Точность', 'Дәлдік')}</div>
          <div className="text-3xl font-extrabold text-kz-blue">{stats.totalAnswered > 0 ? Math.round((stats.correctAnswers / stats.totalAnswered) * 100) : 0}%</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-2">{t('Streak', 'Streak')}</div>
          <div className="text-3xl font-extrabold text-kz-gold">{stats.streak} 🔥</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="text-sm text-slate-400 mb-2">{t('Балл', 'Балл')}</div>
          <div className="text-3xl font-extrabold text-kz-blue">{stats.averageScore}</div>
        </div>
      </div>
      
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <h3 className="font-bold mb-4">{t('Недельная динамика', 'Апталық динамика')}</h3>
        <div className="flex items-end gap-3 h-40">
          {stats.weeklyProgress.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs text-kz-blue font-bold">{v}</div>
              <div className="w-full bg-gradient-to-t from-kz-blue to-kz-gold rounded-t-md" style={{ height: `${v}px` }} />
              <div className="text-xs text-slate-400">{['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
