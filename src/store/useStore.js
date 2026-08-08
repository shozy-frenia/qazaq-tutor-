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
  
  stats: {
    totalAnswered: 0,
    correctAnswers: 0,
    streak: 12,
    bestStreak: 15,
    averageScore: 87,
    totalTopicsCompleted: 17,
    totalTopics: 50,
    weeklyProgress: [45, 62, 58, 71, 65, 80, 87],
    subjectProgress: {
      math: 45,
      physics: 32,
      chemistry: 28,
      history: 55,
      biology: 38,
      kazakh: 62,
    },
  },
  updateStats: (isCorrect) => set((state) => ({
    stats: {
      ...state.stats,
      totalAnswered: state.stats.totalAnswered + 1,
      correctAnswers: state.stats.correctAnswers + (isCorrect ? 1 : 0),
      streak: isCorrect ? state.stats.streak + 1 : 0,
      bestStreak: isCorrect && state.stats.streak + 1 > state.stats.bestStreak 
        ? state.stats.streak + 1 
        : state.stats.bestStreak,
    },
  })),
  
  startNewSubject: (subjectId) => set({
    currentSubject: subjectId,
    currentTopic: null,
    messages: [],
    currentQuestion: null,
    isWaitingForAnswer: false,
  }),
}));
