import { useState, useCallback } from 'react';
import { uid } from '../utils/dates.js';

export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 6000, actions = null) => {
    const id = uid();
    setToasts(prev => [...prev.slice(-4), { id, message, type, duration, actions, exiting: false }]);
    if (duration > 0) {
      setTimeout(() => dismissToast(id), duration);
    }
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 350);
  }, []);

  return { toasts, addToast, dismissToast };
}
