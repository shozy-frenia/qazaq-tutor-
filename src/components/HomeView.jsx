import { useStore } from '../store/useStore.js';
import { getAllSubjects } from '../data/subjects.js';
import { FileText, Clock, Zap } from 'lucide-react';

export default function HomeView() {
  const { language, startNewSubject, setCurrentView } = useStore();
  const subjects = getAllSubjects();
  
  const t = (ru, kz) => language === 'kz' ? kz : ru;
  
  const handleSubjectClick = (subjectId) => {
    startNewSubject(subjectId);
    setCurrentView('tutor');
  };
  
  const stats = [
    { value: '50 000+', label: t('Заданий в базе', 'Базадағы тапсырмалар'), icon: FileText },
    { value: '12', label: t('Предметов', 'Пәндер'), icon: Zap },
    { value: '94%', label: t('Точность ИИ', 'ЖИ дәлдігі'), icon: Zap },
  ];
  
  return (
    <div className="animate-fade-in">
      <section className="text-center py-10 pb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          {t('Подготовка к ЕНТ с', 'ЕНТ-ге дайындалу')}{' '}
          <span className="gradient-text">
            {t('искусственным интеллектом', 'жасанды интеллектпен')}
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
          {t(
            'Персональный AI-репетитор, который адаптируется под ваш уровень, объясняет ошибки и помогает набрать максимальный балл',
            'Сіздің деңгейіңізге бейімделетін, қателерді түсіндіретін және максималды балл жинауға көмектесетін жеке AI-репетитор'
          )}
        </p>
        
        <div className="flex justify-center gap-10 md:gap-14 flex-wrap">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center">
                <div className="text-3xl font-extrabold text-kz-blue mb-1">{stat.value}</div>
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Icon size={14} />
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2.5">
          <span className="text-2xl">📚</span>
          {t('Выберите предмет для подготовки', 'Дайындалу пәнін таңдаңыз')}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => handleSubjectClick(subject.id)}
              className="bg-dark-card border border-dark-border rounded-2xl p-6 cursor-pointer card-hover relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-kz-blue to-kz-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: subject.iconBg }}
              >
                {subject.icon}
              </div>
              
              <h3 className="text-lg font-semibold mb-2">
                {language === 'kz' ? subject.nameKz : subject.name}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                {language === 'kz' ? subject.descriptionKz : subject.description}
              </p>
              
              <div className="flex gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <FileText size={13} />
                  {subject.questionsCount.toLocaleString()} {t('заданий', 'тапсырма')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  {subject.timeMinutes} {t('мин', 'мин')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="mt-14 mb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2.5">
          <span className="text-2xl">✨</span>
          {t('Почему QazaqTutor?', 'Неліктен QazaqTutor?')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: t('Адаптивное обучение', 'Бейімделетін оқыту'),
              desc: t('ИИ анализирует ваши ошибки и подстраивает сложность заданий под ваш уровень', 
                      'ЖИ қателеріңізді талдайды және тапсырмаларды сіздің деңгейіңізге бейімдейді'),
            },
            {
              title: t('Разбор каждой ошибки', 'Әрбір қатені талдау'),
              desc: t('Подробные объяснения не просто «правильно/неправильно», а с теорией и примерами',
                      '"Дұрыс/дұрыс емес" емес, теория мен мысалдармен толық түсіндірме'),
            },
            {
              title: t('Доступно всем', 'Барлығына қолжетімді'),
              desc: t('Бесплатная подготовка к ЕНТ 24/7 из любой точки Казахстана',
                      'Қазақстанның кез келген жерінен тегін ЕНТ-ге дайындалу 24/7'),
            },
          ].map((feature, i) => (
            <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
