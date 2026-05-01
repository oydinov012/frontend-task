import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  ListTodo,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  Task,
} from '../../lib/api';

const PAGE_SIZE = 8;

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Modal state
  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', is_completed: false });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const totalPages = Math.ceil(count / PAGE_SIZE);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTasks(page, PAGE_SIZE);
      setTasks(data.results);
      setCount(data.count);
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setFormData({ name: '', description: '', is_completed: false });
    setFormError('');
    setModal('create');
  };

  const openEdit = (task: Task) => {
    setSelectedTask(task);
    setFormData({ name: task.name, description: task.description, is_completed: task.is_completed });
    setFormError('');
    setModal('edit');
  };

  const openDelete = (task: Task) => {
    setSelectedTask(task);
    setModal('delete');
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      setFormError('Nomi va tavsifi majburiy');
      return;
    }
    setFormLoading(true);
    setFormError('');
    try {
      await createTask(formData);
      setModal(null);
      load();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedTask) return;
    if (!formData.name.trim() || !formData.description.trim()) {
      setFormError('Nomi va tavsifi majburiy');
      return;
    }
    setFormLoading(true);
    setFormError('');
    try {
      await updateTask(selectedTask.id, formData);
      setModal(null);
      load();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTask) return;
    setFormLoading(true);
    try {
      await deleteTask(selectedTask.id);
      setModal(null);
      if (tasks.length === 1 && page > 1) setPage(page - 1);
      else load();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleComplete = async (task: Task) => {
    try {
      await updateTask(task.id, { is_completed: !task.is_completed });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, is_completed: !t.is_completed } : t))
      );
    } catch {}
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const pendingCount = tasks.filter((t) => !t.is_completed).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vazifalar</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Jami {count} ta vazifa
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yangi vazifa
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Jami</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
          <p className="text-xs text-green-600 mb-1">Bajarilgan</p>
          <p className="text-2xl font-bold text-green-700">{completedCount}</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <p className="text-xs text-amber-600 mb-1">Kutilmoqda</p>
          <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Vazifalarni qidirish..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
          <button onClick={load} className="ml-auto underline">Qayta urinish</button>
        </div>
      )}

      {/* Task list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <ListTodo className="w-12 h-12 mb-3 opacity-40" />
          <p className="font-medium">
            {search ? 'Hech narsa topilmadi' : 'Hali vazifalar yo\'q'}
          </p>
          {!search && (
            <p className="text-sm mt-1">Yuqoridagi tugma orqali yangi vazifa qo'shing</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white border rounded-2xl p-4 flex items-start gap-3 transition-all duration-200 hover:shadow-md ${
                task.is_completed ? 'border-green-100 bg-green-50/40' : 'border-gray-100'
              }`}
            >
              <button
                onClick={() => toggleComplete(task)}
                className="mt-0.5 flex-shrink-0 transition-colors"
              >
                {task.is_completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 hover:text-indigo-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-semibold truncate ${
                      task.is_completed ? 'line-through text-gray-400' : 'text-gray-900'
                    }`}
                  >
                    {task.name}
                  </p>
                  {task.is_completed && (
                    <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Bajarildi
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{task.description}</p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => openEdit(task)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openDelete(task)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, count)} / {count}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | string)[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`e-${i}`} className="px-1 text-gray-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      page === p
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {modal === 'create' ? 'Yangi vazifa' : 'Vazifani tahrirlash'}
              </h3>
              <button
                onClick={() => setModal(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nomi <span className="text-red-400">*</span>
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Vazifa nomi"
                  maxLength={200}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tavsif <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Vazifa haqida batafsil..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setFormData({ ...formData, is_completed: !formData.is_completed })}
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                    formData.is_completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  {formData.is_completed && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700">Bajarilgan deb belgilash</span>
              </label>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setModal(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={modal === 'create' ? handleCreate : handleEdit}
                disabled={formLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                {formLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saqlanmoqda...
                  </span>
                ) : modal === 'create' ? 'Qo\'shish' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {modal === 'delete' && selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Vazifani o'chirish
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              <span className="font-medium text-gray-700">"{selectedTask.name}"</span> vazifasini
              o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDelete}
                disabled={formLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                {formLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "O'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
