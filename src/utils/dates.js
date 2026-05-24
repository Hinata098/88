// ─── Date Utilities ──────────────────────────────────────

export function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export function formatDateKey(date) {
  if (typeof date === 'string') return date;
  return date.toISOString().split('T')[0];
}

export function parseLocalDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(dateStr, n) {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + n);
  return formatDateKey(d);
}

export function formatDisplay(dateStr) {
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatShort(dateStr) {
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getDayOfWeek(dateStr) {
  return parseLocalDate(dateStr).getDay(); // 0=Sun
}

export function getGreeting(name) {
  const h = new Date().getHours();
  const part = h < 12 ? 'morning' : h < 17 ? 'afternoon' : h < 21 ? 'evening' : 'night';
  return `Good ${part}, ${name}`;
}

export function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
}

export function isOverdue(dateStr, timeStr) {
  if (!timeStr || timeStr === '--:--') return false;
  const now = new Date();
  const today = todayStr();
  if (dateStr > today) return false;
  if (dateStr < today) return true;
  const [h, m] = timeStr.split(':').map(Number);
  const taskTime = new Date();
  taskTime.setHours(h, m, 0, 0);
  return now > taskTime;
}

export function getMonthDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = [];
  // leading blanks
  for (let i = 0; i < first.getDay(); i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export function getLast365Days() {
  const days = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(formatDateKey(d));
  }
  return days;
}

export function getWeekDays(offsetWeeks = 0) {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1 + offsetWeeks * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return formatDateKey(d);
  });
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function formatTime12(timeStr) {
  if (!timeStr || timeStr === '--:--') return '--:--';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2,'0')} ${ampm}`;
}
