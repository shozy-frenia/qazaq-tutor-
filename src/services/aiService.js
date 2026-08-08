import { getRandomQuestion } from '../data/questions.js';

export const generateLocalQuestion = (subjectId, topicId, difficulty, shownIds = []) => {
  let question = getRandomQuestion(subjectId, topicId, difficulty, shownIds);
  
  if (!question) {
    // Если по точной теме нет — берём любую тему этого предмета
    question = getRandomQuestion(subjectId, null, difficulty, shownIds);
  }
  
  if (!question) {
    return {
      id: 'fallback-' + Date.now(),
      question: 'В базе пока нет новых заданий по этому предмету. Попробуйте другой предмет!',
      questionKz: 'Бұл пән бойынша жаңа тапсырмалар жоқ. Басқа пәнді көріңіз!',
      options: ['Понятно', 'Выбрать другой предмет', 'На главную', 'Помощь'],
      correct: 0,
      explanation: 'Задания закончились. Переключитесь на другой предмет.',
      explanationKz: 'Тапсырмалар аяқталды. Басқа пәнге ауысыныз.',
      topicId: topicId,
      difficulty: difficulty,
    };
  }
  
  return question;
};

export const getQuestion = async (subjectId, topicId, difficulty, language = 'ru', shownIds = []) => {
  return generateLocalQuestion(subjectId, topicId, difficulty, shownIds);
};
