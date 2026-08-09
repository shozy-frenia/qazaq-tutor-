import { getRandomQuestion, questionsDB } from '../data/questions.js';

const API_URL = '/api/gemini';

export const generateGeminiQuestion = async (subjectName, topicName, language = 'ru') => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjectName, topicName, language }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Proxy API error:', errData);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Proxy fetch error:', error);
    return null;
  }
};

export const generateLocalQuestion = (subjectId, topicId, shownIds = []) => {
  let questions = questionsDB[subjectId] || [];
  if (topicId) {
    questions = questions.filter(q => q.topicId === topicId);
  }
  questions = questions.filter(q => !shownIds.includes(q.id));
  if (questions.length === 0) return null;
  return questions[Math.floor(Math.random() * questions.length)];
};

export const getQuestion = async (subjectId, topicId, difficulty, language = 'ru', shownIds = []) => {
  const subjectNames = {
    math: { ru: 'Математика', kz: 'Математика' },
    physics: { ru: 'Физика', kz: 'Физика' },
    chemistry: { ru: 'Химия', kz: 'Химия' },
    history: { ru: 'История Казахстана', kz: 'Қазақстан тарихы' },
    biology: { ru: 'Биология', kz: 'Биология' },
    kazakh: { ru: 'Қазақ тілі', kz: 'Қазақ тілі' },
  };
  
  const topicNames = {
    quadratic: { ru: 'Квадратные уравнения', kz: 'Квадраттық теңдеулер' },
    trigonometry: { ru: 'Тригонометрия', kz: 'Тригонометрия' },
    derivative: { ru: 'Производная', kz: 'Туынды' },
    integrals: { ru: 'Интегралы', kz: 'Интегралдар' },
    vectors: { ru: 'Векторы', kz: 'Векторлар' },
    stereometry: { ru: 'Стереометрия', kz: 'Стереометрия' },
    probability: { ru: 'Вероятность', kz: 'Ықтималдық' },
    progressions: { ru: 'Прогрессии', kz: 'Прогрессиялар' },
    kinematics: { ru: 'Кинематика', kz: 'Кинематика' },
    dynamics: { ru: 'Динамика', kz: 'Динамика' },
    conservation: { ru: 'Законы сохранения', kz: 'Сақталу заңдары' },
    electricity: { ru: 'Электричество', kz: 'Электр' },
    magnetism: { ru: 'Магнетизм', kz: 'Магнетизм' },
    optics: { ru: 'Оптика', kz: 'Оптика' },
    periodic: { ru: 'Периодический закон', kz: 'Периодтық заң' },
    bonds: { ru: 'Химические связи', kz: 'Химиялық байланыстар' },
    oxidation: { ru: 'Реакции окисления', kz: 'Тотығу реакциялары' },
    organic: { ru: 'Органическая химия', kz: 'Органикалық химия' },
    solutions: { ru: 'Растворы', kz: 'Ерітінділер' },
    ancient: { ru: 'Древний Казахстан', kz: 'Ежелгі Қазақстан' },
    'golden-horde': { ru: 'Золотая Орда', kz: 'Алтын Орда' },
    khanate: { ru: 'Казахское ханство', kz: 'Қазақ хандығы' },
    russia: { ru: 'Присоединение к России', kz: 'Ресейге қосылу' },
    'xx-century': { ru: 'XX век', kz: 'XX ғасыр' },
    modern: { ru: 'Современность', kz: 'Қазіргі заман' },
    cell: { ru: 'Клетка', kz: 'Жасуша' },
    genetics: { ru: 'Генетика', kz: 'Генетика' },
    evolution: { ru: 'Эволюция', kz: 'Эволюция' },
    ecology: { ru: 'Экология', кz: 'Экология' },
    anatomy: { ru: 'Анатомия', kz: 'Анатомия' },
    phonetics: { ru: 'Фонетика', kz: 'Фонетика' },
    morphology: { ru: 'Морфология', kz: 'Морфология' },
    syntax: { ru: 'Синтаксис', kz: 'Синтаксис' },
    lexicon: { ru: 'Лексика', kz: 'Лексика' },
    orthography: { ru: 'Орфография', kz: 'Емле' },
  };
  
  const subjectName = subjectNames[subjectId]?.[language] || subjectNames[subjectId]?.ru || subjectId;
  const topicName = topicNames[topicId]?.[language] || topicNames[topicId]?.ru || topicId;
  
  let question = generateLocalQuestion(subjectId, topicId, shownIds);
  
  if (!question) {
    console.log('Local questions exhausted, generating via Gemini...');
    question = await generateGeminiQuestion(subjectName, topicName, language);
  }
  
  return question;
};

export const getGeminiQuestionOnly = async (subjectId, topicId, language = 'ru') => {
  const subjectNames = { /* ... */ };
  const topicNames = { /* ... */ };
  
  const subjectName = subjectNames[subjectId]?.[language] || subjectNames[subjectId]?.ru || subjectId;
  const topicName = topicNames[topicId]?.[language] || topicNames[topicId]?.ru || topicId;
  
  return await generateGeminiQuestion(subjectName, topicName, language);
};
