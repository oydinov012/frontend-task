import React, { CSSProperties } from 'react';
import { Check } from 'lucide-react';
import { TaskStatus, Priority, Task, PROJECTS } from './data';

// ─── Status Badge ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  TaskStatus,
  { bg: string; border: string; color: string; label: string }
> = {
  todo: { bg: 'rgba(142,144,162,0.08)', border: '#434656', color: '#8e90a2', label: 'To Do' },
  'in-progress': {
    bg: 'rgba(255,185,95,0.1)',
    border: '#ffb95f',
    color: '#ffb95f',
    label: 'In Progress',
  },
  done: { bg: 'rgba(78,222,163,0.1)', border: '#4edea3', color: '#4edea3', label: 'Done' },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 9999,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: cfg.color,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

// ─── Priority Badge ───────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<Priority, { color: string; label: string; symbol: string }> = {
  low: { color: '#8e90a2', label: 'Low', symbol: '↓' },
  medium: { color: '#ffb95f', label: 'Medium', symbol: '→' },
  high: { color: '#ffb4ab', label: 'High', symbol: '↑' },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        color: cfg.color,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      <span>{cfg.symbol}</span>
      {cfg.label}
    </span>
  );
}

// ─── Task Checkbox ────────────────────────────────────────────────────────────

export function TaskCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 18,
        height: 18,
        border: `2px solid ${checked ? '#2d5bff' : '#434656'}`,
        borderRadius: 4,
        background: checked ? '#2d5bff' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.15s ease',
        padding: 0,
      }}
    >
      {checked && <Check size={11} color="white" strokeWidth={3} />}
    </button>
  );
}

// ─── Task Row ─────────────────────────────────────────────────────────────────

export function TaskRow({
  task,
  onToggle,
  onDelete,
  showProject = true,
}: {
  task: Task;
  onToggle: () => void;
  onDelete?: () => void;
  showProject?: boolean;
}) {
  const project = PROJECTS.find((p) => p.id === task.projectId);
  const isDone = task.status === 'done';
  const isOverdue =
    task.dueDate && !isDone && task.dueDate < new Date().toISOString().split('T')[0];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        borderRadius: 6,
        background: '#201f1f',
        border: '1px solid #2a2a2a',
        transition: 'border-color 0.15s',
      }}
    >
      <TaskCheckbox checked={isDone} onChange={onToggle} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            color: isDone ? '#8e90a2' : '#e5e2e1',
            textDecoration: isDone ? 'line-through' : 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {task.title}
        </div>
        {(showProject || task.dueDate) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
            {showProject && project && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  color: '#8e90a2',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: project.color,
                    flexShrink: 0,
                  }}
                />
                {project.name}
              </span>
            )}
            {task.dueDate && (
              <span
                style={{
                  fontSize: 11,
                  color: isOverdue ? '#ffb4ab' : '#8e90a2',
                }}
              >
                {isOverdue ? '⚠ ' : ''}
                {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
        {onDelete && (
          <button
            onClick={onDelete}
            style={{
              background: 'none',
              border: 'none',
              color: '#434656',
              cursor: 'pointer',
              padding: '2px 4px',
              borderRadius: 4,
              fontSize: 14,
              lineHeight: 1,
              transition: 'color 0.15s',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#ffb4ab')}
            onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#434656')}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({
  title,
  count,
  children,
  action,
  style,
}: {
  title?: string;
  count?: number;
  children: React.ReactNode;
  action?: React.ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: '#1c1b1b',
        border: '1px solid #2a2a2a',
        borderRadius: 8,
        padding: 24,
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#e5e2e1' }}>{title}</span>
            {count !== undefined && (
              <span
                style={{
                  background: '#2a2a2a',
                  color: '#8e90a2',
                  borderRadius: 9999,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '1px 7px',
                }}
              >
                {count}
              </span>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 32,
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#e5e2e1',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#8e90a2' }}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// ─── Primary Button ───────────────────────────────────────────────────────────

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: '#2d5bff',
        color: 'white',
        border: 'none',
        padding: '9px 18px',
        borderRadius: 6,
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 500,
        transition: 'opacity 0.15s',
        fontFamily: 'Inter, sans-serif',
      }}
      onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
      onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
    >
      {children}
    </button>
  );
}

// ─── Ghost Button ─────────────────────────────────────────────────────────────

export function GhostButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: 'transparent',
        color: '#c4c5d9',
        border: '1px solid #434656',
        padding: '8px 16px',
        borderRadius: 6,
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 400,
        transition: 'border-color 0.15s, color 0.15s',
        fontFamily: 'Inter, sans-serif',
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = '#8e90a2';
        (e.currentTarget as HTMLButtonElement).style.color = '#e5e2e1';
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = '#434656';
        (e.currentTarget as HTMLButtonElement).style.color = '#c4c5d9';
      }}
    >
      {children}
    </button>
  );
}
