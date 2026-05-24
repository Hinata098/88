import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { todayStr, getLast365Days, uid } from '../../utils/dates.js';
import { getGoalUrgencyColor } from '../../data/defaults.js';

// ── Heatmap Calendar ───────────────────────────────────
function HeatmapCalendar({ habitLog, habits }) {
  const days = getLast365Days();
  const weeks = [];
  let week = [];
  // Pad start
  const firstDay = new Date(days[0]);
  for (let i = 0; i < firstDay.getDay(); i++) week.push(null);
  days.forEach(day => {
    week.push(day);
    if (week.length === 7) { weeks.push(week); week = []; }
  });
  if (week.length) weeks.push(week);

  const getIntensity = (day) => {
    if (!day) return -1;
    const count = habits.filter(h => habitLog[`${h.id}_${day}`]).length;
    if (count === 0) return 0;
    if (count < habits.length * 0.25) return 1;
    if (count < habits.length * 0.5) return 2;
    if (count < habits.length * 0.75) return 3;
    return 4;
  };

  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {weeks.map((w, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {w.map((day, di) => {
            const intensity = getIntensity(day);
            return (
              <div key={di}
                className={`heatmap-cell ${intensity < 0 ? 'invisible' : `heatmap-${intensity}`}`}
                title={day ? `${day}: ${habits.filter(h => habitLog[`${h.id}_${day}`]).length}/${habits.length} habits` : ''}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Progress Ring ──────────────────────────────────────
function ProgressRing({ pct, size = 80, stroke = 6 }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#353437" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#ffb300" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        className="progress-ring-circle" strokeLinecap="square" />
      <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill="#ffd79b" fontSize={size * 0.22} fontFamily="JetBrains Mono" fontWeight="bold">
        {pct}%
      </text>
    </svg>
  );
}

// ── Habit Card ─────────────────────────────────────────
function HabitCard({ habit }) {
  const { habitLog, toggleHabit, deleteHabit } = useApp();
  const today = todayStr();
  const isDone = habitLog[`${habit.id}_${today}`];

  // Calculate streak
  const streak = useMemo(() => {
    let s = 0;
    const now = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${habit.id}_${d.toISOString().split('T')[0]}`;
      if (habitLog[key]) s++;
      else if (i > 0) break;
    }
    return s;
  }, [habitLog, habit.id]);

  return (
    <div className={`flex items-center justify-between p-3 border transition-all ${isDone ? 'border-primary-container bg-surface-container' : 'border-outline-variant bg-surface-container-low hover:border-outline'}`}>
      <div className="flex items-center gap-3">
        <button onClick={() => toggleHabit(habit.id, today)}
          className={`w-6 h-6 border-2 flex items-center justify-center transition-all ${isDone ? 'border-primary-container bg-primary-container' : 'border-outline-variant hover:border-primary-container'}`}>
          {isDone && <span className="material-symbols-outlined text-xs text-on-primary-container" style={{fontVariationSettings:"'FILL' 1"}}>check</span>}
        </button>
        <div>
          <span className="font-mono text-sm text-on-surface">{habit.emoji} {habit.name}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-[10px] text-primary-container">🔥 {streak} day streak</span>
          </div>
        </div>
      </div>
      <button onClick={() => deleteHabit(habit.id)}>
        <span className="material-symbols-outlined text-sm text-on-surface-variant hover:text-error">delete</span>
      </button>
    </div>
  );
}

// ── Goal Card ──────────────────────────────────────────
function GoalCard({ goal }) {
  const { addSubtask, toggleSubtask, deleteGoal } = useApp();
  const [newSub, setNewSub] = useState('');

  const done = goal.subtasks.filter(s => s.done).length;
  const total = goal.subtasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const urgencyColor = getGoalUrgencyColor(goal.deadline);

  const handleAddSub = (e) => {
    e.preventDefault();
    if (!newSub.trim()) return;
    addSubtask(goal.id, newSub.trim());
    setNewSub('');
  };

  return (
    <div className="bg-surface-container border border-outline-variant p-4" style={{ borderTopColor: urgencyColor, borderTopWidth: '2px' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-display text-lg text-primary">{goal.title}</h3>
          {goal.deadline && (
            <span className="font-mono text-[10px] mt-0.5 block" style={{ color: urgencyColor }}>
              ⏰ Due: {goal.deadline}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ProgressRing pct={pct} size={64} stroke={5} />
          <button onClick={() => deleteGoal(goal.id)}>
            <span className="material-symbols-outlined text-sm text-on-surface-variant hover:text-error">delete</span>
          </button>
        </div>
      </div>

      {/* Subtasks */}
      <div className="flex flex-col gap-1.5 mb-3">
        {goal.subtasks.map(s => (
          <div key={s.id} className="flex items-center gap-2">
            <button onClick={() => toggleSubtask(goal.id, s.id)}
              className={`w-4 h-4 border flex items-center justify-center shrink-0 ${s.done ? 'border-primary-container bg-primary-container' : 'border-outline-variant hover:border-primary-container'}`}>
              {s.done && <span className="material-symbols-outlined text-[10px] text-on-primary-container" style={{fontVariationSettings:"'FILL' 1"}}>check</span>}
            </button>
            <span className={`font-mono text-xs ${s.done ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>{s.title}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddSub} className="flex gap-2">
        <div className="flex-1 flex items-center border border-outline-variant bg-surface-container-lowest focus-within:border-primary-container p-1.5">
          <span className="text-outline font-mono text-xs mr-1.5">+</span>
          <input value={newSub} onChange={e => setNewSub(e.target.value)} type="text" placeholder="Add subtask..." className="bg-transparent border-none outline-none font-mono text-xs text-on-surface w-full placeholder:text-outline-variant" />
        </div>
        <button type="submit" className="font-mono text-[10px] uppercase tracking-widest border border-outline-variant px-2 hover:border-primary hover:text-primary text-on-surface-variant transition-colors">Add</button>
      </form>
    </div>
  );
}

export default function HabitsGoals() {
  const { habits, addHabit, habitLog, goals, addGoal } = useApp();
  const [activeTab, setActiveTab] = useState('habits');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitEmoji, setHabitEmoji] = useState('✅');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

  const today = todayStr();
  const todayDone = habits.filter(h => habitLog[`${h.id}_${today}`]).length;

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!habitName.trim()) return;
    addHabit({ name: habitName.trim(), emoji: habitEmoji });
    setHabitName(''); setHabitEmoji('✅'); setShowAddHabit(false);
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    addGoal({ title: goalTitle.trim(), deadline: goalDeadline });
    setGoalTitle(''); setGoalDeadline(''); setShowAddGoal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between stagger-1">
        <div>
          <h1 className="font-display text-3xl text-primary">Habits & Goals</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">{todayDone}/{habits.length} habits completed today · {goals.length} active goals</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 stagger-2 border-b border-outline-variant">
        {['habits', 'goals', 'heatmap'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`font-mono text-xs uppercase tracking-widest px-4 py-2 border-b-2 transition-colors ${activeTab === tab ? 'border-primary-container text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Habits tab */}
      {activeTab === 'habits' && (
        <div className="flex flex-col gap-4 stagger-3">
          <div className="flex justify-end">
            <button onClick={() => setShowAddHabit(p => !p)} className="font-mono text-xs uppercase tracking-widest bg-primary-container text-on-primary-container px-4 py-2 hover:opacity-90 border border-primary-container flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span> New Habit
            </button>
          </div>

          {showAddHabit && (
            <form onSubmit={handleAddHabit} className="flex gap-2 p-3 border border-outline-variant bg-surface-container">
              <input value={habitEmoji} onChange={e => setHabitEmoji(e.target.value)} type="text" maxLength={2} className="w-10 bg-surface-container-lowest border border-outline-variant p-1.5 font-mono text-sm text-on-surface text-center focus:border-primary-container focus:outline-none" placeholder="✅" />
              <div className="flex-1 flex items-center border border-outline-variant bg-surface-container-lowest focus-within:border-primary-container p-2">
                <span className="text-primary-container font-mono text-xs mr-2">&gt;</span>
                <input autoFocus value={habitName} onChange={e => setHabitName(e.target.value)} type="text" required placeholder="Habit name..." className="bg-transparent border-none outline-none font-mono text-xs text-on-surface w-full placeholder:text-outline-variant" />
              </div>
              <button type="submit" className="font-mono text-xs bg-primary-container text-on-primary-container px-3 border border-primary-container">Add</button>
            </form>
          )}

          {habits.length === 0 ? (
            <div className="border border-dashed border-outline-variant p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-outline-variant block mb-2">self_improvement</span>
              <p className="font-mono text-sm text-on-surface-variant">No habits defined yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {habits.map(h => <HabitCard key={h.id} habit={h} />)}
            </div>
          )}
        </div>
      )}

      {/* Goals tab */}
      {activeTab === 'goals' && (
        <div className="flex flex-col gap-4 stagger-3">
          <div className="flex justify-end">
            <button onClick={() => setShowAddGoal(p => !p)} className="font-mono text-xs uppercase tracking-widest bg-primary-container text-on-primary-container px-4 py-2 hover:opacity-90 border border-primary-container flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span> New Goal
            </button>
          </div>

          {showAddGoal && (
            <form onSubmit={handleAddGoal} className="flex flex-col gap-3 p-4 border border-outline-variant bg-surface-container">
              <div className="flex items-center border border-outline-variant bg-surface-container-lowest focus-within:border-primary-container p-2.5">
                <span className="text-primary-container font-mono text-xs mr-2">&gt;</span>
                <input autoFocus value={goalTitle} onChange={e => setGoalTitle(e.target.value)} required type="text" placeholder="Goal title..." className="bg-transparent border-none outline-none font-mono text-sm text-on-surface w-full placeholder:text-outline-variant" />
              </div>
              <div className="flex gap-2">
                <input value={goalDeadline} onChange={e => setGoalDeadline(e.target.value)} type="date" className="flex-1 bg-surface-container-lowest border border-outline-variant p-2 font-mono text-xs text-on-surface focus:border-primary-container focus:outline-none" />
                <button type="submit" className="font-mono text-xs bg-primary-container text-on-primary-container px-4 border border-primary-container">Create Goal</button>
              </div>
            </form>
          )}

          {goals.length === 0 ? (
            <div className="border border-dashed border-outline-variant p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-outline-variant block mb-2">flag</span>
              <p className="font-mono text-sm text-on-surface-variant">No goals set yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {goals.map(g => <GoalCard key={g.id} goal={g} />)}
            </div>
          )}
        </div>
      )}

      {/* Heatmap tab */}
      {activeTab === 'heatmap' && (
        <div className="flex flex-col gap-4 stagger-3">
          <div className="bg-surface-container border border-outline-variant p-4">
            <h3 className="font-display text-lg text-primary mb-1">Habit Activity — Last 365 Days</h3>
            <p className="font-mono text-xs text-on-surface-variant mb-4">Color intensity = habits completed that day</p>
            <HeatmapCalendar habitLog={habitLog} habits={habits} />
            <div className="flex items-center gap-2 mt-3">
              <span className="font-mono text-[10px] text-outline">Less</span>
              {[0,1,2,3,4].map(i => (
                <div key={i} className={`heatmap-cell heatmap-${i}`} />
              ))}
              <span className="font-mono text-[10px] text-outline">More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
