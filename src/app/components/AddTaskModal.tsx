import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useTaskContext } from './TaskContext';
import { Priority, TaskStatus } from './data';
import { PrimaryButton, GhostButton } from './SharedUI';
import { createTask } from '../lib/api';


interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export function AddTaskModal({ open, onClose, defaultProjectId }: AddTaskModalProps) {
  const { projects, addTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [projectId, setProjectId] = useState(defaultProjectId ?? projects[0]?.id ?? '');
  const [dueDate, setDueDate] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setProjectId(defaultProjectId ?? projects[0]?.id ?? '');
      setDueDate('');
    }
  }, [open, defaultProjectId, projects]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!title.trim()) return;

  try {
    // API ga yuboriladigan ma'lumotlar
    const newTaskData = {
      name: title.trim(),          // Backend 'name' kutmoqda
      description: description,
      is_completed: status === 'done', // Statusni boolean'ga o'tkazamiz
      deadline:dueDate || null,
      // Agar backendda project maydoni bo'lsa:
      // project: projectId 
    };

    const response = await createTask(newTaskData);
    
    if (response) {
      // Transform API response to match expected task structure
      const taskToAdd = {
        ...response,
        title: title.trim(),
        priority: priority,
        status: status,
        projectId: projectId,
      };
      addTask(taskToAdd);
      onClose();
    }
  } catch (err: any) {
    alert("Vazifa yaratishda xatolik: " + err.message);
  }
};


  const inputStyle = (name: string): React.CSSProperties => ({
    width: '100%',
    background: '#0e0e0e',
    border: `1px solid ${focused === name ? '#2d5bff' : '#434656'}`,
    borderRadius: 6,
    padding: '9px 12px',
    color: '#e5e2e1',
    fontSize: 14,
    outline: focused === name ? '2px solid rgba(45,91,255,0.2)' : 'none',
    outlineOffset: 0,
    transition: 'border-color 0.15s, outline 0.15s',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
  });

  const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
  const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done'];

  const priorityColor: Record<Priority, string> = {
    low: '#8e90a2',
    medium: '#ffb95f',
    high: '#ffb4ab',
  };

  const statusColor: Record<TaskStatus, string> = {
    todo: '#8e90a2',
    'in-progress': '#ffb95f',
    done: '#4edea3',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(3px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#1c1b1b',
          border: '1px solid #434656',
          borderRadius: 12,
          width: '100%',
          maxWidth: 520,
          padding: 28,
          boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: 'rgba(45,91,255,0.15)',
                border: '1px solid rgba(45,91,255,0.4)',
                borderRadius: 7,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={14} color="#b8c3ff" />
            </div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#e5e2e1' }}>New Task</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#8e90a2',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8e90a2', letterSpacing: '0.05em', marginBottom: 6 }}>
              TASK TITLE *
            </label>
            <input
              autoFocus
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setFocused('title')}
              onBlur={() => setFocused(null)}
              style={inputStyle('title')}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8e90a2', letterSpacing: '0.05em', marginBottom: 6 }}>
              DESCRIPTION
            </label>
            <textarea
              placeholder="Add details (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setFocused('desc')}
              onBlur={() => setFocused(null)}
              rows={3}
              style={{
                ...inputStyle('desc'),
                resize: 'vertical',
                minHeight: 72,
              }}
            />
          </div>

          {/* Row: Project + Due Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8e90a2', letterSpacing: '0.05em', marginBottom: 6 }}>
                PROJECT
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                onFocus={() => setFocused('project')}
                onBlur={() => setFocused(null)}
                style={{ ...inputStyle('project'), cursor: 'pointer' }}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} style={{ background: '#1c1b1b' }}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8e90a2', letterSpacing: '0.05em', marginBottom: 6 }}>
                DUE DATE
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onFocus={() => setFocused('date')}
                onBlur={() => setFocused(null)}
                style={{ ...inputStyle('date'), colorScheme: 'dark' }}
              />
            </div>
          </div>

          {/* Priority */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8e90a2', letterSpacing: '0.05em', marginBottom: 8 }}>
              PRIORITY
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  style={{
                    flex: 1,
                    padding: '7px 12px',
                    borderRadius: 6,
                    border: `1px solid ${priority === p ? priorityColor[p] : '#434656'}`,
                    background: priority === p ? `${priorityColor[p]}15` : 'transparent',
                    color: priority === p ? priorityColor[p] : '#8e90a2',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: priority === p ? 600 : 400,
                    transition: 'all 0.15s',
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'capitalize',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8e90a2', letterSpacing: '0.05em', marginBottom: 8 }}>
              STATUS
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  style={{
                    flex: 1,
                    padding: '7px 8px',
                    borderRadius: 6,
                    border: `1px solid ${status === s ? statusColor[s] : '#434656'}`,
                    background: status === s ? `${statusColor[s]}15` : 'transparent',
                    color: status === s ? statusColor[s] : '#8e90a2',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: status === s ? 600 : 400,
                    transition: 'all 0.15s',
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s === 'in-progress' ? 'In Progress' : s === 'todo' ? 'To Do' : 'Done'}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <GhostButton onClick={onClose}>Cancel</GhostButton>
            <PrimaryButton type="submit">
              <Plus size={15} />
              Add Task
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
