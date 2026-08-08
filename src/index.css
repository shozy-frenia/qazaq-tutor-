import { useStore } from './store/useStore.js';
import Header from './components/Header.jsx';
import HomeView from './components/HomeView.jsx';
import TutorView from './components/TutorView.jsx';
import ProgressView from './components/ProgressView.jsx';

export default function App() {
  const { currentView } = useStore();

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <Header />
        
        <main>
          {currentView === 'home' && <HomeView />}
          {currentView === 'tutor' && <TutorView />}
          {currentView === 'progress' && <ProgressView />}
        </main>
      </div>
    </div>
  );
}
