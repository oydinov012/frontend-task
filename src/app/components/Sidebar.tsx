import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Settings,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { useTaskContext } from './TaskContext';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'My Tasks' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
];

export function Sidebar() {
  const { tasks, projects } = useTaskContext();
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;

  return (
    <aside
      style={{
        width: 240,
        background: '#1c1b1b',
        borderRight: '1px solid #434656',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 20,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 20px',
          borderBottom: '1px solid #434656',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: '#2d5bff',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Zap size={16} color="white" fill="white" />
        </div>
        <div>
          <div style={{ color: '#e5e2e1', fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>
            TaskApp
          </div>
          <div style={{ color: '#8e90a2', fontSize: 11 }}>Core</div>
        </div>
      </div>

      {/* Main Nav */}
      <nav style={{ padding: '16px 10px', flex: 1, overflowY: 'auto' }}>
        <SectionLabel>WORKSPACE</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 6,
                color: isActive ? '#b8c3ff' : '#c4c5d9',
                background: isActive ? 'rgba(184,195,255,0.08)' : 'transparent',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                transition: 'background 0.15s, color 0.15s',
                position: 'relative',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '20%',
                        bottom: '20%',
                        width: 3,
                        borderRadius: 9999,
                        background: '#b8c3ff',
                      }}
                    />
                  )}
                  <Icon size={16} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {label === 'My Tasks' && inProgressCount > 0 && (
                    <span
                      style={{
                        background: 'rgba(255,185,95,0.15)',
                        border: '1px solid #ffb95f',
                        color: '#ffb95f',
                        borderRadius: 9999,
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '1px 7px',
                      }}
                    >
                      {inProgressCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Projects list */}
        <SectionLabel>PROJECTS</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {projects.map((project) => {
            const count = tasks.filter((t) => t.projectId === project.id && t.status !== 'done').length;
            return (
              <NavLink
                key={project.id}
                to={`/projects?id=${project.id}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 12px',
                  borderRadius: 6,
                  color: isActive ? '#e5e2e1' : '#c4c5d9',
                  background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: 13,
                  transition: 'background 0.15s',
                })}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: project.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {project.name}
                </span>
                {count > 0 && (
                  <span style={{ color: '#8e90a2', fontSize: 12 }}>{count}</span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid #434656', padding: '10px' }}>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            borderRadius: 6,
            color: isActive ? '#b8c3ff' : '#c4c5d9',
            background: isActive ? 'rgba(184,195,255,0.08)' : 'transparent',
            textDecoration: 'none',
            fontSize: 14,
            marginBottom: 8,
          })}
        >
          <Settings size={16} />
          Settings
        </NavLink>

        {/* User */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #2d5bff, #b8c3ff)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            JD
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#e5e2e1', fontSize: 13, fontWeight: 500 }}>John Doe</div>
            <div style={{ color: '#8e90a2', fontSize: 11 }}>Pro Plan</div>
          </div>
          <ChevronRight size={14} color="#8e90a2" />
        </div>
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: '#8e90a2',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.05em',
        padding: '0 12px',
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}
