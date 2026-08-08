
export const subjects = {
  math: {
    id: 'math',
    name: 'Математика',
    nameKz: 'Математика',
    icon: '📐',
    iconBg: 'rgba(0,175,202,0.15)',
    description: 'Алгебра, геометрия, тригонометрия и математический анализ',
    descriptionKz: 'Алгебра, геометрия, тригонометрия және математикалық талдау',
    questionsCount: 8420,
    timeMinutes: 45,
    topics: [
      { id: 'quadratic', name: 'Квадратные уравнения', nameKz: 'Квадраттық теңдеулер', progress: 0, difficulties: ['easy', 'medium', 'hard'] },
      { id: 'trigonometry', name: 'Тригонометрия', nameKz: 'Тригонометрия', progress: 0, difficulties: ['easy', 'medium', 'hard'] },
      { id: 'derivative', name: 'Производная', nameKz: 'Туынды', progress: 0, difficulties: ['medium', 'hard'] },
      { id: 'integrals', name: 'Интегралы', nameKz: 'Интегралдар', progress: 0, difficulties: ['medium', 'hard'] },
      { id: 'vectors', name: 'Векторы', nameKz: 'Векторлар', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'stereometry', name: 'Стереометрия', nameKz: 'Стереометрия', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'probability', name: 'Вероятность', nameKz: 'Ықтималдық', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'progressions', name: 'Прогрессии', nameKz: 'Прогрессиялар', progress: 0, difficulties: ['easy', 'medium', 'hard'] },
    ],
  },
  physics: {
    id: 'physics',
    name: 'Физика',
    nameKz: 'Физика',
    icon: '⚛️',
    iconBg: 'rgba(254,203,0,0.15)',
    description: 'Механика, термодинамика, электричество и оптика',
    descriptionKz: 'Механика, термодинамика, электр және оптика',
    questionsCount: 6150,
    timeMinutes: 40,
    topics: [
      { id: 'kinematics', name: 'Кинематика', nameKz: 'Кинематика', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'dynamics', name: 'Динамика', nameKz: 'Динамика', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'conservation', name: 'Законы сохранения', nameKz: 'Сақталу заңдары', progress: 0, difficulties: ['medium', 'hard'] },
      { id: 'electricity', name: 'Электричество', nameKz: 'Электр', progress: 0, difficulties: ['medium', 'hard'] },
      { id: 'magnetism', name: 'Магнетизм', nameKz: 'Магнетизм', progress: 0, difficulties: ['hard'] },
      { id: 'optics', name: 'Оптика', nameKz: 'Оптика', progress: 0, difficulties: ['easy', 'medium'] },
    ],
  },
  chemistry: {
    id: 'chemistry',
    name: 'Химия',
    nameKz: 'Химия',
    icon: '🧪',
    iconBg: 'rgba(34,197,94,0.15)',
    description: 'Неорганическая, органическая химия и химические реакции',
    descriptionKz: 'Бейорганикалық, органикалық химия және химиялық реакциялар',
    questionsCount: 5800,
    timeMinutes: 35,
    topics: [
      { id: 'periodic', name: 'Периодический закон', nameKz: 'Периодтық заң', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'bonds', name: 'Химические связи', nameKz: 'Химиялық байланыстар', progress: 0, difficulties: ['medium', 'hard'] },
      { id: 'oxidation', name: 'Реакции окисления', nameKz: 'Тотығу реакциялары', progress: 0, difficulties: ['medium', 'hard'] },
      { id: 'organic', name: 'Органическая химия', nameKz: 'Органикалық химия', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'solutions', name: 'Растворы', nameKz: 'Ерітінділер', progress: 0, difficulties: ['easy', 'medium'] },
    ],
  },
  history: {
    id: 'history',
    name: 'История Казахстана',
    nameKz: 'Қазақстан тарихы',
    icon: '📜',
    iconBg: 'rgba(239,68,68,0.15)',
    description: 'От древности до современности: ключевые события и даты',
    descriptionKz: 'Ежелгі заманнан қазіргі заманға дейін: маңызды оқиғалар мен күндер',
    questionsCount: 4200,
    timeMinutes: 30,
    topics: [
      { id: 'ancient', name: 'Древний Казахстан', nameKz: 'Ежелгі Қазақстан', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'golden-horde', name: 'Золотая Орда', nameKz: 'Алтын Орда', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'khanate', name: 'Казахское ханство', nameKz: 'Қазақ хандығы', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'russia', name: 'Присоединение к России', nameKz: 'Ресейге қосылу', progress: 0, difficulties: ['medium', 'hard'] },
      { id: 'xx-century', name: 'XX век', nameKz: 'XX ғасыр', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'modern', name: 'Современность', nameKz: 'Қазіргі заман', progress: 0, difficulties: ['easy', 'medium'] },
    ],
  },
  biology: {
    id: 'biology',
    name: 'Биология',
    nameKz: 'Биология',
    icon: '🧬',
    iconBg: 'rgba(168,85,247,0.15)',
    description: 'Анатомия, генетика, экология и эволюция',
    descriptionKz: 'Анатомия, генетика, экология және эволюция',
    questionsCount: 5100,
    timeMinutes: 35,
    topics: [
      { id: 'cell', name: 'Клетка', nameKz: 'Жасуша', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'genetics', name: 'Генетика', nameKz: 'Генетика', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'evolution', name: 'Эволюция', nameKz: 'Эволюция', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'ecology', name: 'Экология', nameKz: 'Экология', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'anatomy', name: 'Анатомия', nameKz: 'Анатомия', progress: 0, difficulties: ['medium', 'hard'] },
    ],
  },
  kazakh: {
    id: 'kazakh',
    name: 'Қазақ тілі',
    nameKz: 'Қазақ тілі',
    icon: '🇰🇿',
    iconBg: 'rgba(0,175,202,0.15)',
    description: 'Грамматика, лексика, орфография и пунктуация',
    descriptionKz: 'Грамматика, лексика, орфография және пунктуация',
    questionsCount: 7300,
    timeMinutes: 40,
    topics: [
      { id: 'phonetics', name: 'Фонетика', nameKz: 'Фонетика', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'morphology', name: 'Морфология', nameKz: 'Морфология', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'syntax', name: 'Синтаксис', nameKz: 'Синтаксис', progress: 0, difficulties: ['medium', 'hard'] },
      { id: 'lexicon', name: 'Лексика', nameKz: 'Лексика', progress: 0, difficulties: ['easy', 'medium'] },
      { id: 'orthography', name: 'Орфография', nameKz: 'Емле', progress: 0, difficulties: ['easy', 'medium'] },
    ],
  },
};

export const getSubjectById = (id) => subjects[id] || null;
export const getAllSubjects = () => Object.values(subjects);

// Фильтр тем по сложности
export const getTopicsByDifficulty = (subjectId, difficulty) => {
  const subject = subjects[subjectId];
  if (!subject) return [];
  return subject.topics.filter(t => t.difficulties.includes(difficulty));
};
