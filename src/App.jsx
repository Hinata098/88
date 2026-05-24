import React, { useState, useCallback } from 'react';
import { useApp } from './context/AppContext.jsx';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js';
import { useNotifications } from './hooks/useNotifications.js';

import OnboardingWizard from './components/onboarding/OnboardingWizard.jsx';
import Header from './components/layout/Header.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import BottomNav from './components/layout/BottomNav.jsx';
import ToastContainer from './components/layout/ToastContainer.jsx';
import KeyboardShortcuts from './components/ui/KeyboardShortcuts.jsx';
import Settings from './components/layout/Settings.jsx';

import DailyTasks from './components/tasks/DailyTasks.jsx';
import EntertainmentTracker from './components/entertainment/EntertainmentTracker.jsx';
import HabitsGoals from './components/habits/HabitsGoals.jsx';
import CalendarView from './components/calendar/CalendarView.jsx';
import Analytics from './components/analytics/Analytics.jsx';
import QuickNotes from './components/notes/QuickNotes.jsx';

function AppContent() {
  const {
    onboardingDone,
    activeSection, setActiveSection,
    setShowKeyboardHelp,
    tasks, entertainmentItems, user, briefingTime,
    addToast,
  } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);

  // Notifications
  useNotifications({ tasks, entertainmentItems, user, briefingTime, addToast });

  // Keyboard shortcuts
  useKeyboardShortcuts(useCallback({
    'n': () => { setActiveSection('tasks'); setAddModalOpen(true); },
    'f': () => setActiveSection('tasks'),
    'e': () => setActiveSection('entertainment'),
    'h': () => setActiveSection('habits'),
    'c': () => setActiveSection('calendar'),
    'a': () => setActiveSection('analytics'),
    'q': () => setActiveSection('notes'),
    '?': () => setShowKeyboardHelp(true),
    'escape': () => { setAddModalOpen(false); setShowKeyboardHelp(false); },
  }, [setActiveSection, setAddModalOpen, setShowKeyboardHelp]));

  if (!onboardingDone) return <OnboardingWizard />;

  const renderSection = () => {
    switch (activeSection) {
      case 'tasks':         return <DailyTasks addModalOpen={addModalOpen} setAddModalOpen={setAddModalOpen} />;
      case 'entertainment': return <EntertainmentTracker />;
      case 'habits':        return <HabitsGoals />;
      case 'calendar':      return <CalendarView />;
      case 'analytics':     return <Analytics />;
      case 'notes':         return <QuickNotes />;
      case 'settings':      return <Settings />;
      default:              return <DailyTasks addModalOpen={addModalOpen} setAddModalOpen={setAddModalOpen} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle scanlines overlay */}
      <div className="scanlines" />

      <Header />
      <Sidebar />

      {/* Main content */}
      <main className="pt-[60px] md:pl-[220px] pb-20 md:pb-8">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
          {renderSection()}
        </div>
      </main>

      <BottomNav />
      <ToastContainer />
      <KeyboardShortcuts />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
