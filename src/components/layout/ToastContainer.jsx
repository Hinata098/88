import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

const ICONS = {
  error:   { icon: 'warning',    color: 'text-error',           border: 'border-error' },
  warning: { icon: 'alarm',      color: 'text-primary-container', border: 'border-primary-container' },
  success: { icon: 'check_circle', color: 'text-secondary',      border: 'border-secondary' },
  info:    { icon: 'info',       color: 'text-primary',          border: 'border-primary' },
};

export default function ToastContainer() {
  const { toasts, dismissToast, toggleTask, tasks } = useApp();

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-[200] flex flex-col gap-2 w-[calc(100%-32px)] md:w-auto max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const style = ICONS[toast.type] || ICONS.info;
        return (
          <div
            key={toast.id}
            className={`
              bg-surface-container border-l-4 shadow-terminal p-3 pointer-events-auto
              ${toast.exiting ? 'toast-out' : 'toast-in'}
              ${style.border}
            `}
          >
            <div className="flex items-start gap-3">
              <span
                className={`material-symbols-outlined text-xl shrink-0 mt-0.5 ${style.color}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {style.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`font-mono text-[10px] uppercase tracking-widest font-bold mb-0.5 ${style.color}`}>
                  sys_alert // {toast.type}
                </p>
                <p className="font-mono text-xs text-on-surface leading-relaxed">{toast.message}</p>

                {/* Actions */}
                {toast.actions && (
                  <div className="flex gap-2 mt-2">
                    {toast.actions.map(action => (
                      <button
                        key={action.label}
                        onClick={() => { action.onClick(); dismissToast(toast.id); }}
                        className="font-mono text-[10px] uppercase tracking-widest border border-outline-variant px-2 py-1 hover:border-primary hover:text-primary transition-colors text-on-surface-variant"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-on-surface-variant hover:text-primary shrink-0"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
