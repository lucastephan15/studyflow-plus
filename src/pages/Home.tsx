import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle, Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { isToday, isFuture, isThisWeek, parseISO, compareAsc } from 'date-fns';

export const Home: React.FC = () => {
    const { user, tasks, subjects } = useApp();

    const todayTasks = tasks.filter(task =>
        isToday(parseISO(task.data)) && task.status === 'pendente'
    );

    const upcomingTasks = tasks
        .filter(task => {
            const date = parseISO(task.data);
            return isFuture(date) && isThisWeek(date) && !isToday(date) && task.status === 'pendente';
        })
        .sort((a, b) => compareAsc(parseISO(a.data), parseISO(b.data)));

    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.nome || 'Desconhecida';

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Olá, {user?.username}! 👋</h1>
                <p className="text-indigo-100 text-lg">
                    Você tem <span className="font-bold text-white">{todayTasks.length} tarefas</span> para hoje.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/disciplinas" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                    <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                        <BookOpen className="text-blue-600" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900">Minhas Disciplinas</h3>
                    <p className="text-sm text-gray-500 mt-1">{subjects.length} cadastradas</p>
                </Link>

                <Link to="/tarefas" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                    <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <CheckCircle className="text-green-600" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900">Tarefas Pendentes</h3>
                    <p className="text-sm text-gray-500 mt-1">{tasks.filter(t => t.status === 'pendente').length} total</p>
                </Link>

                <Link to="/calendario" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                    <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                        <Calendar className="text-purple-600" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900">Calendário</h3>
                    <p className="text-sm text-gray-500 mt-1">Ver agenda completa</p>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Today's Tasks */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                            <CheckCircle className="text-indigo-600" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Para Hoje</h2>
                    </div>

                    <div className="space-y-3">
                        {todayTasks.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">Nenhuma tarefa para hoje! 🎉</p>
                        ) : (
                            todayTasks.map(task => (
                                <div key={task.id} className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
                                    <div className={`w-1 h-10 rounded-full mr-3 ${task.prioridade === 'alta' ? 'bg-red-500' :
                                            task.prioridade === 'media' ? 'bg-orange-500' : 'bg-green-500'
                                        }`} />
                                    <div>
                                        <h4 className="font-medium text-gray-900">{task.nome}</h4>
                                        <p className="text-xs text-gray-500">{getSubjectName(task.disciplinaId)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-orange-100 p-2 rounded-lg">
                            <Clock className="text-orange-600" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Próximos Prazos</h2>
                    </div>

                    <div className="space-y-3">
                        {upcomingTasks.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">Sem prazos próximos.</p>
                        ) : (
                            upcomingTasks.map(task => (
                                <div key={task.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{task.nome}</h4>
                                        <p className="text-xs text-gray-500">
                                            {new Date(task.data).toLocaleDateString()} • {getSubjectName(task.disciplinaId)}
                                        </p>
                                    </div>
                                    <ArrowRight size={16} className="text-gray-300" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
