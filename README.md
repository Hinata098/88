# Chronicle — Personal Life Dashboard

> A rich, all-in-one daily life management app. Dark, warm-toned editorial aesthetic — leather-bound planner meets terminal.

![Chronicle](https://via.placeholder.com/800x400/131315/ffd79b?text=Chronicle+Dashboard)

## ✨ Features

| Section | Features |
|---|---|
| **Onboarding** | 3-step wizard, avatar selection, briefing time, notifications setup |
| **Daily Tasks** | Date navigation, priorities, notes, time scheduling, overdue highlights |
| **Weekly Templates** | Recurring tasks auto-injected each week by day-of-week |
| **Entertainment** | Media tracker, episode auto-increment, star ratings, watch queue |
| **Habits & Goals** | Daily toggles, streak counters, GitHub-style heatmap, progress rings |
| **Calendar** | Monthly grid, week load overview, day task inspector |
| **Analytics** | CSS bar charts, completion rates, XP log, export JSON report |
| **Quick Notes** | Named collapsible lists (Grocery, Ideas, Bucket List…) |
| **Notifications** | Morning briefing, 5-min pre-task reminders, missed alerts, daily summary |
| **XP / Gamification** | Level system, XP rewards/penalties, motivational quotes |
| **Themes** | 4 curated themes: Dark Amber, Arctic Minimal, Rose Editorial, Terminal Green |
| **Keyboard Shortcuts** | N, F, E, H, C, A, Q, ?, Esc |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
# Clone / unzip the project
cd chronicle-dashboard

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | New task modal |
| `F` | Focus → Tasks |
| `E` | Entertainment |
| `H` | Habits & Goals |
| `C` | Calendar |
| `A` | Analytics |
| `Q` | Quick Notes |
| `?` | Keyboard help |
| `Esc` | Close modal |

## 🎨 Themes

Switch themes from the palette icon in the header:
- 🌑 **Dark Amber** (default) — charcoal + gold
- 🌨️ **Arctic Minimal** — white + steel blue
- 🌸 **Rose Editorial** — blush + burgundy
- 💻 **Terminal Green** — pure black + neon green

## 🗂 Project Structure

```
chronicle-dashboard/
├── src/
│   ├── components/
│   │   ├── analytics/     ← Analytics.jsx
│   │   ├── calendar/      ← CalendarView.jsx
│   │   ├── entertainment/ ← EntertainmentTracker.jsx
│   │   ├── habits/        ← HabitsGoals.jsx
│   │   ├── layout/        ← Header, Sidebar, BottomNav, Settings, ToastContainer
│   │   ├── notes/         ← QuickNotes.jsx
│   │   ├── onboarding/    ← OnboardingWizard.jsx
│   │   ├── tasks/         ← DailyTasks.jsx
│   │   └── ui/            ← KeyboardShortcuts.jsx
│   ├── context/
│   │   └── AppContext.jsx ← Global state (localStorage-backed)
│   ├── data/
│   │   └── defaults.js    ← Quotes, levels, themes, avatars, XP config
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useKeyboardShortcuts.js
│   │   ├── useNotifications.js
│   │   └── useToasts.js
│   ├── utils/
│   │   └── dates.js       ← Date helpers
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css          ← Global styles, animations, heatmap, themes
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## 💾 Data Persistence

All data stored in **localStorage** with the prefix `ch_`:

| Key | Contents |
|-----|----------|
| `ch_user` | Name, avatar, settings |
| `ch_tasks` | All tasks |
| `ch_templates` | Weekly recurring templates |
| `ch_entertainment` | Media items |
| `ch_habits` | Habit definitions |
| `ch_habit_log` | Daily habit completions |
| `ch_goals` | Goals and subtasks |
| `ch_xp` | Total XP |
| `ch_xp_log` | XP history |
| `ch_lists` | Quick notes lists |
| `ch_notif_log` | Notification history |
| `ch_theme` | Current theme |

## 🛠 Tech Stack

- **React 18** — useState + useEffect + useCallback
- **Vite** — fast dev server and bundler
- **Tailwind CSS v3** — utility-first styling
- **Lucide React** — icon library (via lucide-react)
- **Web Notifications API** — browser notifications
- **localStorage** — all persistence, no backend needed

## 📄 License

MIT — personal use, feel free to extend!
