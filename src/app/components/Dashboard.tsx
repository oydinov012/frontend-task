import { useMemo, useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Plus, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router';
import { useTaskContext } from './TaskContext';
import { PROJECTS } from './data';
import { TaskRow, Card, PageHeader, PrimaryButton, StatusBadge } from './SharedUI';
import { AddTaskModal } from './AddTaskModal';

const TODAY = new Date().toISOString().split('T')[0];

function StatCard({
  icon,
  label,
  value,
  sub,
  accentColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  accentColor: string;
}) {
  return (
    <div
      style={{
        background: '#1c1b1b',
        border: '1px solid #2a2a2a',
        borderRadius: 8,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${accentColor}80, ${accentColor}20)`,
          borderRadius: '8px 8px 0 0',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#8e90a2', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${accentColor}12`,
            border: `1px solid ${accentColor}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#e5e2e1', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#8e90a2' }}>{sub}</div>
    </div>
  );
}

export function Dashboard() {
  const { tasks, toggleTask } = useTaskContext();
  const [modalOpen, setModalOpen] = useState(false);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const dueToday = tasks.filter((t) => t.dueDate === TODAY && t.status !== 'done').length;
    return { total, done, inProgress, dueToday };
  }, [tasks]);

  const todayTasks = useMemo(
    () => tasks.filter((t) => t.dueDate === TODAY),
    [tasks]
  );

  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== 'done' && t.dueDate && t.dueDate > TODAY)
        .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))
        .slice(0, 4),
    [tasks]
  );

  const completedRecent = useMemo(
    () => tasks.filter((t) => t.status === 'done').slice(0, 6),
    [tasks]
  );

  const pieData = [
    { name: 'Done', value: stats.done, color: '#4edea3' },
    { name: 'In Progress', value: stats.inProgress, color: '#ffb95f' },
    { name: 'To Do', value: stats.total - stats.done - stats.inProgress, color: '#434656' },
  ].filter((d) => d.value > 0);

  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif', color: '#e5e2e1', maxWidth: 1280 }}>
      <PageHeader
        title={`Good morning, John 👋`}
        subtitle={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        action={
          <PrimaryButton onClick={() => setModalOpen(true)}>
            <Plus size={15} />
            New Task
          </PrimaryButton>
        }
      />

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard
          icon={<ListTodo size={15} color="#b8c3ff" />}
          label="Total Tasks"
          value={stats.total}
          sub={`Across ${PROJECTS.length} projects`}
          accentColor="#b8c3ff"
        />
        <StatCard
          icon={<CheckCircle2 size={15} color="#4edea3" />}
          label="Completed"
          value={stats.done}
          sub={`${Math.round((stats.done / stats.total) * 100)}% done`}
          accentColor="#4edea3"
        />
        <StatCard
          icon={<Clock size={15} color="#ffb95f" />}
          label="In Progress"
          value={stats.inProgress}
          sub="Active right now"
          accentColor="#ffb95f"
        />
        <StatCard
          icon={<AlertCircle size={15} color={stats.dueToday > 0 ? '#ffb4ab' : '#4edea3'} />}
          label="Due Today"
          value={stats.dueToday}
          sub={stats.dueToday > 0 ? 'Needs attention' : "All clear today!"}
          accentColor={stats.dueToday > 0 ? '#ffb4ab' : '#4edea3'}
        />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Today's tasks */}
          <Card
            title="Today's Tasks"
            count={todayTasks.length}
            action={
              <Link
                to="/tasks"
                style={{
                  color: '#b8c3ff',
                  fontSize: 13,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                View all <ArrowRight size={13} />
              </Link>
            }
          >
            {todayTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 0', color: '#8e90a2' }}>
                <CheckCircle2 size={28} color="#4edea3" style={{ display: 'block', margin: '0 auto 10px' }} />
                <p style={{ margin: 0, fontSize: 14 }}>No tasks due today!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {todayTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask(task.id)}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Upcoming */}
          <Card
            title="Upcoming"
            count={upcomingTasks.length}
            action={
              <Link
                to="/tasks"
                style={{ color: '#b8c3ff', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                View all <ArrowRight size={13} />
              </Link>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {upcomingTasks.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} />
              ))}
            </div>
          </Card>

          {/* Project progress */}
          <Card title="Project Overview">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {PROJECTS.map((project) => {
                const ptasks = tasks.filter((t) => t.projectId === project.id);
                const done = ptasks.filter((t) => t.status === 'done').length;
                const pct = ptasks.length > 0 ? Math.round((done / ptasks.length) * 100) : 0;
                const inProg = ptasks.filter((t) => t.status === 'in-progress').length;
                return (
                  <div key={project.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: project.color,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: 14, color: '#e5e2e1', fontWeight: 500 }}>{project.name}</span>
                        {inProg > 0 && (
                          <span
                            style={{
                              background: 'rgba(255,185,95,0.1)',
                              border: '1px solid #ffb95f',
                              color: '#ffb95f',
                              borderRadius: 9999,
                              fontSize: 11,
                              fontWeight: 600,
                              padding: '1px 6px',
                            }}
                          >
                            {inProg} active
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: '#8e90a2' }}>
                          {done}/{ptasks.length}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: pct === 100 ? '#4edea3' : '#c4c5d9',
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div style={{ height: 5, background: '#2a2a2a', borderRadius: 9999 }}>
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
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Donut chart */}
          <Card title="Completion">
            <div style={{ height: 170 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#2a2a2a',
                      border: '1px solid #434656',
                      borderRadius: 6,
                      color: '#e5e2e1',
                      fontSize: 13,
                    }}
                    itemStyle={{ color: '#e5e2e1' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Center label */}
            <div style={{ textAlign: 'center', marginTop: -10, marginBottom: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#4edea3', lineHeight: 1 }}>
                {Math.round((stats.done / stats.total) * 100)}%
              </div>
              <div style={{ fontSize: 12, color: '#8e90a2', marginTop: 4 }}>overall done</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 16px' }}>
              {pieData.map((d) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                  <span style={{ fontSize: 12, color: '#8e90a2' }}>
                    {d.name} ({d.value})
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity timeline */}
          <Card title="Recent Activity" style={{ flex: 1 }}>
            <div style={{ position: 'relative', paddingLeft: 20 }}>
              {/* Track */}
              <div
                style={{
                  position: 'absolute',
                  left: 5,
                  top: 6,
                  bottom: 6,
                  width: 2,
                  background: '#2a2a2a',
                  borderRadius: 9999,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {completedRecent.map((task) => {
                  const project = PROJECTS.find((p) => p.id === task.projectId);
                  return (
                    <div key={task.id} style={{ position: 'relative' }}>
                      {/* Node */}
                      <div
                        style={{
                          position: 'absolute',
                          left: -20,
                          top: 3,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: '#4edea3',
                          border: '2px solid #1c1b1b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1,
                        }}
                      >
                        <div
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            background: '#131313',
                          }}
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            color: '#c4c5d9',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textDecoration: 'line-through',
                            textDecorationColor: '#434656',
                          }}
                        >
                          {task.title}
                        </div>
                        <div style={{ fontSize: 11, color: '#8e90a2', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                          {project && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                              }}
                            >
                              <span
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: '50%',
                                  background: project.color,
                                }}
                              />
                              {project.name}
                            </span>
                          )}
                          <span>· Completed</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
