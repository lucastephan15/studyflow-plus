import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Subject, Task } from '../types';

interface AppContextType {
    user: User | null;
    login: (username: string) => void;
    logout: () => void;
    subjects: Subject[];
    addSubject: (subject: Subject) => void;
    updateSubject: (subject: Subject) => void;
    deleteSubject: (subjectId: string) => void;
    tasks: Task[];
    addTask: (task: Task) => void;
    updateTask: (task: Task) => void;
    deleteTask: (taskId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // User State
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('studyflow_user');
        return stored ? JSON.parse(stored) : null;
    });

    // Subjects State
    const [subjects, setSubjects] = useState<Subject[]>(() => {
        const stored = localStorage.getItem('studyflow_subjects');
        return stored ? JSON.parse(stored) : [];
    });

    // Tasks State
    const [tasks, setTasks] = useState<Task[]>(() => {
        const stored = localStorage.getItem('studyflow_tasks');
        return stored ? JSON.parse(stored) : [];
    });

    // Persistence Effects
    useEffect(() => {
        if (user) {
            localStorage.setItem('studyflow_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('studyflow_user');
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('studyflow_subjects', JSON.stringify(subjects));
    }, [subjects]);

    useEffect(() => {
        localStorage.setItem('studyflow_tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Actions
    const login = (username: string) => {
        setUser({ username, isAuthenticated: true });
    };

    const logout = () => {
        setUser(null);
    };

    const addSubject = (subject: Subject) => {
        setSubjects([...subjects, subject]);
    };

    const updateSubject = (updatedSubject: Subject) => {
        setSubjects(subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s));
    };

    const addTask = (task: Task) => {
        setTasks([...tasks, task]);
    };

    const updateTask = (updatedTask: Task) => {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const deleteTask = (taskId: string) => {
        setTasks(tasks.filter(t => t.id !== taskId));
    };

    const deleteSubject = (subjectId: string) => {
        setSubjects(subjects.filter(s => s.id !== subjectId));
        // Also delete associated tasks
        setTasks(tasks.filter(t => t.disciplinaId !== subjectId));
    };

    return (
        <AppContext.Provider value={{
            user, login, logout,
            subjects, addSubject, updateSubject, deleteSubject,
            tasks, addTask, updateTask, deleteTask
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
