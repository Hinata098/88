import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { todayStr, formatDateKey, getMonthDays } from '../../utils/dates.js';
import { PRIORITIES } from '../../data/defaults.js';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CalendarView() {
  const { tasks, setActiveSection } = useApp();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const days = useMemo(() => getMonthDays(year, month), [year, month]);

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    });
    return map;
  }, [tasks]);

  const goToPrev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const goToNext = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const todayStr_ = todayStr();

  const selectedTasks = selectedDay ? (tasksByDate[selectedDay] || []) : [];

  // Week overview (current week)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return formatDateKey(d);
  });
  const maxTasksInWeek = Math.max(1, ...weekDays.map(d => (tasksByDate[d] || []).length));

  return (
    <div className="flex flex-col gap-6">
      <div className="stagger-1">
        <h1 className="font-display text-3xl text-primary">Calendar</h1>
        <p className="font-mono text-xs text-on-surface-variant mt-1">Monthly overview & week planning</p>
      </div>

      {/* Week load overview */}
      <div className="bg-surface-container border border-outline-variant p-4 stagger-2">
        <h3 className="font-mono text-xs text-outline uppercase tracking-widest mb-3">This Week's Load</h3>
        <div className="flex items-end gap-1 h-20">
          {weekDays.map((d, i) => {
            const count = (tasksByDate[d] || []).length;
            const pct = Math.round((count / maxTasksInWeek) * 100);
            const isToday = d === todayStr_;
            return (
              <div key={d} className="flex-1 flex flex-col items-center gap-1 cursor-pointer" onClick={() => setSelectedDay(d)}>
                <div className="w-full flex flex-col justify-end" style={{ height: '60px' }}>
                  <div
                    className={`bar-chart-fill w-full transition-all duration-700 ${isToday ? 'opacity-100' : 'opacity-60'}`}
                    style={{ height: `${Math.max(4, pct)}%` }}
                  />
                </div>
                <span className={`font-mono text-[9px] uppercase ${isToday ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {DAY_NAMES[i]}
                </span>
                <span className={`font-mono text-[9px] ${count > 0 ? 'text-primary-container' : 'text-outline-variant'}`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between stagger-3">
        <button onClick={goToPrev} className="w-8 h-8 border border-outline-variant flex items-center justify-center hover:border-primary-container hover:text-primary text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined text-base">chevron_left</span>
        </button>
        <h2 className="font-display text-xl text-primary">{MONTH_NAMES[month]} {year}</h2>
        <button onClick={goToNext} className="w-8 h-8 border border-outline-variant flex items-center justify-center hover:border-primary-container hover:text-primary text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 stagger-3">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center font-mono text-[10px] text-outline uppercase tracking-widest py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 stagger-4">
        {days.map((day, i) => {
          if (!day) return <div key={`blank-${i}`} />;
          const dateKey = formatDateKey(day);
          const dayTasks = tasksByDate[dateKey] || [];
          const isToday = dateKey === todayStr_;
          const isSelected = dateKey === selectedDay;
          const done = dayTasks.filter(t => t.completed).length;

          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDay(dateKey === selectedDay ? null : dateKey)}
              className={`
                min-h-[52px] p-1.5 border text-left flex flex-col transition-all
                ${isToday ? 'border-primary-container' : isSelected ? 'border-outline' : 'border-outline-variant'}
                ${isSelected ? 'bg-surface-container' : 'bg-surface-container-low hover:bg-surface-container'}
              `}
            >
              <span className={`font-mono text-xs ${isToday ? 'text-primary-container font-bold' : 'text-on-surface'}`}>
                {day.getDate()}
              </span>
              <div className="flex flex-wrap gap-0.5 mt-1">
                {dayTasks.slice(0, 3).map(t => (
                  <div
                    key={t.id}
                    className="h-1 flex-1 min-w-[4px] max-w-[8px]"
                    style={{ background: t.completed ? '#514532' : (PRIORITIES[t.priority]?.border || '#514532') }}
                    title={t.title}
                  />
                ))}
                {dayTasks.length > 3 && (
                  <span className="font-mono text-[8px] text-outline-variant">+{dayTasks.length - 3}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected day task list */}
      {selectedDay && (
        <div className="border border-outline-variant p-4 stagger-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg text-primary">{selectedDay}</h3>
            <span className="font-mono text-xs text-on-surface-variant">{selectedTasks.length} tasks</span>
          </div>
          {selectedTasks.length === 0 ? (
            <p className="font-mono text-xs text-on-surface-variant">No tasks on this day.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedTasks.map(t => (
                <div key={t.id} className="flex items-center gap-2 p-2 bg-surface-container-lowest border border-outline-variant">
                  <div className="w-1.5 h-4 shrink-0" style={{ background: PRIORITIES[t.priority]?.border }} />
                  <span className={`font-mono text-xs flex-1 ${t.completed ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>{t.title}</span>
                  {t.time && t.time !== '--:--' && <span className="font-mono text-[10px] text-on-surface-variant">{t.time}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
