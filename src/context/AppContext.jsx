import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useToasts } from '../hooks/useToasts.js';
import { todayStr, uid, getDayOfWeek } from '../utils/dates.js';
import { QUOTES, XP_REWARDS, getLevelInfo } from '../data/defaults.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── User & Onboarding ─────────────────────────────────
  const [user, setUser] = useLocalStorage('ch_user', null);
  const [onboardingDone, setOnboardingDone] = useLocalStorage('ch_onboarding', false);
  const [theme, setTheme] = useLocalStorage('ch_theme', 'dark-amber');
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('ch_notif', false);
  const [briefingTime, setBriefingTime] = useLocalStorage('ch_briefing', '08:00');

  // ── Tasks ─────────────────────────────────────────────
  const [tasks, setTasks] = useLocalStorage('ch_tasks', []);
  const [weeklyTemplates, setWeeklyTemplates] = useLocalStorage('ch_templates', []);
  const [lastTemplateInjection, setLastTemplateInjection] = useLocalStorage('ch_last_inject', '');

  // ── Entertainment ─────────────────────────────────────
  const [entertainmentItems, setEntertainmentItems] = useLocalStorage('ch_entertainment', []);
  const [watchQueue, setWatchQueue] = useLocalStorage('ch_queue', []);
  const [watchSchedule, setWatchSchedule] = useLocalStorage('ch_watch_schedule', '20:00');

  // ── Habits & Goals ────────────────────────────────────
  const [habits, setHabits] = useLocalStorage('ch_habits', []);
  const [habitLog, setHabitLog] = useLocalStorage('ch_habit_log', {});
  const [goals, setGoals] = useLocalStorage('ch_goals', []);

  // ── XP / Gamification ────────────────────────────────
  const [xp, setXp] = useLocalStorage('ch_xp', 0);
  const [xpLog, setXpLog] = useLocalStorage('ch_xp_log', []);
  const [notificationLog, setNotificationLog] = useLocalStorage('ch_notif_log', []);

  // ── Notes ─────────────────────────────────────────────
  const [lists, setLists] = useLocalStorage('ch_lists', [
    { id: uid(), name: 'Grocery', items: [] },
    { id: uid(), name: 'Ideas', items: [] },
  ]);

  // ── UI State ──────────────────────────────────────────
  const [activeSection, setActiveSection] = useLocalStorage('ch_section', 'tasks');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showNotifLog, setShowNotifLog] = useState(false);

  // ── Toasts ────────────────────────────────────────────
  const { toasts, addToast, dismissToast } = useToasts();

  // ── Daily Quote ───────────────────────────────────────
  const [dailyQuote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  // ── Theme Application ─────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark-amber' ? '' : theme);
    document.documentElement.classList.toggle('dark', theme !== 'arctic' && theme !== 'rose');
  }, [theme]);

  // ── Weekly Template Auto-Injection ────────────────────
  useEffect(() => {
    const today = todayStr();
    if (lastTemplateInjection === today || !weeklyTemplates.length) return;
    const dayOfWeek = getDayOfWeek(today); // 0=Sun
    const todayTemplates = weeklyTemplates.filter(t => t.dayOfWeek === dayOfWeek);
    if (!todayTemplates.length) return;

    const existingTitles = tasks.filter(t => t.date === today).map(t => t.title);
    const newTasks = todayTemplates
      .filter(t => !existingTitles.includes(t.title))
      .map(t => ({
        id: uid(),
        title: t.title,
        date: today,
        time: t.time || '--:--',
        priority: t.priority || 'Normal',
        completed: false,
        note: '',
        fromTemplate: true,
        createdAt: Date.now(),
      }));

    if (newTasks.length) {
      setTasks(prev => [...prev, ...newTasks]);
      addToast(`📋 ${newTasks.length} recurring task(s) added for today`, 'info');
    }
    setLastTemplateInjection(today);
  }, [weeklyTemplates]);

  // ── XP System ─────────────────────────────────────────
  const awardXP = useCallback((amount, reason) => {
    setXp(prev => Math.max(0, prev + amount));
    setXpLog(prev => [...prev.slice(-99), {
      amount,
      reason,
      date: todayStr(),
      ts: Date.now(),
    }]);
  }, [setXp, setXpLog]);

  // ── Task Actions ──────────────────────────────────────
  const addTask = useCallback((taskData) => {
    const task = {
      id: uid(),
      title: taskData.title,
      note: taskData.note || '',
      date: taskData.date || todayStr(),
      time: taskData.time || '--:--',
      priority: taskData.priority || 'Normal',
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [...prev, task]);
    return task;
  }, [setTasks]);

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nowDone = !t.completed;
      if (nowDone) awardXP(XP_REWARDS.taskOnTime, 'Task completed');
      else awardXP(-XP_REWARDS.taskOnTime, 'Task uncompleted');
      return { ...t, completed: nowDone, completedAt: nowDone ? Date.now() : null };
    }));
  }, [setTasks, awardXP]);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, [setTasks]);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [setTasks]);

  // ── Habit Actions ─────────────────────────────────────
  const addHabit = useCallback((habit) => {
    setHabits(prev => [...prev, { id: uid(), ...habit, createdAt: Date.now() }]);
  }, [setHabits]);

  const toggleHabit = useCallback((habitId, date) => {
    const key = `${habitId}_${date}`;
    setHabitLog(prev => {
      const isDone = prev[key];
      if (!isDone) awardXP(XP_REWARDS.habitComplete, 'Habit completed');
      return { ...prev, [key]: !isDone };
    });
  }, [setHabitLog, awardXP]);

  const deleteHabit = useCallback((id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, [setHabits]);

  // ── Goal Actions ──────────────────────────────────────
  const addGoal = useCallback((goalData) => {
    setGoals(prev => [...prev, {
      id: uid(),
      title: goalData.title,
      deadline: goalData.deadline || '',
      subtasks: [],
      createdAt: Date.now(),
    }]);
  }, [setGoals]);

  const toggleSubtask = useCallback((goalId, subtaskId) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const updated = g.subtasks.map(s =>
        s.id === subtaskId ? { ...s, done: !s.done } : s
      );
      const allDone = updated.length > 0 && updated.every(s => s.done);
      if (allDone && !g.subtasks.every(s => s.done)) {
        awardXP(XP_REWARDS.goalComplete, 'Goal completed!');
        addToast('🎉 Goal completed! +50 XP', 'success');
      }
      return { ...g, subtasks: updated };
    }));
  }, [setGoals, awardXP, addToast]);

  const addSubtask = useCallback((goalId, title) => {
    setGoals(prev => prev.map(g =>
      g.id === goalId
        ? { ...g, subtasks: [...g.subtasks, { id: uid(), title, done: false }] }
        : g
    ));
  }, [setGoals]);

  const deleteGoal = useCallback((id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, [setGoals]);

  // ── Entertainment Actions ─────────────────────────────
  const addEntertainmentItem = useCallback((item) => {
    setEntertainmentItems(prev => [...prev, {
      id: uid(),
      title: item.title,
      type: item.type || 'Series',
      episode: item.episode || 1,
      airTime: item.airTime || '',
      dayOfWeek: item.dayOfWeek ?? -1,
      watched: false,
      rating: 0,
      totalHours: 0,
      createdAt: Date.now(),
    }]);
  }, [setEntertainmentItems]);

  const toggleWatched = useCallback((id) => {
    setEntertainmentItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const nowWatched = !item.watched;
      const newEp = nowWatched ? item.episode + 1 : item.episode;
      return { ...item, watched: nowWatched, episode: newEp, watchedAt: Date.now() };
    }));
  }, [setEntertainmentItems]);

  const rateItem = useCallback((id, rating) => {
    setEntertainmentItems(prev => prev.map(item =>
      item.id === id ? { ...item, rating } : item
    ));
  }, [setEntertainmentItems]);

  const deleteEntertainmentItem = useCallback((id) => {
    setEntertainmentItems(prev => prev.filter(i => i.id !== id));
  }, [setEntertainmentItems]);

  // ── Notes Actions ─────────────────────────────────────
  const addList = useCallback((name) => {
    setLists(prev => [...prev, { id: uid(), name, items: [] }]);
  }, [setLists]);

  const addListItem = useCallback((listId, text) => {
    setLists(prev => prev.map(l =>
      l.id === listId
        ? { ...l, items: [...l.items, { id: uid(), text, done: false }] }
        : l
    ));
  }, [setLists]);

  const toggleListItem = useCallback((listId, itemId) => {
    setLists(prev => prev.map(l =>
      l.id === listId
        ? { ...l, items: l.items.map(i => i.id === itemId ? { ...i, done: !i.done } : i) }
        : l
    ));
  }, [setLists]);

  const deleteListItem = useCallback((listId, itemId) => {
    setLists(prev => prev.map(l =>
      l.id === listId ? { ...l, items: l.items.filter(i => i.id !== itemId) } : l
    ));
  }, [setLists]);

  const deleteList = useCallback((id) => {
    setLists(prev => prev.filter(l => l.id !== id));
  }, [setLists]);

  const renameList = useCallback((id, name) => {
    setLists(prev => prev.map(l => l.id === id ? { ...l, name } : l));
  }, [setLists]);

  // ── Notification Log ──────────────────────────────────
  const logNotification = useCallback((msg, type) => {
    setNotificationLog(prev => [
      ...prev.slice(-49),
      { id: uid(), msg, type, ts: Date.now() }
    ]);
  }, [setNotificationLog]);

  // ── Complete Onboarding ───────────────────────────────
  const completeOnboarding = useCallback((userData) => {
    setUser(userData);
    setBriefingTime(userData.briefingTime || '08:00');
    setNotificationsEnabled(userData.notificationsEnabled || false);
    setOnboardingDone(true);
    if (userData.firstTask) {
      addTask({ title: userData.firstTask, date: todayStr() });
    }
    addToast(`Welcome to Chronicle, ${userData.name}! 🎉`, 'success');
  }, [setUser, setBriefingTime, setNotificationsEnabled, setOnboardingDone, addTask, addToast]);

  const levelInfo = getLevelInfo(xp);

  const missedTaskCount = tasks.filter(t => {
    const today = todayStr();
    if (t.date !== today || t.completed || !t.time || t.time === '--:--') return false;
    return t.time < `${String(new Date().getHours()).padStart(2,'0')}:${String(new Date().getMinutes()).padStart(2,'0')}`;
  }).length;

  const value = {
    // User
    user, setUser, onboardingDone, completeOnboarding,
    theme, setTheme,
    notificationsEnabled, setNotificationsEnabled,
    briefingTime, setBriefingTime,
    // Tasks
    tasks, addTask, toggleTask, deleteTask, updateTask,
    weeklyTemplates, setWeeklyTemplates,
    // Entertainment
    entertainmentItems, addEntertainmentItem, toggleWatched, rateItem, deleteEntertainmentItem,
    watchQueue, setWatchQueue, watchSchedule, setWatchSchedule,
    // Habits & Goals
    habits, addHabit, deleteHabit,
    habitLog, toggleHabit,
    goals, addGoal, deleteGoal, addSubtask, toggleSubtask,
    // XP
    xp, awardXP, xpLog, levelInfo,
    // Notes
    lists, addList, addListItem, toggleListItem, deleteListItem, deleteList, renameList,
    // UI
    activeSection, setActiveSection,
    showKeyboardHelp, setShowKeyboardHelp,
    showNotifLog, setShowNotifLog,
    toasts, addToast, dismissToast,
    notificationLog, logNotification,
    dailyQuote,
    missedTaskCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
