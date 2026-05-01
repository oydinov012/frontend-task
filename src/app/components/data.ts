export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  description: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    color: '#b8c3ff',
    description: 'Complete overhaul of the company website and design system.',
  },
  {
    id: 'p2',
    name: 'Mobile App',
    color: '#4edea3',
    description: 'Cross-platform iOS and Android application for end users.',
  },
  {
    id: 'p3',
    name: 'API Integration',
    color: '#ffb95f',
    description: 'Third-party API connections and webhook infrastructure.',
  },
  {
    id: 'p4',
    name: 'Marketing Campaign',
    color: '#ffb4ab',
    description: 'Q2 2026 digital marketing and brand awareness push.',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Design system tokens setup',
    status: 'done',
    priority: 'high',
    projectId: 'p1',
    dueDate: '2026-04-20',
    description: 'Define all color, spacing, and typography tokens',
  },
  {
    id: 't2',
    title: 'Homepage wireframes',
    status: 'done',
    priority: 'high',
    projectId: 'p1',
    dueDate: '2026-04-22',
  },
  {
    id: 't3',
    title: 'Navigation component',
    status: 'in-progress',
    priority: 'high',
    projectId: 'p1',
    dueDate: '2026-04-25',
  },
  {
    id: 't4',
    title: 'Hero section animation',
    status: 'in-progress',
    priority: 'medium',
    projectId: 'p1',
    dueDate: '2026-04-28',
  },
  {
    id: 't5',
    title: 'Footer layout & links',
    status: 'todo',
    priority: 'low',
    projectId: 'p1',
    dueDate: '2026-05-02',
  },
  {
    id: 't17',
    title: 'SEO metadata optimization',
    status: 'done',
    priority: 'high',
    projectId: 'p1',
    dueDate: '2026-04-23',
  },
  {
    id: 't6',
    title: 'User authentication flow',
    status: 'done',
    priority: 'high',
    projectId: 'p2',
    dueDate: '2026-04-18',
  },
  {
    id: 't7',
    title: 'Push notification service',
    status: 'in-progress',
    priority: 'high',
    projectId: 'p2',
    dueDate: '2026-04-25',
  },
  {
    id: 't8',
    title: 'Offline mode support',
    status: 'todo',
    priority: 'medium',
    projectId: 'p2',
    dueDate: '2026-05-05',
  },
  {
    id: 't9',
    title: 'Performance profiling & optimization',
    status: 'todo',
    priority: 'medium',
    projectId: 'p2',
    dueDate: '2026-05-08',
  },
  {
    id: 't10',
    title: 'Stripe payment gateway',
    status: 'done',
    priority: 'high',
    projectId: 'p3',
    dueDate: '2026-04-15',
  },
  {
    id: 't11',
    title: 'Webhook event handlers',
    status: 'in-progress',
    priority: 'high',
    projectId: 'p3',
    dueDate: '2026-04-25',
  },
  {
    id: 't12',
    title: 'Rate limiting middleware',
    status: 'todo',
    priority: 'medium',
    projectId: 'p3',
    dueDate: '2026-04-30',
  },
  {
    id: 't18',
    title: 'API documentation',
    status: 'in-progress',
    priority: 'medium',
    projectId: 'p3',
    dueDate: '2026-05-01',
  },
  {
    id: 't13',
    title: 'Email campaign automation',
    status: 'todo',
    priority: 'high',
    projectId: 'p4',
    dueDate: '2026-04-29',
  },
  {
    id: 't14',
    title: 'Social media content calendar',
    status: 'in-progress',
    priority: 'medium',
    projectId: 'p4',
    dueDate: '2026-04-25',
  },
  {
    id: 't15',
    title: 'Analytics reporting dashboard',
    status: 'todo',
    priority: 'low',
    projectId: 'p4',
    dueDate: '2026-05-10',
  },
  {
    id: 't16',
    title: 'A/B testing framework',
    status: 'todo',
    priority: 'medium',
    projectId: 'p4',
    dueDate: '2026-05-12',
  },
];
