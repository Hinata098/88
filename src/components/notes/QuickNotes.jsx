import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';

function ListCard({ list }) {
  const { addListItem, toggleListItem, deleteListItem, deleteList, renameList } = useApp();
  const [isOpen, setIsOpen] = useState(true);
  const [newItem, setNewItem] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(list.name);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    addListItem(list.id, newItem.trim());
    setNewItem('');
  };

  const handleRename = (e) => {
    e.preventDefault();
    if (newName.trim()) renameList(list.id, newName.trim());
    setIsRenaming(false);
  };

  const done = list.items.filter(i => i.done).length;

  return (
    <div className="bg-surface-container border border-outline-variant">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-outline-variant">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button onClick={() => setIsOpen(p => !p)} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-base">
              {isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
            </span>
          </button>
          {isRenaming ? (
            <form onSubmit={handleRename} className="flex-1">
              <input
                autoFocus
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onBlur={handleRename}
                className="bg-transparent border-none outline-none font-display text-lg text-primary w-full border-b border-primary-container"
              />
            </form>
          ) : (
            <button onClick={() => setIsRenaming(true)} className="font-display text-lg text-primary hover:text-primary-fixed transition-colors text-left">
              {list.name}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10px] text-on-surface-variant">{done}/{list.items.length}</span>
          <button onClick={() => setIsRenaming(true)} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <button onClick={() => deleteList(list.id)} className="text-on-surface-variant hover:text-error transition-colors">
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-3 flex flex-col gap-2">
          {/* Items */}
          <div className="flex flex-col gap-1">
            {list.items.length === 0 && (
              <p className="font-mono text-xs text-on-surface-variant py-1">No items yet.</p>
            )}
            {list.items.map(item => (
              <div key={item.id} className="flex items-center gap-2 group">
                <button
                  onClick={() => toggleListItem(list.id, item.id)}
                  className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${
                    item.done
                      ? 'border-primary-container bg-primary-container'
                      : 'border-outline-variant hover:border-primary-container'
                  }`}
                >
                  {item.done && (
                    <span className="material-symbols-outlined text-[9px] text-on-primary-container" style={{fontVariationSettings:"'FILL' 1"}}>check</span>
                  )}
                </button>
                <span className={`font-mono text-xs flex-1 ${item.done ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                  {item.text}
                </span>
                <button
                  onClick={() => deleteListItem(list.id, item.id)}
                  className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-error transition-all"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
            ))}
          </div>

          {/* Add item */}
          <form onSubmit={handleAdd} className="flex gap-2 mt-1">
            <div className="flex-1 flex items-center border border-outline-variant bg-surface-container-lowest focus-within:border-primary-container p-1.5 transition-colors">
              <span className="text-outline font-mono text-xs mr-1.5">+</span>
              <input
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                type="text"
                placeholder="Add item..."
                className="bg-transparent border-none outline-none font-mono text-xs text-on-surface w-full placeholder:text-outline-variant"
              />
            </div>
            <button type="submit" className="font-mono text-[10px] uppercase tracking-widest border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function QuickNotes() {
  const { lists, addList } = useApp();
  const [newListName, setNewListName] = useState('');
  const [showNewList, setShowNewList] = useState(false);

  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    addList(newListName.trim());
    setNewListName('');
    setShowNewList(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between stagger-1">
        <div>
          <h1 className="font-display text-3xl text-primary">Quick Notes</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">Named personal lists — grocery, ideas, bucket list & more</p>
        </div>
        <button
          onClick={() => setShowNewList(p => !p)}
          className="font-mono text-xs uppercase tracking-widest bg-primary-container text-on-primary-container px-4 py-2 hover:opacity-90 border border-primary-container flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span> New List
        </button>
      </div>

      {showNewList && (
        <form onSubmit={handleCreateList} className="flex gap-2 stagger-2">
          <div className="flex-1 flex items-center border border-outline-variant bg-surface-container-lowest focus-within:border-primary-container p-2.5 transition-colors">
            <span className="text-primary-container font-mono text-xs mr-2">&gt;</span>
            <input
              autoFocus
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              type="text"
              placeholder="List name (e.g. Grocery, Ideas, Bucket List...)"
              required
              className="bg-transparent border-none outline-none font-mono text-sm text-on-surface w-full placeholder:text-outline-variant"
            />
          </div>
          <button type="submit" className="font-mono text-xs uppercase tracking-widest bg-primary-container text-on-primary-container px-4 py-2 border border-primary-container">
            Create
          </button>
          <button type="button" onClick={() => setShowNewList(false)} className="font-mono text-xs uppercase tracking-widest border border-outline-variant px-4 py-2 text-on-surface-variant hover:text-primary hover:border-primary transition-colors">
            Cancel
          </button>
        </form>
      )}

      {lists.length === 0 ? (
        <div className="border border-dashed border-outline-variant p-12 text-center stagger-2">
          <span className="material-symbols-outlined text-5xl text-outline-variant block mb-3">sticky_note_2</span>
          <p className="font-mono text-sm text-on-surface-variant">No lists yet. Create your first one!</p>
          <p className="font-mono text-xs text-outline mt-1">Suggestions: Grocery, Ideas, Bucket List, Workout Plan</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 stagger-3">
          {lists.map(list => <ListCard key={list.id} list={list} />)}
        </div>
      )}

      {/* Note */}
      <p className="font-mono text-[10px] text-outline text-center stagger-4">
        ※ Lists are for reference only — not counted in analytics or tasks
      </p>
    </div>
  );
}
