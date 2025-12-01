import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Calendar: React.FC = () => {
    const { tasks } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Add empty days for start of week padding
    const startDay = monthStart.getDay();
    const blanks = Array(startDay).fill(null);

    const getEventsForDay = (date: Date) => {
        return tasks.filter(task => isSameDay(new Date(task.data), date));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Calendário</h1>
                    <p className="text-gray-500 mt-1">Visualize seus prazos e eventos</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-lg font-bold text-gray-900 min-w-[150px] text-center capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                        <div key={day} className="py-4 text-center text-sm font-bold text-gray-500 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 auto-rows-fr">
                    {blanks.map((_, i) => (
                        <div key={`blank-${i}`} className="min-h-[120px] bg-gray-50/30 border-b border-r border-gray-100 last:border-r-0" />
                    ))}

                    {daysInMonth.map((date) => {
                        const events = getEventsForDay(date);
                        const isCurrentMonth = isSameMonth(date, currentDate);
                        const isDayToday = isToday(date);

                        return (
                            <div
                                key={date.toString()}
                                className={`min-h-[120px] p-2 border-b border-r border-gray-100 last:border-r-0 transition-colors hover:bg-gray-50 ${!isCurrentMonth ? 'bg-gray-50/50' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`
                    w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium
                    ${isDayToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}
                  `}>
                                        {format(date, 'd')}
                                    </span>
                                    {events.length > 0 && (
                                        <span className="text-xs font-medium text-gray-400">
                                            {events.length} eventos
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    {events.map((event) => (
                                        <div
                                            key={event.id}
                                            className={`text-xs px-2 py-1 rounded truncate border ${event.status === 'concluida'
                                                    ? 'bg-gray-100 text-gray-500 border-gray-200 line-through'
                                                    : event.prioridade === 'alta'
                                                        ? 'bg-red-50 text-red-700 border-red-100'
                                                        : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                                }`}
                                            title={event.nome}
                                        >
                                            {event.nome}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
