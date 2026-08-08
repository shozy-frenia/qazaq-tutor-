import { getRandomQuestion } from '../data/questions.js';

export const generateLocalQuestion = (subjectId, topicId, difficulty) => {
  const question = getRandomQuestion(subjectId, topicId, difficulty);
  
  if (!question) {
    return {
      id: 'fallback-' + Date.now(),
      question: 'В базе пока нет заданий по этой теме. Попробуйте другую тему!',
      questionKz: 'Бұл тақырып бойынша базада тапсырмалар жоқ. Басқа тақырыпты көріңіз!',
      options: ['Понятно', 'Выбрать другую тему', 'Назад', 'Помощь'],
      correct: 0,
      explanation: 'Это временное задание. В полной версии здесь будет реальный вопрос по выбранной теме.',
      explanationKz: 'Бұл уақытша тапсырма. Толық нұсқада мұнда нақты сұрақ болады.',
      topicId: topicId,
      difficulty: difficulty,
    };
  }
  
  return question;
};

export const generateAIQuestion = async (subjectName, topicName, difficulty, language = 'ru') => {
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!API_KEY) {
    console.warn('OpenAI API key not found, using local questions');
    return null;
  }
  
  const prompt = language === 'kz' 
    ? `Сен Қазақстандық оқушыларға ЕНТ-ге дайындауға көмектесетін AI-репетиторсың. 
       «${subjectName}» пәні бойынша «${topicName}» тақырыбына ${difficulty === 'easy' ? 'жеңіл' : difficulty === 'medium' ? 'орташа' : 'қиын'} деңгейде тапсырма дайында.
       Формат: сұрақ + 4 нұсқа + дұрыс жауап индексі (0-3) + толық түсіндірме.`
    : `Ты — AI-репетитор для подготовки к ЕНТ в Казахстане.
       Сгенерируй задание по предмету «${subjectName}» на тему «${topicName}» уровня ${difficulty}.
       Формат: вопрос + 4 варианта ответа + индекс правильного ответа (0-3) + подробное объяснение.`;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    const lines = content.split('\n').filter(l => l.trim());
    const questionText = lines[0]?.replace(/^\d+\.\s*/, '') || 'Вопрос';
    const options = lines.slice(1, 5).map(l => l.replace(/^[А-ДA-D][).]\s*/, ''));
    const correctLine = lines.find(l => l.includes('Правильный') || l.includes('Дұрыс'));
    const correct = correctLine ? parseInt(correctLine.match(/\d/)) : 0;
    const explanation = lines.slice(5).join(' ') || 'Объяснение отсутствует';
    
    return {
      id: 'ai-' + Date.now(),
      question: questionText,
      questionKz: questionText,
      options: options.length >= 4 ? options : ['A', 'B', 'C', 'D'],
      correct: correct || 0,
      explanation: explanation,
      explanationKz: explanation,
      topicId: 'ai-generated',
      difficulty: difficulty,
    };
  } catch (error) {
    console.error('AI generation failed:', error);
    return null;
  }
};

export const getQuestion = async (subjectId, topicId, difficulty, language = 'ru') => {
  const aiQuestion = await generateAIQuestion(subjectId, topicId, difficulty, language);
  if (aiQuestion) return aiQuestion;
  
  return generateLocalQuestion(subjectId, topicId, difficulty);
};
