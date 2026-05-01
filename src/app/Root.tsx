import { Outlet } from 'react-router';
import { Sidebar } from './components/Sidebar';
import { TaskProvider } from './components/TaskContext';

export function Root() {
  return (
    <TaskProvider>
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          background: '#131313',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <Sidebar />
        <main
          style={{
            marginLeft: 240,
            flex: 1,
            overflowY: 'auto',
            minHeight: '100vh',
          }}
        >
          <Outlet />
        </main>
      </div>
    </TaskProvider>
  );
}
