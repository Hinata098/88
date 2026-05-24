import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

const NAV_ITEMS = [
  { id: 'tasks',         icon: 'assignment_turned_in', label: 'Tasks',         shortcut: 'F' },
  { id: 'entertainment', icon: 'movie',                label: 'Entertainment', shortcut: 'E' },
  { id: 'habits',        icon: 'self_improvement',     label: 'Habits & Goals',shortcut: 'H' },
  { id: 'calendar',      icon: 'calendar_month',       label: 'Calendar',      shortcut: 'C' },
  { id: 'analytics',     icon: 'analytics',            label: 'Analytics',     shortcut: 'A' },
  { id: 'notes',         icon: 'sticky_note_2',        label: 'Notes',         shortcut: 'Q' },
];

export default function Sidebar() {
  const { activeSection, setActiveSection, missedTaskCount } = useApp();

  return (
    <nav className="hidden md:flex flex-col fixed left-0 top-[60px] bottom-0 w-[220px] bg-surface-container-low border-r border-outline-variant z-30 py-4">
      {/* Section label */}
      <div className="px-4 mb-3">
        <span className="font-mono text-[10px] text-outline uppercase tracking-widest">Navigation</span>
      </div>

      {NAV_ITEMS.map((item, i) => {
        const isActive = activeSection === item.id;
        const hasBadge = item.id === 'tasks' && missedTaskCount > 0;

        return (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`
              flex items-center gap-3 px-4 py-3 w-full text-left border-l-2 transition-all duration-150 group
              ${isActive
                ? 'border-primary-container bg-surface-container text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary hover:bg-surface-container hover:border-outline-variant'}
            `}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-mono text-xs uppercase tracking-wider flex-1">{item.label}</span>
            <div className="flex items-center gap-1.5">
              {hasBadge && (
                <span className="w-4 h-4 bg-error text-background font-mono text-[9px] flex items-center justify-center">
                  {missedTaskCount}
                </span>
              )}
              <kbd className="hidden group-hover:flex font-mono text-[9px] text-outline border border-outline-variant px-1 py-0.5 leading-none">
                {item.shortcut}
              </kbd>
            </div>
          </button>
        );
      })}

      {/* Bottom: Settings */}
      <div className="mt-auto px-4 pt-4 border-t border-outline-variant">
        <button
          onClick={() => setActiveSection('settings')}
          className={`flex items-center gap-3 w-full text-left transition-colors ${
            activeSection === 'settings' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          <span className="font-mono text-xs uppercase tracking-wider">Settings</span>
        </button>
      </div>
    </nav>
  );
}
