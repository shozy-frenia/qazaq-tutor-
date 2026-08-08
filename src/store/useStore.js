import { create } from 'zustand';

export const useStore = create((set, get) => ({
  language: 'ru',
  setLanguage: (lang) => set({ language: lang }),
  
  currentView: 'home',
  setCurrentView: (view) => set({ currentView: view }),
  
  currentSubject: null,
  setCurrentSubject: (subject) => set({ currentSubject: subject }),
  
  currentTopic: null,
  setCurrentTopic: (topic) => set({ currentTopic: topic }),
  
  difficulty: 'easy',
  setDifficulty: (diff) => set({ difficulty: diff }),
  
  messages: [],
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, { ...message, id: Date.now() }] 
  })),
  clearMessages: () => set({ messages: [] }),
  
  currentQuestion: null,
  setCurrentQuestion: (q) => set({ currentQuestion: q }),
  
  isWaitingForAnswer: false,
  setIsWaitingForAnswer: (val) => set({ isWaitingForAnswer: val }),
  
  isLoading: false,
  setIsLoading: (val) => set({ isLoading: val }),
  
  // РЕАЛЬНАЯ статистика
  stats: {
    totalAnswered: 0,
    correctAnswers: 0,
    streak: 0,
    bestStreak: 0,
    subjectStats: {
      math: { answered: 0, correct: 0 },
      physics: { answered: 0, correct: 0 },
      chemistry: { answered: 0, correct: 0 },
      history: { answered: 0, correct: 0 },
      biology: { answered: 0, correct: 0 },
      kazakh: { answered: 0, correct: 0 },
    },
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
    lastActiveDay: null,
  },
  
  updateStats: (isCorrect, subjectId) => set((state) => {
    const today = new Date().getDay();
    const newStreak = isCorrect ? state.stats.streak + 1 : 0;
    const newBestStreak = Math.max(newStreak, state.stats.bestStreak);
    
    const weekProgress = [...state.stats.weeklyProgress];
    weekProgress[today === 0 ? 6 : today - 1] += isCorrect ? 1 : 0;
    
    const subjectStats = { ...state.stats.subjectStats };
    if (subjectId && subjectStats[subjectId]) {
      subjectStats[subjectId] = {
        answered: subjectStats[subjectId].answered + 1,
        correct: subjectStats[subjectId].correct + (isCorrect ? 1 : 0),
      };
    }
    
    return {
      stats: {
        ...state.stats,
        totalAnswered: state.stats.totalAnswered + 1,
        correctAnswers: state.stats.correctAnswers + (isCorrect ? 1 : 0),
        streak: newStreak,
        bestStreak: newBestStreak,
        subjectStats,
        weeklyProgress: weekProgress,
      },
    };
  }),
  
  startNewSubject: (subjectId) => set({
    currentSubject: subjectId,
    currentTopic: null,
    messages: [],
    currentQuestion: null,
    isWaitingForAnswer: false,
  }),
}));
