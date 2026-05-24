import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

const TABS = [
  { id: 'tasks',         icon: 'assignment_turned_in', label: 'Tasks' },
  { id: 'habits',        icon: 'self_improvement',     label: 'Habits' },
  { id: 'entertainment', icon: 'movie',                label: 'Media' },
  { id: 'analytics',     icon: 'analytics',            label: 'Data' },
  { id: 'notes',         icon: 'sticky_note_2',        label: 'Notes' },
];

export default function BottomNav() {
  const { activeSection, setActiveSection, missedTaskCount } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-surface-container-low border-t border-outline-variant flex items-stretch">
      {TABS.map(tab => {
        const isActive = activeSection === tab.id;
        const hasBadge = tab.id === 'tasks' && missedTaskCount > 0;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 relative border-t-2 transition-all ${
              isActive
                ? 'border-primary-container text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            <div className="relative">
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              {hasBadge && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-error text-background font-mono text-[8px] flex items-center justify-center">
                  {missedTaskCount}
                </span>
              )}
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
