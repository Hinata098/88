import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { todayStr, getLast365Days, formatDateKey } from '../../utils/dates.js';

const TABS = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function BarChart({ data, maxValue, label }) {
  const max = maxValue || Math.max(1, ...data.map(d => d.value));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-1 h-32">
        {data.map((d, i) => {
          const pct = Math.round((d.value / max) * 100);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-default">
              <div className="w-full flex flex-col justify-end relative" style={{ height: '100px' }}>
                <div
                  className="bar-chart-fill w-full"
                  style={{ height: `${Math.max(2, pct)}%` }}
                  title={`${d.label}: ${d.value}`}
                />
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-surface-container border border-outline-variant px-1 font-mono text-[9px] text-primary hidden group-hover:block whitespace-nowrap z-10">
                  {d.value}
                </div>
              </div>
              <span className="font-mono text-[9px] text-on-surface-variant">{d.label}</span>
            </div>
          );
        })}
      </div>
      {label && <p className="font-mono text-[10px] text-outline uppercase tracking-widest text-center">{label}</p>}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-surface-container border border-outline-variant p-4 flex items-start gap-3">
      <span className="material-symbols-outlined text-2xl shrink-0" style={{ color: color || '#ffb300' }}>{icon}</span>
      <div>
        <p className="font-mono text-2xl text-primary">{value}</p>
        <p className="font-mono text-xs text-on-surface uppercase tracking-widest">{label}</p>
        {sub && <p className="font-mono text-[10px] text-on-surface-variant mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function Analytics() {
  const { tasks, habits, habitLog, entertainmentItems, xp, xpLog, levelInfo } = useApp();
  const [period, setPeriod] = useState('Weekly');

  const today = todayStr();
  const now = new Date();

  const stats = useMemo(() => {
    const allDays = getLast365Days();

    // Task completion rate
    const todayTasks = tasks.filter(t => t.date === today);
    const todayDone = todayTasks.filter(t => t.completed).length;
    const todayTotal = todayTasks.length;

    // Weekly
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return formatDateKey(d);
    });
    const weekTasks = tasks.filter(t => weekDays.includes(t.date));
    const weekDone = weekTasks.filter(t => t.completed).length;
    const weekRate = weekTasks.length ? Math.round((weekDone / weekTasks.length) * 100) : 0;

    // Streak (consecutive days with ≥1 task done)
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = formatDateKey(d);
      const dayTasks = tasks.filter(t => t.date === dateStr);
      if (dayTasks.some(t => t.completed)) streak++;
      else if (i > 0) break;
    }

    // Most productive weekday
    const weekdayScores = [0,0,0,0,0,0,0];
    const weekdayCounts = [0,0,0,0,0,0,0];
    tasks.filter(t => t.completed).forEach(t => {
      const [y,m,d] = t.date.split('-').map(Number);
      const dow = new Date(y, m-1, d).getDay();
      weekdayScores[dow]++;
    });
    tasks.forEach(t => {
      const [y,m,d] = t.date.split('-').map(Number);
      const dow = new Date(y, m-1, d).getDay();
      weekdayCounts[dow]++;
    });
    const rates = weekdayScores.map((s, i) => weekdayCounts[i] ? s / weekdayCounts[i] : 0);
    const bestDay = DAY_NAMES[rates.indexOf(Math.max(...rates))];

    // Entertainment watched
    const watchedCount = entertainmentItems.filter(i => i.watched).length;

    // Missed tasks
    const missedCount = tasks.filter(t =>
      !t.completed && t.date < today && t.date >= weekDays[0]
    ).length;

    // Habits today
    const todayHabitsDone = habits.filter(h => habitLog[`${h.id}_${today}`]).length;

    // Weekly bar data
    const weekBarData = weekDays.map((d, i) => ({
      label: DAY_NAMES[i],
      value: tasks.filter(t => t.date === d && t.completed).length,
    }));

    // XP last 7 days bar
    const xpBarData = weekDays.map((d, i) => ({
      label: DAY_NAMES[i],
      value: xpLog.filter(x => x.date === d && x.amount > 0).reduce((s, x) => s + x.amount, 0),
    }));

    // Monthly bar data
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const m = String(i + 1).padStart(2, '0');
      const y = now.getFullYear();
      const monthTasks = tasks.filter(t => t.date.startsWith(`${y}-${m}`));
      return {
        label: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
        value: monthTasks.filter(t => t.completed).length,
      };
    });

    return {
      todayDone, todayTotal, weekRate, streak, bestDay,
      watchedCount, missedCount, todayHabitsDone,
      weekBarData, xpBarData, monthlyData,
    };
  }, [tasks, habits, habitLog, entertainmentItems, xpLog, today]);

  const exportReport = () => {
    const report = {
      generated: new Date().toISOString(),
      period,
      stats: {
        taskCompletionRate: `${stats.weekRate}%`,
        currentStreak: `${stats.streak} days`,
        mostProductiveDay: stats.bestDay,
        missedTasks: stats.missedCount,
        entertainmentWatched: stats.watchedCount,
        habitsToday: `${stats.todayHabitsDone}/${habits.length}`,
        totalXP: xp,
        level: levelInfo.current.title,
      },
      xpLog: xpLog.slice(-20),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `chronicle-report-${today}.json`;
    a.click();
  };

  const getMotivation = () => {
    if (stats.weekRate >= 90) return `🔥 ${stats.weekRate}% done this week — extraordinary streak!`;
    if (stats.weekRate >= 70) return `💪 ${stats.weekRate}% done — strong performance this week!`;
    if (stats.weekRate >= 50) return `📈 ${stats.weekRate}% done — solid week, keep pushing!`;
    return `✨ ${stats.weekRate}% done — every completed task counts!`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between stagger-1">
        <div>
          <h1 className="font-display text-3xl text-primary">Analytics</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">Performance reports & progress tracking</p>
        </div>
        <button onClick={exportReport} className="font-mono text-xs uppercase tracking-widest border border-outline-variant px-3 py-2 text-on-surface-variant hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">download</span> Export
        </button>
      </div>

      {/* Motivational summary */}
      <div className="bg-surface-container border border-primary-container/30 border-l-4 border-l-primary-container p-4 stagger-2">
        <p className="font-mono text-sm text-on-surface">{getMotivation()}</p>
      </div>

      {/* Period tabs */}
      <div className="flex gap-0 border-b border-outline-variant stagger-2">
        {TABS.map(t => (
          <button key={t} onClick={() => setPeriod(t)}
            className={`font-mono text-xs uppercase tracking-widest px-4 py-2 border-b-2 transition-colors ${period === t ? 'border-primary-container text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-3">
        <StatCard icon="check_circle" label="Completion Rate" value={`${stats.weekRate}%`} sub="This week" />
        <StatCard icon="local_fire_department" label="Day Streak" value={stats.streak} sub="Consecutive days" color="#ff6b6b" />
        <StatCard icon="star" label="Best Day" value={stats.bestDay} sub="Most productive" color="#e9c349" />
        <StatCard icon="warning" label="Missed" value={stats.missedCount} sub="This week" color="#ffb4ab" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-3">
        <StatCard icon="movie" label="Watched" value={stats.watchedCount} sub="Total items" color="#d4dcff" />
        <StatCard icon="self_improvement" label="Habits Today" value={`${stats.todayHabitsDone}/${habits.length}`} sub="Completed" color="#00cc33" />
        <StatCard icon="bolt" label="Total XP" value={xp} sub={levelInfo.current.title} />
        <StatCard icon="trending_up" label="Today" value={`${stats.todayDone}/${stats.todayTotal}`} sub="Tasks done" color="#ffd79b" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger-4">
        <div className="bg-surface-container border border-outline-variant p-4">
          <h3 className="font-mono text-xs text-outline uppercase tracking-widest mb-4">Tasks Completed — This Week</h3>
          <BarChart data={stats.weekBarData} label="Tasks per day" />
        </div>
        <div className="bg-surface-container border border-outline-variant p-4">
          <h3 className="font-mono text-xs text-outline uppercase tracking-widest mb-4">XP Earned — This Week</h3>
          <BarChart data={stats.xpBarData} label="XP per day" />
        </div>
      </div>

      <div className="bg-surface-container border border-outline-variant p-4 stagger-5">
        <h3 className="font-mono text-xs text-outline uppercase tracking-widest mb-4">Tasks Completed — Monthly ({new Date().getFullYear()})</h3>
        <BarChart data={stats.monthlyData} label="Completed tasks per month" />
      </div>

      {/* XP Log */}
      <div className="bg-surface-container border border-outline-variant p-4 stagger-5">
        <h3 className="font-mono text-xs text-outline uppercase tracking-widest mb-3">Recent XP Activity</h3>
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
          {xpLog.length === 0 && <p className="font-mono text-xs text-on-surface-variant">No XP earned yet. Complete tasks to get started!</p>}
          {[...xpLog].reverse().slice(0, 15).map((x, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-outline-variant/40">
              <span className="font-mono text-xs text-on-surface-variant">{x.reason}</span>
              <span className={`font-mono text-xs font-bold ${x.amount > 0 ? 'text-primary-container' : 'text-error'}`}>
                {x.amount > 0 ? '+' : ''}{x.amount} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
