import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Filter, CheckCircle, Circle, Calendar as CalendarIcon, BookOpen } from 'lucide-react';
import type { Task } from '../types';

export const Tasks: React.FC = () => {
    const { tasks, addTask, updateTask, subjects } = useApp();
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [subjectFilter, setSubjectFilter] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newTask, setNewTask] = useState<Partial<Task>>({
        nome: '',
        data: '',
        prioridade: 'media',
        disciplinaId: ''
    });

    const filteredTasks = tasks.filter(task => {
        let statusMatch = false;
        if (filter === 'all') {
            statusMatch = true;
        } else if (filter === 'pending') {
            statusMatch = task.status === 'pendente';
        } else if (filter === 'completed') {
            statusMatch = task.status === 'concluida';
        }

        const subjectMatch = subjectFilter === 'all' ? true : task.disciplinaId === subjectFilter;
        return statusMatch && subjectMatch;
    });

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTask.nome && newTask.data && newTask.prioridade && newTask.disciplinaId) {
            addTask({
                id: crypto.randomUUID(),
                disciplinaId: newTask.disciplinaId,
                nome: newTask.nome,
                data: newTask.data,
                prioridade: newTask.prioridade as 'baixa' | 'media' | 'alta',
                status: 'pendente'
            });
            setIsModalOpen(false);
            setNewTask({ nome: '', data: '', prioridade: 'media', disciplinaId: '' });
        }
    };

    const toggleStatus = (task: Task) => {
        updateTask({
            ...task,
            status: task.status === 'pendente' ? 'concluida' : 'pendente'
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'alta': return 'text-red-500 bg-red-50';
            case 'media': return 'text-orange-500 bg-orange-50';
            case 'baixa': return 'text-green-500 bg-green-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
                    <p className="text-gray-500 mt-1">Gerencie suas entregas e atividades</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-indigo-200"
                >
                    <Plus size={20} />
                    Nova Tarefa
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                    <Filter size={20} />
                    <span className="font-medium">Filtros:</span>
                </div>

                <div className="flex gap-2">
                    {['all', 'pending', 'completed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${filter === f
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendentes' : 'Concluídas'}
                        </button>
                    ))}
                </div>

                <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>

                <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="px-3 py-1 rounded-lg text-sm bg-gray-100 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
                >
                    <option value="all">Todas as Disciplinas</option>
                    {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.nome}</option>
                    ))}
                </select>
            </div>

            {/* Task List */}
            <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <CheckCircle className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-900">Nenhuma tarefa encontrada</h3>
                        <p className="text-gray-500">Tente mudar os filtros ou adicione uma nova tarefa.</p>
                    </div>
                ) : (
                    filteredTasks.map(task => {
                        const subject = subjects.find(s => s.id === task.disciplinaId);
                        return (
                            <div
                                key={task.id}
                                className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all ${task.status === 'concluida' ? 'opacity-60' : ''
                                    }`}
                            >
                                <button
                                    onClick={() => toggleStatus(task)}
                                    className={`flex-shrink-0 transition-colors ${task.status === 'concluida' ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'
                                        }`}
                                >
                                    {task.status === 'concluida' ? <CheckCircle size={24} /> : <Circle size={24} />}
                                </button>

                                <div className="flex-1">
                                    <h3 className={`font-medium text-gray-900 ${task.status === 'concluida' ? 'line-through text-gray-500' : ''
                                        }`}>
                                        {task.nome}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                                        {subject && (
                                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                                <BookOpen size={14} />
                                                {subject.nome}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <CalendarIcon size={14} />
                                            {new Date(task.data).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getPriorityColor(task.prioridade)}`}>
                                    {task.prioridade}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Nova Tarefa</h2>
                        <form onSubmit={handleAddTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                <input
                                    required
                                    type="text"
                                    value={newTask.nome}
                                    onChange={e => setNewTask({ ...newTask, nome: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                                <select
                                    required
                                    value={newTask.disciplinaId}
                                    onChange={e => setNewTask({ ...newTask, disciplinaId: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="">Selecione uma disciplina</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                                    <input
                                        required
                                        type="date"
                                        value={newTask.data}
                                        onChange={e => setNewTask({ ...newTask, data: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                                    <select
                                        value={newTask.prioridade}
                                        onChange={e => setNewTask({ ...newTask, prioridade: e.target.value as any })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="baixa">Baixa</option>
                                        <option value="media">Média</option>
                                        <option value="alta">Alta</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
