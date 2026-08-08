import { getRandomQuestion, questionsDB } from '../data/questions.js';

// ВРЕМЕННО: захардкодим ключ для теста
// aiService.js — временная диагностика
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





export const generateGeminiQuestion = async (subjectName, topicName, language = 'ru') => {
  if (!GEMINI_API_KEY) {
    console.log('Gemini API key not found');
    return null;
  }

  const prompt = language === 'kz'
    ? `Сен Қазақстандық оқушыларға ЕНТ-ге дайындауға көмектесетін AI-репетиторсың.
«${subjectName}» пәні бойынша «${topicName}» тақырыбына нақты тапсырма бер.
Бұл ЕНТ деңгейіндегі тапсырма болуы керек.
Формат:
СҰРАҚ: [нақты сұрақ]
А) [нұсқа 1]
Б) [нұсқа 2]
В) [нұсқа 3]
Г) [нұсқа 4]
ДҰРЫС: [А/Б/В/Г]
ТҮСІНДІРМЕ: [толық түсіндірме]`
    : `Ты — AI-репетитор для подготовки к ЕНТ в Казахстане.
Сгенерируй задание по предмету «${subjectName}» на тему «${topicName}».
Это должно быть задание уровня ЕНТ (Единое Национальное Тестирование).
Формат:
ВОПРОС: [конкретный вопрос]
А) [вариант 1]
Б) [вариант 2]
В) [вариант 3]
Г) [вариант 4]
ПРАВИЛЬНЫЙ: [А/Б/В/Г]
ОБЪЯСНЕНИЕ: [подробное объяснение]`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
        }),
      }
    );

    if (!response.ok) throw new Error('Gemini API error');

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const lines = text.split('\n').filter(l => l.trim());
    
    const questionLine = lines.find(l => l.includes('ВОПРОС:') || l.includes('СҰРАҚ:'));
    const questionText = questionLine ? questionLine.replace(/.*?:\s*/, '').trim() : 'Вопрос';
    
    const options = [];
    const optionLines = lines.filter(l => /^[А-ДA-D][).)\s]/.test(l));
    optionLines.forEach(l => {
      const clean = l.replace(/^[А-ДA-D][).)\s]+/, '').trim();
      if (clean) options.push(clean);
    });
    
    const correctLine = lines.find(l => l.includes('ПРАВИЛЬНЫЙ:') || l.includes('ДҰРЫС:'));
    let correct = 0;
    if (correctLine) {
      const match = correctLine.match(/[А-ДA-D]/);
      if (match) {
        const letter = match[0];
        correct = 'АБВГ'.indexOf(letter);
        if (correct === -1) correct = 'ABCD'.indexOf(letter);
      }
    }
    
    const explanationLine = lines.find(l => l.includes('ОБЪЯСНЕНИЕ:') || l.includes('ТҮСІНДІРМЕ:'));
    const explanation = explanationLine ? explanationLine.replace(/.*?:\s*/, '').trim() : 'Объяснение отсутствует';

    return {
      id: 'gemini-' + Date.now(),
      question: questionText,
      questionKz: questionText,
      options: options.length >= 4 ? options : ['A', 'B', 'C', 'D'],
      correct: Math.max(0, correct),
      explanation: explanation,
      explanationKz: explanation,
      topicId: 'ai-generated',
      difficulty: 'medium',
    };
  } catch (error) {
    console.error('Gemini error:', error);
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

// ГЛАВНАЯ ФУНКЦИЯ: сначала локальная база, потом Gemini
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
    ecology: { ru: 'Экология', kz: 'Экология' },
    anatomy: { ru: 'Анатомия', kz: 'Анатомия' },
    phonetics: { ru: 'Фонетика', kz: 'Фонетика' },
    morphology: { ru: 'Морфология', kz: 'Морфология' },
    syntax: { ru: 'Синтаксис', kz: 'Синтаксис' },
    lexicon: { ru: 'Лексика', kz: 'Лексика' },
    orthography: { ru: 'Орфография', kz: 'Емле' },
  };
  
  const subjectName = subjectNames[subjectId]?.[language] || subjectNames[subjectId]?.ru || subjectId;
  const topicName = topicNames[topicId]?.[language] || topicNames[topicId]?.ru || topicId;
  
  // Сначала пробуем локальную базу
  let question = generateLocalQuestion(subjectId, topicId, shownIds);
  
  // Если в локальной базе нет — генерируем через Gemini
  if (!question) {
    console.log('Local questions exhausted, generating via Gemini...');
    question = await generateGeminiQuestion(subjectName, topicName, language);
  }
  
  return question;
};

// ФУНКЦИЯ ТОЛЬКО ДЛЯ GEMINI: принудительная генерация нового вопроса
export const getGeminiQuestionOnly = async (subjectId, topicId, language = 'ru') => {
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
    ecology: { ru: 'Экология', kz: 'Экология' },
    anatomy: { ru: 'Анатомия', kz: 'Анатомия' },
    phonetics: { ru: 'Фонетика', kz: 'Фонетика' },
    morphology: { ru: 'Морфология', kz: 'Морфология' },
    syntax: { ru: 'Синтаксис', kz: 'Синтаксис' },
    lexicon: { ru: 'Лексика', kz: 'Лексика' },
    orthography: { ru: 'Орфография', kz: 'Емле' },
  };
  
  const subjectName = subjectNames[subjectId]?.[language] || subjectNames[subjectId]?.ru || subjectId;
  const topicName = topicNames[topicId]?.[language] || topicNames[topicId]?.ru || topicId;
  
  return await generateGeminiQuestion(subjectName, topicName, language);
};
