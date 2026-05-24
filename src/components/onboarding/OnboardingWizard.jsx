import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { AVATARS } from '../../data/defaults.js';

export default function OnboardingWizard() {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('owl');
  const [briefingTime, setBriefingTime] = useState('08:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [firstTask, setFirstTask] = useState('');

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1);
  };

  const handleFinish = () => {
    completeOnboarding({ name, avatar, briefingTime, notificationsEnabled, firstTask });
  };

  const handleNotifToggle = async () => {
    if (!notificationsEnabled && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') setNotificationsEnabled(true);
    } else {
      setNotificationsEnabled(false);
    }
  };

  const selectedAvatarEmoji = AVATARS.find(a => a.id === avatar)?.emoji || '🦉';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="scanlines" />

      {/* Ambient glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[520px]">
        {/* Corner decorations */}
        <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-primary-container" />
        <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-primary-container" />
        <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-primary-container" />
        <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-primary-container" />

        <div className="bg-surface-container border border-outline-variant shadow-terminal-lg p-8 flex flex-col gap-8 stagger-1">
          {/* Header */}
          <div className="border-b border-outline-variant pb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-label-sm text-outline uppercase tracking-widest">
                Chronicle // Init Sequence
              </span>
              <span className="font-mono text-label-sm text-primary-container">
                {step}/3
              </span>
            </div>
            <h1 className="font-display text-4xl text-primary mt-3 leading-tight">
              {step === 1 && 'Welcome to your Chronicle.'}
              {step === 2 && 'Configure your briefing.'}
              {step === 3 && 'Set your first objective.'}
            </h1>
            <p className="font-mono text-body-md text-on-surface-variant mt-2">
              {step === 1 && 'Establish your designation and select a primary identifier.'}
              {step === 2 && 'Define your morning briefing time and notification preferences.'}
              {step === 3 && 'Optionally define your first weekly task to get started.'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="h-px bg-outline-variant -mt-4">
            <div
              className="h-px bg-primary-container transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step 1 ── Name & Avatar */}
          {step === 1 && (
            <div className="flex flex-col gap-6 stagger-2">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-label-sm text-outline uppercase tracking-widest">
                  [ SET_DESIGNATION ]
                </label>
                <div className="flex items-center border-b-2 border-outline-variant focus-within:border-primary-container transition-colors py-2 group">
                  <span className="font-mono text-primary-container mr-2 text-sm group-focus-within:animate-pulse">&gt;</span>
                  <input
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                    type="text"
                    maxLength={40}
                    placeholder="Enter your name or alias..."
                    className="bg-transparent border-none outline-none font-mono text-sm text-on-surface w-full placeholder:text-outline-variant"
                    spellCheck={false}
                    onKeyDown={e => e.key === 'Enter' && name.trim() && handleNext()}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="font-mono text-label-sm text-outline uppercase tracking-widest">
                  [ SELECT_IDENTIFIER ]
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AVATARS.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setAvatar(a.id)}
                      className={`aspect-square border flex items-center justify-center text-2xl transition-all hover:border-primary-container hover:bg-surface-container-highest ${
                        avatar === a.id
                          ? 'border-primary-container bg-surface-container-highest shadow-terminal'
                          : 'border-outline-variant bg-surface-container-low'
                      }`}
                    >
                      {a.emoji}
                      {avatar === a.id && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-primary-container" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 ── Briefing & Notifications */}
          {step === 2 && (
            <div className="flex flex-col gap-6 stagger-2">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-label-sm text-outline uppercase tracking-widest">
                  [ MORNING_BRIEFING_TIME ]
                </label>
                <p className="font-mono text-xs text-on-surface-variant">
                  Each day at this time, you'll receive a summary of tasks, shows, and goals.
                </p>
                <div className="flex items-center border border-outline-variant bg-surface-container-lowest p-3 focus-within:border-primary-container transition-colors mt-1">
                  <span className="font-mono text-primary-container mr-2 text-sm">&gt;</span>
                  <input
                    type="time"
                    value={briefingTime}
                    onChange={e => setBriefingTime(e.target.value)}
                    className="bg-transparent border-none outline-none font-mono text-sm text-on-surface w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-label-sm text-outline uppercase tracking-widest">
                  [ NOTIFICATIONS ]
                </label>
                <div className="flex items-center justify-between p-4 border border-outline-variant bg-surface-container-lowest">
                  <div>
                    <p className="font-mono text-sm text-on-surface">Enable Browser Notifications</p>
                    <p className="font-mono text-xs text-on-surface-variant mt-0.5">Task reminders, briefings, missed alerts</p>
                  </div>
                  <button
                    onClick={handleNotifToggle}
                    className={`w-12 h-6 rounded-full relative transition-all border ${
                      notificationsEnabled
                        ? 'bg-primary-container border-primary-container'
                        : 'bg-surface-container-highest border-outline-variant'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 ── First Task */}
          {step === 3 && (
            <div className="flex flex-col gap-6 stagger-2">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-label-sm text-outline uppercase tracking-widest">
                  [ FIRST_OBJECTIVE ] <span className="text-outline normal-case tracking-normal ml-1">(optional)</span>
                </label>
                <p className="font-mono text-xs text-on-surface-variant">
                  Set a first task that will appear in today's dashboard. You can skip this.
                </p>
                <div className="flex items-center border border-outline-variant bg-surface-container-lowest p-3 focus-within:border-primary-container transition-colors mt-1">
                  <span className="font-mono text-primary-container mr-2 text-sm">&gt;</span>
                  <input
                    autoFocus
                    value={firstTask}
                    onChange={e => setFirstTask(e.target.value)}
                    type="text"
                    placeholder="e.g., Plan weekly objectives..."
                    className="bg-transparent border-none outline-none font-mono text-sm text-on-surface w-full placeholder:text-outline-variant"
                    onKeyDown={e => e.key === 'Enter' && handleFinish()}
                  />
                </div>
              </div>

              {/* Preview */}
              {name && (
                <div className="border border-outline-variant p-4 bg-surface-container-lowest">
                  <p className="font-mono text-xs text-outline uppercase tracking-widest mb-2">Preview</p>
                  <p className="font-mono text-sm text-on-surface">
                    <span className="text-2xl mr-2">{selectedAvatarEmoji}</span>
                    Good morning, <span className="text-primary">{name}</span>!
                  </p>
                  <p className="font-mono text-xs text-on-surface-variant mt-1">
                    Morning briefing at {briefingTime} • Notifications {notificationsEnabled ? 'ON' : 'OFF'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-2 border-t border-outline-variant">
            {step > 1 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="font-mono text-xs text-on-surface-variant hover:text-primary border border-outline-variant px-4 py-2 hover:border-primary transition-colors uppercase tracking-widest"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {step === 3 && (
                <button
                  onClick={handleFinish}
                  className="font-mono text-xs text-on-surface-variant hover:text-primary uppercase tracking-widest px-4 py-2"
                >
                  Skip
                </button>
              )}
              <button
                onClick={step === 3 ? handleFinish : handleNext}
                disabled={step === 1 && !name.trim()}
                className="bg-primary-container text-on-primary-container font-mono text-xs uppercase tracking-widest px-6 py-2 flex items-center gap-2 hover:opacity-90 active:translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-primary-container"
              >
                {step === 3 ? 'Initialize Chronicle' : 'Continue'}
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
