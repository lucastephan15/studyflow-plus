import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, Book, GraduationCap, ChevronRight, X, Pencil, Trash2 } from 'lucide-react';
import type { Subject } from '../types';

export const Subjects: React.FC = () => {
    const { subjects, addSubject, updateSubject, deleteSubject } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [formData, setFormData] = useState({ nome: '', professor: '' });

    const openModal = (subject?: Subject) => {
        if (subject) {
            setEditingSubject(subject);
            setFormData({ nome: subject.nome, professor: subject.professor });
        } else {
            setEditingSubject(null);
            setFormData({ nome: '', professor: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSubject) {
            updateSubject({
                ...editingSubject,
                nome: formData.nome,
                professor: formData.professor
            });
        } else {
            const subject: Subject = {
                id: crypto.randomUUID(),
                nome: formData.nome,
                professor: formData.professor,
                avaliacoes: []
            };
            addSubject(subject);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent navigation
        if (window.confirm('Tem certeza que deseja excluir esta disciplina? Todas as tarefas associadas também serão excluídas.')) {
            deleteSubject(id);
        }
    };

    const calculateAverage = (subject: Subject) => {
        const gradedAssessments = subject.avaliacoes.filter(a => a.nota !== null);
        if (gradedAssessments.length === 0) return null;

        const totalWeight = gradedAssessments.reduce((acc, curr) => acc + curr.peso, 0);
        const weightedSum = gradedAssessments.reduce((acc, curr) => acc + (curr.nota! * curr.peso), 0);

        return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(1) : null;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Disciplinas</h1>
                    <p className="text-gray-500 mt-1">Gerencie suas matérias e notas</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-indigo-200"
                >
                    <Plus size={20} />
                    Nova Disciplina
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => {
                    const average = calculateAverage(subject);
                    return (
                        <Link
                            key={subject.id}
                            to={`/disciplinas/${subject.id}`}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group relative"
                        >
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openModal(subject);
                                    }}
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="Editar"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, subject.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Excluir"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-indigo-50 p-3 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                    <Book className="text-indigo-600" size={24} />
                                </div>
                                {average && (
                                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${Number(average) >= 6 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        Média: {average}
                                    </div>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-1">{subject.nome}</h3>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                <GraduationCap size={16} />
                                {subject.professor}
                            </div>

                            <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                Ver detalhes <ChevronRight size={16} />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {subjects.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <Book className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900">Nenhuma disciplina cadastrada</h3>
                    <p className="text-gray-500">Comece adicionando suas matérias.</p>
                </div>
            )}

            {/* Add/Edit Subject Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingSubject ? 'Editar Disciplina' : 'Nova Disciplina'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Matéria</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Ex: Cálculo I"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Professor</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.professor}
                                    onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Ex: João Silva"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
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
