import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { getGreeting } from '../../utils/dates.js';
import { AVATARS, THEMES } from '../../data/defaults.js';

export default function Header() {
  const {
    user, xp, levelInfo, theme, setTheme,
    missedTaskCount, notificationLog,
    showNotifLog, setShowNotifLog,
    setShowKeyboardHelp,
    dailyQuote,
  } = useApp();

  const [showThemePicker, setShowThemePicker] = useState(false);

  const avatar = AVATARS.find(a => a.id === user?.avatar) || AVATARS[0];
  const greeting = getGreeting(user?.name || 'User');

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[60px] bg-surface-container-low border-b border-outline-variant flex items-center px-4 md:px-8 gap-4 stagger-1">
      {/* Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-6 h-6 border border-primary-container relative">
          <div className="absolute inset-1 border border-primary-container opacity-50" />
        </div>
        <span className="font-display text-primary text-xl hidden sm:block">Chronicle</span>
      </div>

      {/* Greeting */}
      <div className="hidden md:flex flex-col ml-2">
        <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
          {greeting}
        </span>
        <span className="font-mono text-xs text-outline truncate max-w-xs">
          "{dailyQuote.text.slice(0, 50)}{dailyQuote.text.length > 50 ? '…' : ''}"
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* XP Level Bar */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="font-mono text-xs text-primary">
            Lv.{levelInfo.current.level} — {levelInfo.current.title}
          </span>
          <span className="font-mono text-[10px] text-on-surface-variant">
            {xp} XP {levelInfo.next ? `/ ${levelInfo.next.xpRequired}` : '(MAX)'}
          </span>
        </div>
        <div className="w-24 h-1.5 bg-surface-container-highest border border-outline-variant overflow-hidden">
          <div
            className="xp-bar-fill h-full"
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Avatar */}
        <div className="w-8 h-8 border border-outline-variant bg-surface-container-highest flex items-center justify-center text-base">
          {avatar.emoji}
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifLog(p => !p)}
            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary border border-transparent hover:border-outline-variant transition-colors relative"
            title="Notification log"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {missedTaskCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error text-background text-[10px] font-mono flex items-center justify-center rounded-none">
                {missedTaskCount}
              </span>
            )}
          </button>

          {/* Notification Log Dropdown */}
          {showNotifLog && (
            <div className="absolute top-10 right-0 w-72 bg-surface-container border border-outline-variant shadow-terminal z-50 max-h-80 overflow-y-auto">
              <div className="flex items-center justify-between p-3 border-b border-outline-variant">
                <span className="font-mono text-xs text-outline uppercase tracking-widest">Notification Log</span>
                <button onClick={() => setShowNotifLog(false)}>
                  <span className="material-symbols-outlined text-base text-on-surface-variant hover:text-primary">close</span>
                </button>
              </div>
              {notificationLog.length === 0 ? (
                <p className="font-mono text-xs text-on-surface-variant p-3">No notifications yet.</p>
              ) : (
                [...notificationLog].reverse().slice(0, 20).map(n => (
                  <div key={n.id} className="flex items-start gap-2 p-3 border-b border-outline-variant/50 hover:bg-surface-container-high">
                    <span className={`material-symbols-outlined text-sm mt-0.5 ${
                      n.type === 'error' ? 'text-error' : n.type === 'warning' ? 'text-primary-container' : 'text-primary'
                    }`}>
                      {n.type === 'error' ? 'warning' : 'info'}
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant leading-relaxed">{n.msg}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Theme switcher */}
        <div className="relative">
          <button
            onClick={() => setShowThemePicker(p => !p)}
            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary border border-transparent hover:border-outline-variant transition-colors"
            title="Switch theme"
          >
            <span className="material-symbols-outlined text-xl">palette</span>
          </button>

          {showThemePicker && (
            <div className="absolute top-10 right-0 w-56 bg-surface-container border border-outline-variant shadow-terminal z-50">
              <div className="p-2 border-b border-outline-variant">
                <span className="font-mono text-[10px] text-outline uppercase tracking-widest">Themes</span>
              </div>
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); setShowThemePicker(false); }}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-surface-container-high transition-colors text-left ${
                    theme === t.id ? 'bg-surface-container-highest' : ''
                  }`}
                >
                  <span className="font-mono text-sm text-on-surface">{t.label}</span>
                  {theme === t.id && (
                    <span className="material-symbols-outlined text-sm text-primary-container ml-auto">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Keyboard shortcuts */}
        <button
          onClick={() => setShowKeyboardHelp(true)}
          className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary border border-transparent hover:border-outline-variant transition-colors"
          title="Keyboard shortcuts (?)"
        >
          <span className="material-symbols-outlined text-xl">keyboard</span>
        </button>
      </div>
    </header>
  );
}
