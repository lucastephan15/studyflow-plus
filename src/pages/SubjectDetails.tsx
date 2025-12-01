import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Plus, Calculator, Save, X } from 'lucide-react';
import type { Assessment, Task } from '../types';

export const SubjectDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { subjects, updateSubject, tasks, addTask } = useApp();

    const subject = subjects.find(s => s.id === id);
    const subjectTasks = tasks.filter(t => t.disciplinaId === id);

    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [newTask, setNewTask] = useState<Partial<Task>>({
        nome: '',
        data: '',
        prioridade: 'media'
    });

    useEffect(() => {
        if (subject) {
            // Initialize with empty array if no assessments exist
            setAssessments(subject.avaliacoes || []);
        }
    }, [subject]);

    if (!subject) return <div>Disciplina não encontrada</div>;

    const handleSaveGrades = () => {
        updateSubject({ ...subject, avaliacoes: assessments });
        alert('Notas salvas com sucesso!');
    };

    const addAssessment = () => {
        setAssessments([...assessments, { nome: 'Nova Avaliação', peso: 10, nota: null }]);
    };

    const removeAssessment = (index: number) => {
        setAssessments(assessments.filter((_, i) => i !== index));
    };

    const updateAssessment = (index: number, field: keyof Assessment, value: any) => {
        const newAssessments = [...assessments];
        newAssessments[index] = { ...newAssessments[index], [field]: value };
        setAssessments(newAssessments);
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTask.nome && newTask.data && newTask.prioridade) {
            addTask({
                id: crypto.randomUUID(),
                disciplinaId: subject.id,
                nome: newTask.nome,
                data: newTask.data,
                prioridade: newTask.prioridade as 'baixa' | 'media' | 'alta',
                status: 'pendente'
            });
            setIsTaskModalOpen(false);
            setNewTask({ nome: '', data: '', prioridade: 'media' });
        }
    };

    // Calculations
    const totalWeight = assessments.reduce((acc, curr) => acc + curr.peso, 0);
    const filledAssessments = assessments.filter(a => a.nota !== null);
    const currentWeight = filledAssessments.reduce((acc, curr) => acc + curr.peso, 0);
    const weightedSum = filledAssessments.reduce((acc, curr) => acc + (curr.nota! * curr.peso), 0);

    const currentAverage = currentWeight > 0 ? (weightedSum / currentWeight).toFixed(1) : '-';
    const projectedAverage = totalWeight > 0 ? (weightedSum / totalWeight).toFixed(1) : '-';

    // Calculate needed grade
    const targetAverage = 6;
    const neededScore = (targetAverage * totalWeight) - weightedSum;
    const remainingWeight = totalWeight - currentWeight;

    let statusMessage = '';
    if (remainingWeight <= 0) {
        statusMessage = Number(projectedAverage) >= 6 ? 'Aprovado! 🎉' : 'Reprovado 😔';
    } else {
        const needed = neededScore / remainingWeight;
        if (needed < 0) statusMessage = 'Já passou! 🎉';
        else if (needed > 10) statusMessage = 'Matematicamente impossível 😔';
        else statusMessage = `Precisa de média ${needed.toFixed(1)} no restante`;
    }

    return (
        <div className="space-y-8">
            <button
                onClick={() => navigate('/disciplinas')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft size={20} /> Voltar
            </button>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{subject.nome}</h1>
                <p className="text-gray-500 text-lg">Professor: {subject.professor}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Grade Simulator */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                                <Calculator className="text-indigo-600" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Simulador de Notas</h2>
                        </div>
                        <button
                            onClick={addAssessment}
                            className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors font-medium flex items-center gap-1"
                        >
                            <Plus size={16} /> Adicionar
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        {assessments.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">Nenhuma avaliação cadastrada.</p>
                        ) : (
                            assessments.map((assessment, index) => (
                                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl group">
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            value={assessment.nome}
                                            onChange={(e) => updateAssessment(index, 'nome', e.target.value)}
                                            className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-900 focus:ring-0 placeholder-gray-400"
                                            placeholder="Nome da avaliação"
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">Peso:</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={assessment.peso}
                                                onChange={(e) => updateAssessment(index, 'peso', parseFloat(e.target.value) || 0)}
                                                className="w-16 bg-white border border-gray-200 rounded px-2 py-0.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            step="0.1"
                                            value={assessment.nota ?? ''}
                                            onChange={(e) => updateAssessment(index, 'nota', e.target.value ? parseFloat(e.target.value) : null)}
                                            className="w-20 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-center font-medium"
                                            placeholder="Nota"
                                        />
                                        <button
                                            onClick={() => removeAssessment(index)}
                                            className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remover avaliação"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Média Parcial:</span>
                            <span className="font-bold text-gray-900">{currentAverage}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Média Final Projetada:</span>
                            <span className="font-bold text-gray-900">{projectedAverage}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                            <div className="text-center font-medium text-indigo-600">
                                {statusMessage}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSaveGrades}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors font-medium"
                    >
                        <Save size={18} />
                        Salvar Notas
                    </button>
                </div>

                {/* Tasks List */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Tarefas da Disciplina</h2>
                        <button
                            onClick={() => setIsTaskModalOpen(true)}
                            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {subjectTasks.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">Nenhuma tarefa cadastrada</p>
                        ) : (
                            subjectTasks.map(task => (
                                <div key={task.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{task.nome}</h4>
                                        <p className="text-xs text-gray-500">
                                            {new Date(task.data).toLocaleDateString()} • {task.prioridade}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${task.status === 'concluida' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {task.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add Task Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Nova Tarefa</h2>
                        <form onSubmit={handleAddTask} className="space-y-4">
                            <input
                                required
                                type="text"
                                placeholder="Nome da tarefa"
                                value={newTask.nome}
                                onChange={e => setNewTask({ ...newTask, nome: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                            />
                            <input
                                required
                                type="date"
                                value={newTask.data}
                                onChange={e => setNewTask({ ...newTask, data: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                            />
                            <select
                                value={newTask.prioridade}
                                onChange={e => setNewTask({ ...newTask, prioridade: e.target.value as any })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                            >
                                <option value="baixa">Baixa Prioridade</option>
                                <option value="media">Média Prioridade</option>
                                <option value="alta">Alta Prioridade</option>
                            </select>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsTaskModalOpen(false)}
                                    className="flex-1 py-2 bg-gray-100 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg"
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
