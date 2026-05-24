import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { THEMES, AVATARS } from '../../data/defaults.js';

export default function Settings() {
  const {
    user, setUser,
    theme, setTheme,
    notificationsEnabled, setNotificationsEnabled,
    briefingTime, setBriefingTime,
    addToast,
  } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'owl');

  const handleSave = (e) => {
    e.preventDefault();
    setUser(prev => ({ ...prev, name, avatar }));
    addToast('Settings saved ✓', 'success');
  };

  const handleNotifToggle = async () => {
    if (!notificationsEnabled && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') { setNotificationsEnabled(true); addToast('Notifications enabled', 'success'); }
      else addToast('Notification permission denied', 'error');
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Clear ALL Chronicle data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div className="stagger-1">
        <h1 className="font-display text-3xl text-primary">Settings</h1>
        <p className="font-mono text-xs text-on-surface-variant mt-1">Personalization & preferences</p>
      </div>

      {/* Profile */}
      <form onSubmit={handleSave} className="bg-surface-container border border-outline-variant p-4 flex flex-col gap-4 stagger-2">
        <h2 className="font-mono text-xs text-outline uppercase tracking-widest border-b border-outline-variant pb-2">Profile</h2>

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] text-outline uppercase tracking-widest">Display Name</label>
          <div className="flex items-center border border-outline-variant bg-surface-container-lowest focus-within:border-primary-container p-2.5">
            <span className="text-primary-container font-mono text-xs mr-2">&gt;</span>
            <input value={name} onChange={e => setName(e.target.value)} type="text"
              className="bg-transparent border-none outline-none font-mono text-sm text-on-surface w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] text-outline uppercase tracking-widest">Avatar</label>
          <div className="grid grid-cols-5 gap-2">
            {AVATARS.map(a => (
              <button key={a.id} type="button" onClick={() => setAvatar(a.id)}
                className={`aspect-square border flex items-center justify-center text-xl transition-all ${avatar === a.id ? 'border-primary-container bg-surface-container-highest' : 'border-outline-variant hover:border-outline'}`}>
                {a.emoji}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="font-mono text-xs uppercase tracking-widest bg-primary-container text-on-primary-container px-4 py-2 border border-primary-container hover:opacity-90 self-end">
          Save Profile
        </button>
      </form>

      {/* Theme */}
      <div className="bg-surface-container border border-outline-variant p-4 flex flex-col gap-3 stagger-3">
        <h2 className="font-mono text-xs text-outline uppercase tracking-widest border-b border-outline-variant pb-2">Theme</h2>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map(t => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className={`flex items-center gap-3 p-3 border text-left transition-colors ${theme === t.id ? 'border-primary-container bg-surface-container-highest' : 'border-outline-variant hover:border-outline'}`}>
              <div className="flex flex-col flex-1">
                <span className="font-mono text-xs text-on-surface">{t.label}</span>
                <span className="font-mono text-[10px] text-on-surface-variant">{t.desc}</span>
              </div>
              {theme === t.id && <span className="material-symbols-outlined text-sm text-primary-container">check</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-surface-container border border-outline-variant p-4 flex flex-col gap-3 stagger-4">
        <h2 className="font-mono text-xs text-outline uppercase tracking-widest border-b border-outline-variant pb-2">Notifications</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-sm text-on-surface">Browser Notifications</p>
            <p className="font-mono text-xs text-on-surface-variant">Task reminders, daily briefing, missed alerts</p>
          </div>
          <button onClick={handleNotifToggle}
            className={`w-12 h-6 rounded-full relative transition-all border ${notificationsEnabled ? 'bg-primary-container border-primary-container' : 'bg-surface-container-highest border-outline-variant'}`}>
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] text-outline uppercase tracking-widest">Morning Briefing Time</label>
          <input type="time" value={briefingTime} onChange={e => setBriefingTime(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant p-2.5 font-mono text-sm text-on-surface focus:border-primary-container focus:outline-none w-full" />
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-surface-container border border-error/30 p-4 flex flex-col gap-3 stagger-5">
        <h2 className="font-mono text-xs text-error uppercase tracking-widest border-b border-outline-variant pb-2">Danger Zone</h2>
        <p className="font-mono text-xs text-on-surface-variant">Clearing all data will reset Chronicle to its initial state. This action cannot be undone.</p>
        <button onClick={handleClearData}
          className="font-mono text-xs uppercase tracking-widest border border-error text-error px-4 py-2 hover:bg-error hover:text-background transition-colors self-start">
          Clear All Data
        </button>
      </div>
    </div>
  );
}
