
import { getRandomQuestion } from '../data/questions.js';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Генерация через Gemini API
export const generateGeminiQuestion = async (subjectName, topicName, difficulty, language = 'ru') => {
  if (!GEMINI_API_KEY) {
    console.log('Gemini API key not found');
    return null;
  }

  const prompt = language === 'kz'
    ? `Сен Қазақстандық оқушыларға ЕНТ-ге дайындауға көмектесетін AI-репетиторсың.
«${subjectName}» пәні бойынша «${topicName}» тақырыбына ${difficulty === 'easy' ? 'жеңіл' : difficulty === 'medium' ? 'орташа' : 'қиын'} деңгейде нақты тапсырма бер.
Формат:
СҰРАҚ: [нақты сұрақ]
А) [нұсқа 1]
Б) [нұсқа 2]
В) [нұсқа 3]
Г) [нұсқа 4]
ДҰРЫС: [А/Б/В/Г]
ТҮСІНДІРМЕ: [толық түсіндірме]`
    : `Ты — AI-репетитор для подготовки к ЕНТ в Казахстане.
Сгенерируй задание по предмету «${subjectName}» на тему «${topicName}» уровня ${difficulty}.
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

    // Парсинг ответа
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
      difficulty: difficulty,
    };
  } catch (error) {
    console.error('Gemini error:', error);
    return null;
  }
};

// Локальная база
export const generateLocalQuestion = (subjectId, topicId, difficulty, shownIds = []) => {
  let question = getRandomQuestion(subjectId, topicId, difficulty, shownIds);
  
  if (!question) {
    // Пробуем любую сложность для этой темы
    question = getRandomQuestion(subjectId, topicId, null, shownIds);
  }
  
  if (!question) {
    // Пробуем любую тему этого предмета
    question = getRandomQuestion(subjectId, null, difficulty, shownIds);
  }
  
  if (!question) {
    return null; // Не fallback, а null — чтобы вызвать AI
  }
  
  return question;
};

// ГЛАВНАЯ ФУНКЦИЯ
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
    electricity:
