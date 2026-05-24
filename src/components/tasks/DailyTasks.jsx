import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { todayStr, addDays, formatDisplay, formatTime12, isOverdue, uid } from '../../utils/dates.js';
import { PRIORITIES } from '../../data/defaults.js';

function AddTaskModal({ onClose, defaultDate }) {
  const { addTask } = useApp();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(defaultDate || todayStr());
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('Normal');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title: title.trim(), note, date, time: time || '--:--', priority });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm modal-backdrop p-4" onClick={onClose}>
      <div className="bg-surface-container border border-outline-variant shadow-terminal-lg p-6 w-full max-w-md modal-content relative" onClick={e => e.stopPropagation()}>
        <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-primary-container" />
        <div className="absolute -top-px -right-px w-3 h-3 border-t border-r border-primary-container" />
        <div className="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-primary-container" />
        <div className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-primary-container" />

        <div className="flex justify-between items-center mb-5 border-b border-outline-variant pb-3">
          <div>
            <h2 className="font-display text-primary text-xl">Append New Task</h2>
            <p className="font-mono text-xs text-on-surface-variant">Add a new objective to your chronicle</p>
          </div>
          <button onClick={onClose}><span className="material-symbols-outlined text-on-surface-variant hover:text-primary">close</span></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-mono text-[10px] text-outline uppercase tracking-widest block mb-1.5">Task Title *</label>
            <div className="flex items-center border border-outline-variant bg-surface-container-lowest focus-within:border-primary-container p-2.5 transition-colors">
              <span className="text-primary-container font-mono text-xs mr-2">&gt;</span>
              <input autoFocus value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="What needs to be done?" required className="bg-transparent border-none outline-none font-mono text-sm text-on-surface w-full placeholder:text-outline-variant" />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] text-outline uppercase tracking-widest block mb-1.5">Note (Optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Additional context..." rows={2} className="w-full bg-surface-container-lowest border border-outline-variant p-2.5 font-mono text-sm text-on-surface focus:border-primary-container focus:outline-none resize-none placeholder:text-outline-variant" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-mono text-[10px] text-outline uppercase tracking-widest block mb-1.5">Date</label>
              <input value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full bg-surface-container-lowest border border-outline-variant p-2 font-mono text-xs text-on-surface focus:border-primary-container focus:outline-none" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-outline uppercase tracking-widest block mb-1.5">Time</label>
              <input value={time} onChange={e => setTime(e.target.value)} type="time" className="w-full bg-surface-container-lowest border border-outline-variant p-2 font-mono text-xs text-on-surface focus:border-primary-container focus:outline-none" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-outline uppercase tracking-widest block mb-1.5">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant p-2 font-mono text-xs text-on-surface focus:border-primary-container focus:outline-none appearance-none">
                <option value="High">High</option>
                <option value="Med">Medium</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant">
            <button type="button" onClick={onClose} className="font-mono text-xs uppercase tracking-widest border border-outline-variant px-4 py-2 text-on-surface-variant hover:border-primary hover:text-primary transition-colors">Cancel</button>
            <button type="submit" className="font-mono text-xs uppercase tracking-widest bg-primary-container text-on-primary-container px-6 py-2 hover:opacity-90 active:translate-y-px transition-all flex items-center gap-2 border border-primary-container">
              Execute
              <span className="material-symbols-outlined text-sm">add_task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TemplateManager({ onClose }) {
  const { weeklyTemplates, setWeeklyTemplates } = useApp();
  const [title, setTitle] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [time, setTime] = useState('09:00');
  const [priority, setPriority] = useState('Normal');
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  const addTemplate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setWeeklyTemplates(prev => [...prev, { id: uid(), title: title.trim(), dayOfWeek: Number(dayOfWeek), time, priority }]);
    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 modal-backdrop" onClick={onClose}>
      <div className="bg-surface-container border border-outline-variant shadow-terminal-lg p-6 w-full max-w-lg modal-content relative" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5 border-b border-outline-variant pb-3">
          <div>
            <h2 className="font-display text-primary text-xl">Weekly Templates</h2>
            <p className="font-mono text-xs text-on-surface-variant">Recurring tasks auto-injected each week</p>
          </div>
          <button onClick={onClose}><span className="material-symbols-outlined text-on-surface-variant hover:text-primary">close</span></button>
        </div>

        <form onSubmit={addTemplate} className="flex flex-col gap-3 mb-4">
          <div className="flex items-center border border-outline-variant bg-surface-container-lowest focus-within:border-primary-container p-2 transition-colors">
            <span className="text-primary-container font-mono text-xs mr-2">&gt;</span>
            <input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="Template task title..." required className="bg-transparent border-none outline-none font-mono text-xs text-on-surface w-full placeholder:text-outline-variant" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <select value={dayOfWeek} onChange={e => setDayOfWeek(e.target.value)} className="bg-surface-container-lowest border border-outline-variant p-2 font-mono text-xs text-on-surface focus:border-primary-container focus:outline-none appearance-none">
              {days.map((d, i) => <option key={d} value={i}>{d}</option>)}
            </select>
            <input value={time} onChange={e => setTime(e.target.value)} type="time" className="bg-surface-container-lowest border border-outline-variant p-2 font-mono text-xs text-on-surface focus:border-primary-container focus:outline-none" />
            <select value={priority} onChange={e => setPriority(e.target.value)} className="bg-surface-container-lowest border border-outline-variant p-2 font-mono text-xs text-on-surface focus:border-primary-container focus:outline-none appearance-none">
              <option value="High">High</option>
              <option value="Med">Medium</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
          <button type="submit" className="font-mono text-xs uppercase tracking-widest bg-primary-container text-on-primary-container px-4 py-2 hover:opacity-90 self-end flex items-center gap-2">
            Add Template <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </form>

        <div className="max-h-56 overflow-y-auto flex flex-col gap-1.5">
          {weeklyTemplates.length === 0 ? (
            <p className="font-mono text-xs text-on-surface-variant py-2">No templates yet.</p>
          ) : weeklyTemplates.map(t => (
            <div key={t.id} className="flex items-center justify-between p-2.5 border border-outline-variant bg-surface-container-lowest">
              <div>
                <span className="font-mono text-xs text-on-surface">{t.title}</span>
                <span className="font-mono text-[10px] text-on-surface-variant ml-2">— {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][t.dayOfWeek]} @ {t.time}</span>
              </div>
              <button onClick={() => setWeeklyTemplates(prev => prev.filter(x => x.id !== t.id))}>
                <span className="material-symbols-outlined text-sm text-on-surface-variant hover:text-error">delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  const { toggleTask, deleteTask } = useApp();
  const [expanded, setExpanded] = useState(false);
  const priority = PRIORITIES[task.priority] || PRIORITIES.Normal;
  const overdue = !task.completed && isOverdue(task.date, task.time);

  return (
    <div className={`border-l-4 bg-surface-container border border-outline-variant transition-all duration-200 hover:border-outline ${overdue ? 'border-l-error opacity-90' : ''}`}
      style={{ borderLeftColor: overdue ? '#ffb4ab' : priority.border }}>
      <div className="flex items-center gap-3 p-3">
        <button onClick={() => toggleTask(task.id)} className="shrink-0 w-5 h-5 border border-outline-variant flex items-center justify-center hover:border-primary-container transition-colors">
          {task.completed
            ? <span className="material-symbols-outlined text-sm text-primary-container" style={{fontVariationSettings:"'FILL' 1"}}>check</span>
            : <span className="w-2 h-2 bg-outline-variant" />}
        </button>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(p => !p)}>
          <span className={`font-mono text-sm ${task.completed ? 'line-through text-on-surface-variant' : overdue ? 'text-error' : 'text-on-surface'}`}>
            {task.title}
          </span>
          {(task.time && task.time !== '--:--') && (
            <span className={`font-mono text-[10px] ml-2 ${overdue ? 'text-error' : 'text-on-surface-variant'}`}>
              {overdue ? '⚠ ' : ''}{formatTime12(task.time)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border"
            style={{ borderColor: priority.border, color: priority.color }}>
            {task.priority}
          </span>
          <button onClick={() => deleteTask(task.id)}>
            <span className="material-symbols-outlined text-sm text-on-surface-variant hover:text-error">delete</span>
          </button>
        </div>
      </div>

      {expanded && task.note && (
        <div className="px-11 pb-3">
          <p className="font-mono text-xs text-on-surface-variant border-t border-outline-variant pt-2">{task.note}</p>
        </div>
      )}
    </div>
  );
}

export default function DailyTasks({ onOpenAddModal, addModalOpen, setAddModalOpen }) {
  const { tasks, user } = useApp();
  const [viewDate, setViewDate] = useState(todayStr());
  const [showTemplates, setShowTemplates] = useState(false);
  const [sortBy, setSortBy] = useState('time');

  const today = todayStr();
  const isToday = viewDate === today;

  const dayTasks = useMemo(() => {
    let t = tasks.filter(t => t.date === viewDate);
    if (sortBy === 'priority') {
      const order = { High: 0, Med: 1, Normal: 2 };
      t = t.sort((a, b) => (order[a.priority] || 2) - (order[b.priority] || 2));
    } else if (sortBy === 'time') {
      t = t.sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));
    }
    return t;
  }, [tasks, viewDate, sortBy]);

  const completed = dayTasks.filter(t => t.completed).length;
  const total = dayTasks.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Date navigation */}
      <div className="flex items-center justify-between stagger-1">
        <div>
          <h1 className="font-display text-3xl text-primary">{isToday ? "Today's Tasks" : "Tasks"}</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">{formatDisplay(viewDate)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewDate(addDays(viewDate, -1))} className="w-8 h-8 border border-outline-variant flex items-center justify-center hover:border-primary-container hover:text-primary text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>
          <button onClick={() => setViewDate(today)} className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${isToday ? 'border-primary-container text-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary'}`}>
            Today
          </button>
          <button onClick={() => setViewDate(addDays(viewDate, 1))} className="w-8 h-8 border border-outline-variant flex items-center justify-center hover:border-primary-container hover:text-primary text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3 stagger-2">
        {[
          { label: 'Total', value: total, icon: 'list' },
          { label: 'Done', value: completed, icon: 'check_circle' },
          { label: 'Complete', value: `${pct}%`, icon: 'donut_large' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container border border-outline-variant p-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary-container">{s.icon}</span>
            <div>
              <span className="font-mono text-xl text-primary">{s.value}</span>
              <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-surface-container-highest stagger-2">
        <div className="xp-bar-fill h-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 stagger-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-outline uppercase tracking-widest">Sort:</span>
          {['time', 'priority'].map(s => (
            <button key={s} onClick={() => setSortBy(s)} className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 border transition-colors ${sortBy === s ? 'border-primary-container text-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary-container'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTemplates(true)} className="font-mono text-[10px] uppercase tracking-widest border border-outline-variant px-3 py-1.5 text-on-surface-variant hover:border-primary hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">repeat</span> Templates
          </button>
          <button onClick={() => setAddModalOpen(true)} className="font-mono text-[10px] uppercase tracking-widest bg-primary-container text-on-primary-container px-3 py-1.5 hover:opacity-90 transition-all flex items-center gap-1 border border-primary-container">
            <span className="material-symbols-outlined text-xs">add</span> New Task
          </button>
        </div>
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-2 stagger-4">
        {dayTasks.length === 0 ? (
          <div className="border border-dashed border-outline-variant p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-outline-variant block mb-2">inbox</span>
            <p className="font-mono text-sm text-on-surface-variant">No tasks for this day.</p>
            <p className="font-mono text-xs text-outline mt-1">Press <kbd className="border border-outline-variant px-1 mx-1 text-primary">N</kbd> to add one.</p>
          </div>
        ) : (
          dayTasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </div>

      {/* Add task button */}
      <button
        onClick={() => setAddModalOpen(true)}
        className="w-full py-3 border border-dashed border-outline-variant font-mono text-xs text-on-surface-variant hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">add</span>
        APPEND_NEW_TASK
      </button>

      {/* Modals */}
      {addModalOpen && <AddTaskModal onClose={() => setAddModalOpen(false)} defaultDate={viewDate} />}
      {showTemplates && <TemplateManager onClose={() => setShowTemplates(false)} />}
    </div>
  );
}
