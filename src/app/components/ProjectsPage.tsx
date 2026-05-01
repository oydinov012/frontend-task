import { useState } from 'react';
import { Plus, FolderKanban, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { useTaskContext } from './TaskContext';
import { Project, Task } from './data';
import { TaskRow, PageHeader, PrimaryButton, StatusBadge } from './SharedUI';
import { AddTaskModal } from './AddTaskModal';

export function ProjectsPage() {
  const { tasks, projects, toggleTask, deleteTask } = useTaskContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProjectId, setModalProjectId] = useState<string | undefined>();
  const [expandedProject, setExpandedProject] = useState<string | null>(projects[0]?.id ?? null);

  const openModal = (projectId?: string) => {
    setModalProjectId(projectId);
    setModalOpen(true);
  };

  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif', color: '#e5e2e1', maxWidth: 960 }}>
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} active projects`}
        action={
          <PrimaryButton onClick={() => openModal()}>
            <Plus size={15} />
            New Task
          </PrimaryButton>
        }
      />

      {/* Projects summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {projects.map((project) => {
          const ptasks = tasks.filter((t) => t.projectId === project.id);
          const done = ptasks.filter((t) => t.status === 'done').length;
          const pct = ptasks.length > 0 ? Math.round((done / ptasks.length) * 100) : 0;
          return (
            <button
              key={project.id}
              onClick={() =>
                setExpandedProject(expandedProject === project.id ? null : project.id)
              }
              style={{
                background: expandedProject === project.id ? '#201f1f' : '#1c1b1b',
                border: `1px solid ${expandedProject === project.id ? project.color + '50' : '#2a2a2a'}`,
                borderRadius: 8,
                padding: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: `${project.color}20`,
                    border: `1px solid ${project.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FolderKanban size={14} color={project.color} />
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: expandedProject === project.id ? '#e5e2e1' : '#c4c5d9',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {project.name}
                </span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#8e90a2' }}>
                    {done}/{ptasks.length} done
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: pct === 100 ? '#4edea3' : project.color }}>
                    {pct}%
                  </span>
                </div>
                <div style={{ height: 4, background: '#2a2a2a', borderRadius: 9999 }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: project.color,
                      borderRadius: 9999,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded project detail */}
      {expandedProject &&
        projects.map((project) => {
          if (project.id !== expandedProject) return null;
          const ptasks = tasks.filter((t) => t.projectId === project.id);
          const done = ptasks.filter((t) => t.status === 'done').length;
          const inProg = ptasks.filter((t) => t.status === 'in-progress').length;
          const todo = ptasks.filter((t) => t.status === 'todo').length;

          return (
            <div
              key={project.id}
              style={{
                background: '#1c1b1b',
                border: `1px solid ${project.color}30`,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {/* Project header */}
              <div
                style={{
                  borderBottom: '1px solid #2a2a2a',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `${project.color}18`,
                      border: `1px solid ${project.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FolderKanban size={18} color={project.color} />
                  </div>
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: 18,
                        fontWeight: 600,
                        color: '#e5e2e1',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {project.name}
                    </h2>
                    <p style={{ margin: '3px 0 0', fontSize: 13, color: '#8e90a2' }}>
                      {project.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { label: 'Done', value: done, color: '#4edea3' },
                      { label: 'Active', value: inProg, color: '#ffb95f' },
                      { label: 'Todo', value: todo, color: '#8e90a2' },
                    ].map((s) => (
                      <div
                        key={s.label}
                        style={{
                          background: `${s.color}10`,
                          border: `1px solid ${s.color}30`,
                          borderRadius: 7,
                          padding: '6px 12px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: 18, fontWeight: 700, color: s.color, lineHeight: 1 }}>
                          {s.value}
                        </div>
                        <div style={{ fontSize: 11, color: '#8e90a2', marginTop: 3 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <PrimaryButton onClick={() => openModal(project.id)}>
                    <Plus size={14} />
                    Add Task
                  </PrimaryButton>
                </div>
              </div>

              {/* Two columns: timeline + task list */}
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 0 }}>
                {/* Timeline */}
                <div
                  style={{
                    borderRight: '1px solid #2a2a2a',
                    padding: '24px 20px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#8e90a2',
                      letterSpacing: '0.05em',
                      marginBottom: 16,
                    }}
                  >
                    TIMELINE
                  </div>

                  <div style={{ position: 'relative', paddingLeft: 22 }}>
                    {/* Track */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 5,
                        top: 8,
                        bottom: 8,
                        width: 2,
                        background: '#2a2a2a',
                        borderRadius: 9999,
                      }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {ptasks
                        .sort((a, b) => {
                          if (!a.dueDate) return 1;
                          if (!b.dueDate) return -1;
                          return a.dueDate < b.dueDate ? -1 : 1;
                        })
                        .map((task, idx) => {
                          const isDone = task.status === 'done';
                          const isActive = task.status === 'in-progress';
                          const nodeColor = isDone ? '#4edea3' : isActive ? '#2d5bff' : '#434656';

                          return (
                            <div key={task.id} style={{ position: 'relative', paddingBottom: idx < ptasks.length - 1 ? 18 : 0 }}>
                              {/* Node */}
                              <div
                                style={{
                                  position: 'absolute',
                                  left: -22,
                                  top: 3,
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  background: nodeColor,
                                  border: `2px solid ${isDone ? '#4edea3' : isActive ? '#2d5bff' : '#434656'}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  zIndex: 1,
                                }}
                              >
                                {isDone && (
                                  <svg width="6" height="6" viewBox="0 0 6 6">
                                    <polyline
                                      points="1,3 2.5,4.5 5,1.5"
                                      stroke="#131313"
                                      strokeWidth="1.5"
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                                {isActive && (
                                  <div
                                    style={{
                                      width: 4,
                                      height: 4,
                                      borderRadius: '50%',
                                      background: 'white',
                                    }}
                                  />
                                )}
                              </div>

                              <div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: isDone ? '#8e90a2' : '#c4c5d9',
                                    textDecoration: isDone ? 'line-through' : 'none',
                                    textDecorationColor: '#434656',
                                    lineHeight: 1.4,
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {task.title}
                                </div>
                                {task.dueDate && (
                                  <div style={{ fontSize: 11, color: nodeColor, marginTop: 3 }}>
                                    {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Task list */}
                <div style={{ padding: '24px 24px' }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#8e90a2',
                      letterSpacing: '0.05em',
                      marginBottom: 16,
                    }}
                  >
                    TASKS ({ptasks.length})
                  </div>

                  {/* Group by status */}
                  {(['in-progress', 'todo', 'done'] as const).map((status) => {
                    const grouped = ptasks.filter((t) => t.status === status);
                    if (grouped.length === 0) return null;
                    const statusLabels: Record<string, string> = {
                      'in-progress': 'In Progress',
                      todo: 'To Do',
                      done: 'Completed',
                    };
                    const statusColors: Record<string, string> = {
                      'in-progress': '#ffb95f',
                      todo: '#8e90a2',
                      done: '#4edea3',
                    };
                    return (
                      <div key={status} style={{ marginBottom: 20 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 10,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: statusColors[status],
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: statusColors[status],
                              letterSpacing: '0.02em',
                            }}
                          >
                            {statusLabels[status]}
                          </span>
                          <span
                            style={{
                              background: `${statusColors[status]}15`,
                              color: statusColors[status],
                              borderRadius: 9999,
                              fontSize: 11,
                              fontWeight: 600,
                              padding: '1px 6px',
                            }}
                          >
                            {grouped.length}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                          {grouped.map((task) => (
                            <TaskRow
                              key={task.id}
                              task={task}
                              showProject={false}
                              onToggle={() => toggleTask(task.id)}
                              onDelete={() => deleteTask(task.id)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultProjectId={modalProjectId}
      />
    </div>
  );
}
