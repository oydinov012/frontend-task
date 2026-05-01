import { useState, useMemo } from 'react';
import { Search, Plus, Filter, X } from 'lucide-react';
import { useTaskContext } from './TaskContext';
import { TaskStatus, Priority, PROJECTS } from './data';
import { TaskRow, Card, PageHeader, PrimaryButton, StatusBadge, PriorityBadge } from './SharedUI';
import { AddTaskModal } from './AddTaskModal';

type FilterStatus = TaskStatus | 'all';
type SortKey = 'dueDate' | 'priority' | 'project' | 'title';

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function TasksPage() {
  const { tasks, toggleTask, deleteTask } = useTaskContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortKey>('dueDate');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...tasks];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') result = result.filter((t) => t.status === filterStatus);
    if (filterProject !== 'all') result = result.filter((t) => t.projectId === filterProject);
    if (filterPriority !== 'all') result = result.filter((t) => t.priority === filterPriority);

    result.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate < b.dueDate ? -1 : 1;
        case 'priority':
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        case 'project':
          return a.projectId.localeCompare(b.projectId);
        case 'title':
          return a.title.localeCompare(b.title);
      }
    });
    return result;
  }, [tasks, search, filterStatus, filterProject, filterPriority, sortBy]);

  const statusTabs: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'todo', label: 'To Do' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'done', label: 'Done' },
  ];

  const counts: Record<FilterStatus, number> = useMemo(() => ({
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }), [tasks]);

  const statusColor: Record<FilterStatus, string> = {
    all: '#b8c3ff',
    todo: '#8e90a2',
    'in-progress': '#ffb95f',
    done: '#4edea3',
  };

  const hasActiveFilters = filterProject !== 'all' || filterPriority !== 'all';

  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif', color: '#e5e2e1', maxWidth: 960 }}>
      <PageHeader
        title="My Tasks"
        subtitle={`${filtered.length} task${filtered.length !== 1 ? 's' : ''} ${filterStatus !== 'all' ? `· ${filterStatus}` : ''}`}
        action={
          <PrimaryButton onClick={() => setModalOpen(true)}>
            <Plus size={15} />
            New Task
          </PrimaryButton>
        }
      />

      {/* Search + filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search
            size={15}
            color={searchFocused ? '#b8c3ff' : '#8e90a2'}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: '100%',
              background: '#0e0e0e',
              border: `1px solid ${searchFocused ? '#2d5bff' : '#434656'}`,
              borderRadius: 6,
              padding: '9px 12px 9px 36px',
              color: '#e5e2e1',
              fontSize: 14,
              outline: searchFocused ? '2px solid rgba(45,91,255,0.2)' : 'none',
              transition: 'border-color 0.15s, outline 0.15s',
              fontFamily: 'Inter, sans-serif',
              boxSizing: 'border-box',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#8e90a2',
                cursor: 'pointer',
                padding: 2,
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: showFilters || hasActiveFilters ? 'rgba(184,195,255,0.1)' : 'transparent',
            border: `1px solid ${showFilters || hasActiveFilters ? '#b8c3ff' : '#434656'}`,
            borderRadius: 6,
            padding: '8px 14px',
            color: showFilters || hasActiveFilters ? '#b8c3ff' : '#c4c5d9',
            cursor: 'pointer',
            fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          <Filter size={14} />
          Filters
          {hasActiveFilters && (
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#b8c3ff',
              }}
            />
          )}
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          style={{
            background: '#0e0e0e',
            border: '1px solid #434656',
            borderRadius: 6,
            padding: '8px 12px',
            color: '#c4c5d9',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <option value="dueDate" style={{ background: '#1c1b1b' }}>Sort: Due Date</option>
          <option value="priority" style={{ background: '#1c1b1b' }}>Sort: Priority</option>
          <option value="project" style={{ background: '#1c1b1b' }}>Sort: Project</option>
          <option value="title" style={{ background: '#1c1b1b' }}>Sort: Title</option>
        </select>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div
          style={{
            background: '#1c1b1b',
            border: '1px solid #2a2a2a',
            borderRadius: 8,
            padding: '16px 20px',
            marginBottom: 20,
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          <FilterGroup label="PROJECT">
            <FilterOption active={filterProject === 'all'} onClick={() => setFilterProject('all')} color="#8e90a2">
              All Projects
            </FilterOption>
            {PROJECTS.map((p) => (
              <FilterOption
                key={p.id}
                active={filterProject === p.id}
                onClick={() => setFilterProject(p.id)}
                color={p.color}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                {p.name}
              </FilterOption>
            ))}
          </FilterGroup>

          <FilterGroup label="PRIORITY">
            {(['all', 'high', 'medium', 'low'] as const).map((p) => {
              const colors: Record<string, string> = { all: '#8e90a2', low: '#8e90a2', medium: '#ffb95f', high: '#ffb4ab' };
              return (
                <FilterOption
                  key={p}
                  active={filterPriority === p}
                  onClick={() => setFilterPriority(p)}
                  color={colors[p]}
                >
                  {p === 'all' ? 'All Priorities' : p.charAt(0).toUpperCase() + p.slice(1)}
                </FilterOption>
              );
            })}
          </FilterGroup>

          {hasActiveFilters && (
            <button
              onClick={() => { setFilterProject('all'); setFilterPriority('all'); }}
              style={{
                alignSelf: 'flex-end',
                background: 'none',
                border: 'none',
                color: '#8e90a2',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'Inter, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 0',
              }}
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {statusTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 6,
              background: filterStatus === key ? `${statusColor[key]}12` : 'transparent',
              border: `1px solid ${filterStatus === key ? statusColor[key] : 'transparent'}`,
              color: filterStatus === key ? statusColor[key] : '#8e90a2',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: filterStatus === key ? 600 : 400,
              transition: 'all 0.15s',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {label}
            <span
              style={{
                background: filterStatus === key ? `${statusColor[key]}20` : '#2a2a2a',
                color: filterStatus === key ? statusColor[key] : '#8e90a2',
                borderRadius: 9999,
                fontSize: 11,
                fontWeight: 600,
                padding: '1px 7px',
              }}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 24px',
            background: '#1c1b1b',
            border: '1px solid #2a2a2a',
            borderRadius: 8,
            color: '#8e90a2',
          }}
        >
          <Search size={32} color="#434656" style={{ display: 'block', margin: '0 auto 12px' }} />
          <p style={{ margin: '0 0 4px', fontSize: 15, color: '#c4c5d9' }}>No tasks found</p>
          <p style={{ margin: 0, fontSize: 13 }}>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      )}

      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#8e90a2', letterSpacing: '0.05em', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{children}</div>
    </div>
  );
}

function FilterOption({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '5px 10px',
        borderRadius: 6,
        border: `1px solid ${active ? color : '#434656'}`,
        background: active ? `${color}12` : 'transparent',
        color: active ? color : '#c4c5d9',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        fontFamily: 'Inter, sans-serif',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}
