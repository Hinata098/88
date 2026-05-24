import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

const SHORTCUTS = [
  { key: 'N',   desc: 'New task modal' },
  { key: 'F',   desc: 'Jump to Tasks (Focus)' },
  { key: 'E',   desc: 'Jump to Entertainment' },
  { key: 'H',   desc: 'Jump to Habits & Goals' },
  { key: 'C',   desc: 'Jump to Calendar' },
  { key: 'A',   desc: 'Jump to Analytics' },
  { key: 'Q',   desc: 'Jump to Quick Notes' },
  { key: '?',   desc: 'Show this help' },
  { key: 'Esc', desc: 'Close any modal' },
];

export default function KeyboardShortcuts() {
  const { showKeyboardHelp, setShowKeyboardHelp } = useApp();

  if (!showKeyboardHelp) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-background/80 backdrop-blur-sm modal-backdrop"
      onClick={() => setShowKeyboardHelp(false)}
    >
      <div
        className="bg-surface-container border border-outline-variant shadow-terminal-lg p-6 w-full max-w-sm modal-content"
        onClick={e => e.stopPropagation()}
      >
        {/* Terminal corners */}
        <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-primary-container" />
        <div className="absolute -top-px -right-px w-3 h-3 border-t border-r border-primary-container" />
        <div className="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-primary-container" />
        <div className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-primary-container" />

        <div className="flex items-center justify-between mb-4 border-b border-outline-variant pb-3">
          <div>
            <h2 className="font-display text-primary text-xl">Keyboard Shortcuts</h2>
            <p className="font-mono text-xs text-on-surface-variant">Power user controls</p>
          </div>
          <button onClick={() => setShowKeyboardHelp(false)}>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {SHORTCUTS.map(s => (
            <div key={s.key} className="flex items-center justify-between py-1.5 border-b border-outline-variant/30">
              <span className="font-mono text-xs text-on-surface-variant">{s.desc}</span>
              <kbd className="font-mono text-xs bg-surface-container-highest border border-outline-variant px-2 py-0.5 text-primary min-w-[32px] text-center">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
