// aiService.js для Gemini
const GEMINI_API_KEY = 'YOUR_FREE_GEMINI_KEY';

export const generateAIQuestion = async (subjectName, topicName, difficulty, language = 'ru') => {
  const prompt = language === 'kz'
    ? `Сен Қазақстандық оқушыларға ЕНТ-ге дайындауға көмектесетін AI-репетиторсың. «${subjectName}» пәні бойынша «${topicName}» тақырыбына ${difficulty} деңгейде тапсырма дайында. Формат: СҰРАҚ: ... А) ... Б) ... В) ... Г) ... ДҰРЫС: A/B/C/D ТҮСІНДІРМЕ: ...`
    : `Ты — AI-репетитор для подготовки к ЕНТ в Казахстане. Сгенерируй задание по предмету «${subjectName}» на тему «${topicName}» уровня ${difficulty}. Формат: ВОПРОС: ... А) ... Б) ... В) ... Г) ... ПРАВИЛЬНЫЙ: A/B/C/D ОБЪЯСНЕНИЕ: ...`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
      })
    });
    
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Парсинг ответа
    const lines = text.split('\n').filter(l => l.trim());
    const questionText = lines.find(l => l.includes('ВОПРОС:') || l.includes('СҰРАҚ:'))?.replace(/.*?:\s*/, '') || 'Вопрос';
    const options = lines.filter(l => /^[А-ДA-D][).]/.test(l)).map(l => l.replace(/^[А-ДA-D][).]\s*/, ''));
    const correctLine = lines.find(l => l.includes('ПРАВИЛЬНЫЙ:') || l.includes('ДҰРЫС:'));
    const correct = correctLine ? 'АБВГ'.indexOf(correctLine.match(/[А-Д]/)[0]) : 0;
    const explanation = lines.find(l => l.includes('ОБЪЯСНЕНИЕ:') || l.includes('ТҮСІНДІРМЕ:'))?.replace(/.*?:\s*/, '') || 'Объяснение';
    
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
