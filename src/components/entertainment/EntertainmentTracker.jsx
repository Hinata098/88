import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { MEDIA_TYPES } from '../../data/defaults.js';
import { uid } from '../../utils/dates.js';

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function StarRating({ rating, onRate }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => onRate(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          className={`text-base transition-colors ${n <= (hover || rating) ? 'star-filled' : 'star-empty'}`}>★</button>
      ))}
    </div>
  );
}

function MediaCard({ item }) {
  const { toggleWatched, rateItem, deleteEntertainmentItem, setEntertainmentItems } = useApp();
  const [expanded, setExpanded] = useState(false);

  const updateItem = (updates) => {
    setEntertainmentItems(prev => prev.map(i => i.id === item.id ? { ...i, ...updates } : i));
  };

  const typeColors = {
    Movie: '#d4dcff', Anime: '#ffb300', Series: '#ffd79b',
    Documentary: '#e9c349', 'Short Film': '#b0c0f7'
  };

  return (
    <div className={`bg-surface-container border border-outline-variant transition-all ${item.watched ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3 p-3">
        {/* Watched toggle */}
        <button onClick={() => toggleWatched(item.id)} className={`shrink-0 w-5 h-5 border flex items-center justify-center mt-0.5 transition-colors ${item.watched ? 'border-primary-container bg-primary-container' : 'border-outline-variant hover:border-primary-container'}`}>
          {item.watched && <span className="material-symbols-outlined text-xs text-on-primary-container" style={{fontVariationSettings:"'FILL' 1"}}>check</span>}
        </button>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(p => !p)}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-mono text-sm ${item.watched ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>{item.title}</span>
            <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border"
              style={{ borderColor: typeColors[item.type] || '#9e8e78', color: typeColors[item.type] || '#9e8e78' }}>
              {item.type}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1">
            {item.episode > 0 && <span className="font-mono text-[10px] text-on-surface-variant">Ep.{item.episode}</span>}
            {item.airTime && <span className="font-mono text-[10px] text-on-surface-variant">⏰ {item.airTime}</span>}
            {item.dayOfWeek >= 0 && <span className="font-mono text-[10px] text-on-surface-variant">{DAYS[item.dayOfWeek]}</span>}
            <StarRating rating={item.rating} onRate={r => rateItem(item.id, r)} />
          </div>
        </div>

        <button onClick={() => deleteEntertainmentItem(item.id)} className="shrink-0">
          <span className="material-symbols-outlined text-sm text-on-surface-variant hover:text-error">delete</span>
        </button>
      </div>

      {expanded && (
        <div className="px-11 pb-3 flex gap-4 border-t border-outline-variant pt-2">
          <div>
            <label className="font-mono text-[9px] text-outline uppercase tracking-widest block mb-1">Episode</label>
            <input type="number" min="1" value={item.episode}
              onChange={e => updateItem({ episode: parseInt(e.target.value) || 1 })}
              className="w-16 bg-surface-container-lowest border border-outline-variant p-1 font-mono text-xs text-on-surface focus:border-primary-container focus:outline-none" />
          </div>
          <div>
            <label className="font-mono text-[9px] text-outline uppercase tracking-widest block mb-1">Air Time</label>
            <input type="time" value={item.airTime || ''}
              onChange={e => updateItem({ airTime: e.target.value })}
              className="bg-surface-container-lowest border border-outline-variant p-1 font-mono text-xs text-on-surface focus:border-primary-container focus:outline-none" />
          </div>
        </div>
      )}
    </div>
  );
}

function AddMediaModal({ onClose }) {
  const { addEntertainmentItem } = useApp();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Series');
  const [episode, setEpisode] = useState(1);
  const [airTime, setAirTime] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(-1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addEntertainmentItem({ title: title.trim(), type, episode, airTime, dayOfWeek: Number(dayOfWeek) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 modal-backdrop" onClick={onClose}>
      <div className="bg-surface-container border border-outline-variant shadow-terminal-lg p-6 w-full max-w-md modal-content relative" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5 border-b border-outline-variant pb-3">
          <h2 className="font-display text-primary text-xl">Add Media Item</h2>
          <button onClick={onClose}><span className="material-symbols-outlined text-on-surface-variant hover:text-primary">close</span></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-mono text-[10px] text-outline uppercase tracking-widest block mb-1.5">Title *</label>
            <div className="flex items-center border border-outline-variant bg-surface-container-lowest focus-within:border-primary-container p-2.5">
              <span className="text-primary-container font-mono text-xs mr-2">&gt;</span>
              <input autoFocus value={title} onChange={e => setTitle(e.target.value)} required type="text" placeholder="e.g., Attack on Titan" className="bg-transparent border-none outline-none font-mono text-sm text-on-surface w-full placeholder:text-outline-variant" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] text-outline uppercase tracking-widest block mb-1.5">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant p-2 font-mono text-xs text-on-surface focus:border-primary-container focus:outline-none appearance-none">
                {MEDIA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-outline uppercase tracking-widest block mb-1.5">Start Episode</label>
              <input type="number" min="1" value={episode} onChange={e => setEpisode(parseInt(e.target.value) || 1)} className="w-full bg-surface-container-lowest border border-outline-variant p-2 font-mono text-xs text-on-surface focus:border-primary-container focus:outline-none" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-outline uppercase tracking-widest block mb-1.5">Air Time</label>
              <input type="time" value={airTime} onChange={e => setAirTime(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant p-2 font-mono text-xs text-on-surface focus:border-primary-container focus:outline-none" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-outline uppercase tracking-widest block mb-1.5">Day of Week</label>
              <select value={dayOfWeek} onChange={e => setDayOfWeek(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant p-2 font-mono text-xs text-on-surface focus:border-primary-container focus:outline-none appearance-none">
                <option value={-1}>None</option>
                {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant">
            <button type="button" onClick={onClose} className="font-mono text-xs uppercase tracking-widest border border-outline-variant px-4 py-2 text-on-surface-variant hover:border-primary hover:text-primary transition-colors">Cancel</button>
            <button type="submit" className="font-mono text-xs uppercase tracking-widest bg-primary-container text-on-primary-container px-6 py-2 hover:opacity-90 border border-primary-container flex items-center gap-2">
              Add <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EntertainmentTracker() {
  const { entertainmentItems, watchQueue, setWatchQueue, addToast } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [queueInput, setQueueInput] = useState('');

  const filtered = entertainmentItems.filter(i => {
    if (filter === 'watching') return !i.watched;
    if (filter === 'watched') return i.watched;
    return true;
  });

  const addToQueue = (e) => {
    e.preventDefault();
    if (!queueInput.trim()) return;
    setWatchQueue(prev => [...prev, { id: uid(), title: queueInput.trim(), createdAt: Date.now() }]);
    setQueueInput('');
  };

  const removeFromQueue = (id) => setWatchQueue(prev => prev.filter(q => q.id !== id));

  const totalWatched = entertainmentItems.filter(i => i.watched).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between stagger-1">
        <div>
          <h1 className="font-display text-3xl text-primary">Entertainment</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">{totalWatched} watched · {entertainmentItems.length - totalWatched} remaining</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="font-mono text-xs uppercase tracking-widest bg-primary-container text-on-primary-container px-4 py-2 hover:opacity-90 border border-primary-container flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span> Add Media
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 stagger-2">
        {['all', 'watching', 'watched'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${filter === f ? 'border-primary-container text-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary-container'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Media list */}
      <div className="flex flex-col gap-2 stagger-3">
        {filtered.length === 0 ? (
          <div className="border border-dashed border-outline-variant p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-outline-variant block mb-2">movie</span>
            <p className="font-mono text-sm text-on-surface-variant">No media tracked yet.</p>
          </div>
        ) : (
          filtered.map(item => <MediaCard key={item.id} item={item} />)
        )}
      </div>

      {/* Watch Queue */}
      <div className="border border-outline-variant p-4 stagger-4">
        <h3 className="font-display text-lg text-primary mb-3">Watch Queue</h3>
        <form onSubmit={addToQueue} className="flex gap-2 mb-3">
          <div className="flex-1 flex items-center border border-outline-variant bg-surface-container-lowest focus-within:border-primary-container p-2 transition-colors">
            <span className="text-primary-container font-mono text-xs mr-2">&gt;</span>
            <input value={queueInput} onChange={e => setQueueInput(e.target.value)} type="text" placeholder="Add to watchlist..." className="bg-transparent border-none outline-none font-mono text-xs text-on-surface w-full placeholder:text-outline-variant" />
          </div>
          <button type="submit" className="font-mono text-xs uppercase tracking-widest bg-surface-container-high border border-outline-variant px-3 py-2 text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
            Add
          </button>
        </form>
        <div className="flex flex-col gap-1.5">
          {watchQueue.length === 0 && <p className="font-mono text-xs text-on-surface-variant">Queue is empty.</p>}
          {watchQueue.map((q, i) => (
            <div key={q.id} className="flex items-center gap-3 p-2 bg-surface-container border border-outline-variant">
              <span className="font-mono text-[10px] text-outline-variant w-4">{i + 1}</span>
              <span className="font-mono text-xs text-on-surface flex-1">{q.title}</span>
              <button onClick={() => removeFromQueue(q.id)}>
                <span className="material-symbols-outlined text-sm text-on-surface-variant hover:text-error">close</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {showAdd && <AddMediaModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
