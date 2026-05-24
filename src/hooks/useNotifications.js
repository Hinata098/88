import { useEffect, useRef, useCallback } from 'react';

export function useNotifications({ tasks, entertainmentItems, user, briefingTime, addToast }) {
  const notifiedRef = useRef(new Set());
  const missedRef = useRef(new Set());

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }
    return Notification.permission;
  }, []);

  const sendBrowserNotification = useCallback((title, body, tag) => {
    if (Notification.permission !== 'granted') return;
    try {
      new Notification(title, { body, tag, icon: '/favicon.ico' });
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hh}:${mm}`;

      // ── Morning briefing ──────────────────────────────
      if (briefingTime && currentTime === briefingTime) {
        const key = `briefing-${todayStr}`;
        if (!notifiedRef.current.has(key)) {
          notifiedRef.current.add(key);
          const todayTasks = (tasks || []).filter(t => t.date === todayStr);
          const todayMedia = (entertainmentItems || []).filter(i => !i.watched);
          sendBrowserNotification(
            `🌅 Good morning, ${user.name}!`,
            `Today: ${todayTasks.length} tasks, ${todayMedia.length} shows in queue`
          );
          addToast(`🌅 Morning briefing: ${todayTasks.length} tasks today!`, 'info', 8000);
        }
      }

      // ── 11 PM daily summary ──────────────────────────
      if (currentTime === '23:00') {
        const key = `summary-${todayStr}`;
        if (!notifiedRef.current.has(key)) {
          notifiedRef.current.add(key);
          const todayTasks = (tasks || []).filter(t => t.date === todayStr);
          const done = todayTasks.filter(t => t.completed).length;
          const total = todayTasks.length;
          sendBrowserNotification(
            '📋 Daily Summary',
            `${done}/${total} tasks completed. Keep it up!`
          );
        }
      }

      // ── 5-min pre-task reminder ───────────────────────
      const [ch, cm] = currentTime.split(':').map(Number);
      const fiveMinLater = `${String(ch).padStart(2,'0')}:${String(cm + 5).padStart(2,'0')}`;
      
      (tasks || []).forEach(task => {
        if (task.date !== todayStr || task.completed || !task.time || task.time === '--:--') return;
        if (task.time === fiveMinLater) {
          const key = `pre-${task.id}-${todayStr}`;
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key);
            sendBrowserNotification('⏰ Starting in 5 min', task.title || task.text);
            addToast(`⏰ Starting in 5 min: ${task.title || task.text}`, 'warning', 8000);
          }
        }
      });

      // ── Missed task alerts ───────────────────────────
      (tasks || []).forEach(task => {
        if (task.date !== todayStr || task.completed || !task.time || task.time === '--:--') return;
        if (task.time < currentTime) {
          const key = `missed-${task.id}-${todayStr}`;
          if (!missedRef.current.has(key)) {
            missedRef.current.add(key);
            addToast(`❌ Missed: ${task.title || task.text} — ${task.time}`, 'error', 0);
          }
        }
      });
    }, 60_000);

    return () => clearInterval(interval);
  }, [tasks, entertainmentItems, user, briefingTime, addToast, sendBrowserNotification]);

  return { requestPermission, sendBrowserNotification };
}
