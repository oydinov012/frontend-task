import React, { createContext, useContext, useState, useCallback } from 'react';
import { Task, INITIAL_TASKS, TaskStatus, Project, PROJECTS } from './data';

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  toggleTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: (t.status === 'done' ? 'todo' : 'done') as TaskStatus }
          : t
      )
    );
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    setTasks((prev) => [
      { ...task, id: `t${Date.now()}` },
      ...prev,
    ]);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <TaskContext.Provider
      value={{ tasks, projects: PROJECTS, toggleTask, updateTaskStatus, addTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('Must be used inside TaskProvider');
  return ctx;
}
