// ─── Motivational Quotes ─────────────────────────────────
export const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Excellence is not a destination but a continuous journey.", author: "Brian Tracy" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Small deeds done are better than great deeds planned.", author: "Peter Marshall" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Augusta F. Kantra" },
];

// ─── XP Levels ─────────────────────────────────────────
export const LEVELS = [
  { level: 1, title: "Initiate",        xpRequired: 0 },
  { level: 2, title: "Apprentice",      xpRequired: 100 },
  { level: 3, title: "Practitioner",    xpRequired: 250 },
  { level: 4, title: "Focused Mind",    xpRequired: 500 },
  { level: 5, title: "Chronicle Keeper",xpRequired: 800 },
  { level: 6, title: "Momentum Builder",xpRequired: 1200 },
  { level: 7, title: "Productive Soul 🔥", xpRequired: 1700 },
  { level: 8, title: "Flow State",      xpRequired: 2400 },
  { level: 9, title: "Apex Performer",  xpRequired: 3200 },
  { level: 10, title: "Chronicle Master ⚡", xpRequired: 4200 },
];

export function getLevelInfo(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
    }
  }
  const xpIntoLevel = next ? xp - current.xpRequired : 0;
  const xpNeeded = next ? next.xpRequired - current.xpRequired : 1;
  const progress = next ? Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)) : 100;
  return { current, next, progress, xpIntoLevel, xpNeeded };
}

// ─── Avatar Options ─────────────────────────────────────
export const AVATARS = [
  { id: 'owl',   emoji: '🦉', label: 'Owl' },
  { id: 'fox',   emoji: '🦊', label: 'Fox' },
  { id: 'wolf',  emoji: '🐺', label: 'Wolf' },
  { id: 'bear',  emoji: '🐻', label: 'Bear' },
  { id: 'eagle', emoji: '🦅', label: 'Eagle' },
  { id: 'cat',   emoji: '🐱', label: 'Cat' },
  { id: 'lion',  emoji: '🦁', label: 'Lion' },
  { id: 'dragon',emoji: '🐉', label: 'Dragon' },
  { id: 'phoenix',emoji:'🔥', label: 'Phoenix' },
  { id: 'star',  emoji: '⭐', label: 'Star' },
];

// ─── Themes ─────────────────────────────────────────────
export const THEMES = [
  { id: 'dark-amber',   label: '🌑 Dark Amber',    desc: 'Charcoal + Gold (Default)' },
  { id: 'arctic',       label: '🌨️ Arctic Minimal', desc: 'White + Steel Blue' },
  { id: 'rose',         label: '🌸 Rose Editorial', desc: 'Blush + Burgundy' },
  { id: 'terminal',     label: '💻 Terminal Green', desc: 'Pure Black + Neon' },
];

// ─── Default Habit Suggestions ─────────────────────────
export const DEFAULT_HABITS = [
  { id: 'h1', name: 'Drink Water (8 glasses)', emoji: '💧', color: '#4a7fc1' },
  { id: 'h2', name: 'Exercise / Move', emoji: '🏃', color: '#ffb300' },
  { id: 'h3', name: 'Read for 20 min', emoji: '📚', color: '#c9436e' },
  { id: 'h4', name: 'Meditate', emoji: '🧘', color: '#00cc33' },
];

// ─── Day Names ───────────────────────────────────────────
export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── Priority Config ─────────────────────────────────────
export const PRIORITIES = {
  High:   { label: 'High',   color: '#ffb4ab', bg: 'rgba(255,180,171,0.1)', border: '#ffb4ab' },
  Med:    { label: 'Medium', color: '#ffb300', bg: 'rgba(255,179,0,0.1)',   border: '#ffb300' },
  Normal: { label: 'Normal', color: '#9e8e78', bg: 'rgba(158,142,120,0.1)', border: '#514532' },
};

// ─── Entertainment Types ─────────────────────────────────
export const MEDIA_TYPES = ['Movie', 'Anime', 'Series', 'Documentary', 'Short Film'];

// ─── Goal Color Coding ───────────────────────────────────
export function getGoalUrgencyColor(deadline) {
  if (!deadline) return '#9e8e78';
  const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0)  return '#ffb4ab';  // overdue
  if (days < 3)  return '#ff6b6b';  // critical
  if (days < 7)  return '#ffb300';  // urgent
  if (days < 30) return '#e9c349';  // soon
  return '#9e8e78';                  // relaxed
}

// ─── XP Rewards ─────────────────────────────────────────
export const XP_REWARDS = {
  taskOnTime:   10,
  taskLate:      5,
  habitComplete: 3,
  streakBonus:   5,
  goalComplete: 50,
  taskMissed:   -5,
};
