// api/gemini.js — для FreeTheAi
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { subjectName, topicName, language } = req.body;
  if (!subjectName || !topicName) {
    return res.status(400).json({ error: "subjectName and topicName are required" });
  }

  const prompt = language === 'kz'
    ? `Сен Қазақстандық оқушыларға ЕНТ-ге дайындауға көмектесетін AI-репетиторсың...`
    : `Ты — AI-репетитор для подготовки к ЕНТ в Казахстане...`;

  try {
    const response = await fetch('https://api.freetheai.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // или другая модель на FreeTheAi
        messages: [
          { role: 'system', content: 'You are a Kazakh ENT test generator.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('FreeTheAi error:', response.status, errText);
      return res.status(500).json({ error: `FreeTheAi error: ${response.status}` });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    // Парсим ответ (тот же код что и раньше)
    const lines = text.split('\n').filter(l => l.trim());
    // ... остальной парсинг ...

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message });
  }
}
