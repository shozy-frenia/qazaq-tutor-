import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore.js';
import { getSubjectById } from '../data/subjects.js';
import { getQuestion } from '../services/aiService.js';
import { Send, Bot, User, Menu, X } from 'lucide-react';

export default function TutorView() {
  const {
    language,
    currentSubject,
    currentTopic,
    setCurrentTopic,
    difficulty,
    setDifficulty,
    messages,
    addMessage,
    currentQuestion,
    setCurrentQuestion,
    isWaitingForAnswer,
    setIsWaitingForAnswer,
    isLoading,
    setIsLoading,
    updateStats,
    setCurrentView,
  } = useStore();
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shownQuestions, setShownQuestions] = useState([]);
  const messagesEndRef = useRef(null);
  
  const t = (ru, kz) => language === 'kz' ? kz : ru;
  const subject = currentSubject ? getSubjectById(currentSubject) : null;
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  useEffect(() => {
    if (currentSubject && messages.length === 0) {
      const greeting = {
        type: 'ai',
        content: t(
          `Отлично! Вы выбрали предмет «${subject?.name}». Выберите тему ниже, и я задам вам задание. 🎯`,
          `Керемет! Сіз «${subject?.nameKz}» пәнін таңдадыңыз. Тақырыпты таңдаңыз, мен сізге тапсырма беремін. 🎯`
        ),
      };
      addMessage(greeting);
    }
  }, [currentSubject]);
  
  const selectTopic = async (topic) => {
    setCurrentTopic(topic);
    setSidebarOpen(false);
    setShownQuestions([]);
    
    const msg = {
      type: 'ai',
      content: t(
        `Отличный выбор! Давайте потренируемся по теме «${topic.name}». Вот ваше задание:`,
        `Керемет таңдау! «${topic.nameKz}» тақырыбы бойынша жаттығайық. Міне, сіздің тапсырмаңыз:`
      ),
    };
    addMessage(msg);
    
    await generateNewQuestion(topic);
  };
  
  const generateNewQuestion = async (topic = currentTopic) => {
    if (!topic || !currentSubject) return;
    
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      const question = await getQuestion(currentSubject, topic.id, difficulty, language, shownQuestions);
      
      if (!question) {
        setIsTyping(false);
        setIsLoading(false);
        addMessage({
          type: 'ai',
          content: t(
            'По этой теме пока нет заданий. Выберите другую тему! 📚',
            'Бұл тақырып бойынша тапсырмалар жоқ. Басқа тақырыпты таңдаңыз! 📚'
          ),
        });
        return;
      }
      
      setShownQuestions(prev => [...prev, question.id]);
      setCurrentQuestion(question);
      setIsWaitingForAnswer(true);
      
      const qMsg = {
        type: 'question',
        question: question,
      };
      addMessage(qMsg);
    } catch (error) {
      console.error('Error:', error);
      addMessage({
        type: 'ai',
        content: t('Ошибка загрузки. Попробуйте ещё раз!', 'Жүктеу қатесі. Қайтадан көріңіз!'),
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };
  
  const handleAnswer = (selectedIndex) => {
    if (!isWaitingForAnswer || !currentQuestion) return;
    
    setIsWaitingForAnswer(false);
    const isCorrect = selectedIndex === currentQuestion.correct;
    
    addMessage({
      type: 'user',
      content: `${String.fromCharCode(65 + selectedIndex)}) ${currentQuestion.options[selectedIndex]}`,
    });
    
    updateStats(isCorrect);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const resultMsg = {
        type: 'result',
        isCorrect,
        explanation: language === 'kz' ? currentQuestion.explanationKz : currentQuestion.explanation,
      };
      addMessage(resultMsg);
      
      setTimeout(() => {
        addMessage({
          type: 'ai',
          content: t(
            'Напишите «ещё» для нового задания по этой теме или выберите другую тему. 📝',
            '«Тағы» деп жазыңыз немесе басқа тақырыпты таңдаңыз. 📝'
          ),
        });
      }, 500);
    }, 800);
  };
  
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const text = inputValue.trim();
    setInputValue('');
    
    addMessage({ type: 'user', content: text });
    
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('ещё') || lowerText.includes('еще') || lowerText.includes('тағы') || lowerText.includes('следующ')) {
      setIsTyping(true);
      setTimeout(async () => {
        setIsTyping(false);
        await generateNewQuestion();
      }, 600);
    } else {
      addMessage({
        type: 'ai',
        content: t(
          'Напишите «ещё» для нового задания или выберите тему. 💡',
          'Жаңа тапсырма үшін «тағы» деп жазыңыз немесе тақырыпты таңдаңыз. 💡'
        ),
      });
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const difficulties = [
    { id: 'easy', label: t('Легкий', 'Жеңіл') },
    { id: 'medium', label: t('Средний', 'Орташа') },
    { id: 'hard', label: t('Сложный', 'Қиын') },
  ];
  
  if (!currentSubject) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-bold mb-2">{t('Выберите предмет', 'Пәнді таңдаңыз')}</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-3 bg-kz-blue rounded-xl font-semibold hover:bg-kz-blue-dark transition-colors"
        >
          {t('На главную', 'Басты бетке')}
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex gap-5 h-[calc(100vh-140px)] animate-fade-in">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 w-12 h-12 bg-kz-blue rounded-full flex items-center justify-center shadow-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Sidebar - Desktop always visible, Mobile conditional */}
      <aside className={`
        ${sidebarOpen ? 'fixed inset-0 z-40 bg-dark-bg/95 backdrop-blur-sm flex items-center justify-center' : 'hidden'}
        lg:static lg:flex lg:w-72 lg:bg-dark-card lg:backdrop-blur-none
        w-full h-full
      `}>
        <div className={`
          bg-dark-card border border-dark-border rounded-2xl p-5 flex flex-col
          ${sidebarOpen ? 'w-80 max-h-[80vh]' : 'w-full h-full'}
        `}>
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h3 className="font-semibold">{t('Темы', 'Тақырыптар')}</h3>
            <button onClick={() => setSidebarOpen(false)} className="p-1">
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-5 overflow-y-auto flex-1">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 hidden lg:flex items-center gap-2">
              📋 {t('Темы по предмету', 'Пән бойынша тақырыптар')}
            </h3>
            <div className="flex flex-col gap-1.5">
              {subject?.topics?.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => selectTopic(topic)}
                  className={`
                    flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all text-left
                    ${currentTopic?.id === topic.id
                      ? 'bg-kz-blue/15 text-kz-blue border border-kz-blue/20'
                      : 'text-slate-400 hover:bg-kz-blue/10 hover:text-slate-200'
                    }
                  `}
                >
                  <span className="truncate">{language === 'kz' ? topic.nameKz : topic.name}</span>
                  <span className={`text-xs font-semibold ml-2 shrink-0 ${
                    topic.progress > 50 ? 'text-green-400' : 'text-amber-400'
                  }`}>
                    {topic.progress}%
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-dark-border">
            <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              {t('Сложность', 'Қиындық')}
            </h3>
            <div className="flex gap-1.5">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`
                    flex-1 py-2 rounded-lg text-xs font-medium transition-all
                    ${difficulty === d.id
                      ? 'bg-kz-blue text-white'
                      : 'bg-dark-bg text-slate-400 hover:text-slate-200 border border-dark-border'
                    }
                  `}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
      
      {/* Chat */}
      <div className="flex-1 bg-dark-card border border-dark-border rounded-2xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-dark-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-kz-blue to-kz-gold flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <div className="font-semibold text-sm">AI-Репетитор</div>
            <div className="flex items-center gap-1.5 text-xs text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-dot" />
              {t('Онлайн', 'Желіде')}
            </div>
          </div>
          {currentTopic && (
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-400 bg-dark-bg px-3 py-1.5 rounded-lg">
              <span>{subject?.icon}</span>
              <span className="hidden sm:inline">{language === 'kz' ? currentTopic.nameKz : currentTopic.name}</span>
            </div>
          )}
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
              <div className="text-4xl mb-3">👆</div>
              <p className="text-sm max-w-xs">
                {t('Выберите тему слева или нажмите кнопку меню внизу', 
                   'Сол жақтан тақырыпты таңдаңыз немесе төмендегі мәзір батырмасын басыңыз')}
              </p>
            </div>
          )}
          
          {messages.map((msg) => {
            if (msg.type === 'ai') {
              return (
                <div key={msg.id} className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-kz-blue/20 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} className="text-kz-blue" />
                  </div>
                  <div className="bg-kz-blue/10 border border-kz-blue/20 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              );
            }
            
            if (msg.type === 'user') {
              return (
                <div key={msg.id} className="flex gap-3 justify-end animate-fade-in">
                  <div className="bg-kz-blue rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-kz-gold/20 flex items-center justify-center shrink-0 mt-1">
                    <User size={16} className="text-kz-gold" />
                  </div>
                </div>
              );
            }
            
            if (msg.type === 'question' && msg.question) {
              const q = msg.question;
              return (
                <div key={msg.id} className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-kz-blue/20 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} className="text-kz-blue" />
                  </div>
                  <div className="bg-kz-blue/5 border border-kz-blue/10 rounded-2xl rounded-tl-sm px-5 py-4 max-w-[85%]">
                    <div className="font-medium mb-4 text-sm leading-relaxed">
                      {language === 'kz' ? q.questionKz : q.question}
                    </div>
                    <div className="flex flex-col gap-2">
                      {q.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          disabled={!isWaitingForAnswer}
                          className={`
                            text-left px-4 py-3 rounded-xl text-sm transition-all border
                            ${!isWaitingForAnswer
                              ? 'opacity-50 cursor-not-allowed border-dark-border'
                              : 'border-dark-border hover:border-kz-blue hover:bg-kz-blue/10 cursor-pointer bg-white/5'
                            }
                          `}
                        >
                          <span className="font-semibold text-kz-blue mr-2">{String.fromCharCode(65 + i)})</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            
            if (msg.type === 'result') {
              return (
                <div key={msg.id} className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-kz-blue/20 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} className="text-kz-blue" />
                  </div>
                  <div className={`border rounded-2xl rounded-tl-sm px-5 py-4 max-w-[85%] ${
                    msg.isCorrect 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : 'bg-red-500/10 border-red-500/20'
                  }`}>
                    <div className={`font-bold mb-2 text-sm ${
                      msg.isCorrect ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {msg.isCorrect 
                        ? t('✅ Правильно!', '✅ Дұрыс!') 
                        : t('❌ Неправильно', '❌ Дұрыс емес')
                      }
                    </div>
                    <div className="bg-kz-gold/10 border-l-2 border-kz-gold rounded-r-lg px-3 py-2.5">
                      <p className="text-sm text-slate-300 leading-relaxed">{msg.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            }
            
            return null;
          })}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-kz-blue/20 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-kz-blue" />
              </div>
              <div className="bg-kz-blue/10 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div className="px-5 py-4 border-t border-dark-border flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t(
              'Напишите «ещё» или выберите тему...',
              '«Тағы» деп жазыңыз немесе тақырыпты таңдаңыз...'
            )}
            className="flex-1 px-5 py-3 rounded-xl bg-dark-bg border border-dark-border text-sm text-white placeholder-slate-500 outline-none focus:border-kz-blue transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-5 py-3 bg-gradient-to-r from-kz-blue to-kz-blue-dark rounded-xl font-semibold text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={16} />
            <span className="hidden sm:inline">{t('Отправить', 'Жіберу')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
