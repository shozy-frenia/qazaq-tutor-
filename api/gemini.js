// api/gemini.js — Serverless Function на Vercel

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subjectName, topicName, language } = req.body;

  if (!subjectName || !topicName) {
    return res.status(400).json({ error: "subjectName and topicName are required" });
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      return res.status(500).json({ error: `Gemini API error: ${response.status}` });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Парсим ответ
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

    return res.status(200).json({
      id: 'gemini-' + Date.now(),
      question: questionText,
      questionKz: questionText,
      options: options.length >= 4 ? options : ['A', 'B', 'C', 'D'],
      correct: Math.max(0, correct),
      explanation: explanation,
      explanationKz: explanation,
      topicId: 'ai-generated',
      difficulty: 'medium',
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message });
  }
}
