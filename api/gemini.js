// api/gemini.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { subjectName, topicName, language } = req.body;
  
  console.log('=== REQUEST RECEIVED ===');
  console.log('subjectName:', subjectName);
  console.log('topicName:', topicName);
  console.log('language:', language);
  console.log('API Key exists?', !!process.env.GEMINI_API_KEY);
  console.log('API Key first 10 chars:', process.env.GEMINI_API_KEY?.slice(0, 10));

  if (!subjectName || !topicName) {
    return res.status(400).json({ error: "subjectName and topicName are required" });
  }

  const prompt = language === 'kz'
    ? `Сен Қазақстандық оқушыларға ЕНТ-ге дайындауға көмектесетін AI-репетиторсың...`
    : `Ты — AI-репетитор для подготовки к ЕНТ в Казахстане...`;

  const requestBody = {
  model: 'gpt-3.5-turbo',  // ← ИЗМЕНЕНО
  messages: [
    { role: 'system', content: 'You are a helpful AI tutor for Kazakh students preparing for ENT exams.' },
    { role: 'user', content: prompt }
  ],
  temperature: 0.7,
  max_tokens: 800,
};


  console.log('=== SENDING TO FREETHEAI ===');
  console.log('URL:', 'https://api.freetheai.xyz/v1/chat/completions');
  console.log('Request body:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch('https://api.freetheai.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('=== FREETHEAI RESPONSE ===');
    console.log('Status:', response.status);
    
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      return res.status(500).json({ 
        error: `FreeTheAi error: ${response.status}`,
        details: responseText 
      });
    }

    // ... остальной код парсинга ...

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message });
  }
}
