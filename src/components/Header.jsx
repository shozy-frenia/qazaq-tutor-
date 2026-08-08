import { useStore } from '../store/useStore.js';
import { BookOpen, Brain, BarChart3 } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Главная', labelKz: 'Басты бет', icon: BookOpen },
  { id: 'tutor', label: 'AI-Репетитор', labelKz: 'AI-Репетитор', icon: Brain },
  { id: 'progress', label: 'Прогресс', labelKz: 'Прогресс', icon: BarChart3 },
];

export default function Header() {
  const { currentView, setCurrentView, language, setLanguage } = useStore();
  
  const t = (ru, kz) => language === 'kz' ? kz : ru;
  
  return (
    <header className="flex items-center justify-between py-5 border-b border-dark-border mb-8">
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setCurrentView('home')}
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-kz-blue to-kz-gold flex items-center justify-center text-xl">
          🇰🇿
        </div>
        <div className="text-2xl font-extrabold">
          Qazaq<span className="text-kz-blue">Tutor</span>
        </div>
      </div>
      
      <nav className="hidden md:flex items-center gap-1 bg-dark-card p-1.5 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-kz-blue text-white' 
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              <Icon size={16} />
              {t(tab.label, tab.labelKz)}
            </button>
          );
        })}
      </nav>
      
      <div className="flex items-center gap-1 bg-dark-card p-1 rounded-lg">
        <button
          onClick={() => setLanguage('kz')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            language === 'kz' ? 'bg-dark-border text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Қазақ
        </button>
        <button
          onClick={() => setLanguage('ru')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            language === 'ru' ? 'bg-dark-border text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Рус
        </button>
      </div>
    </header>
  );
}
