export interface User {
    username: string;
    isAuthenticated: boolean;
}

export interface Assessment {
    nome: string;
    peso: number;
    nota: number | null;
}

export interface Subject {
    id: string;
    nome: string;
    professor: string;
    avaliacoes: Assessment[];
}

export interface Task {
    id: string;
    disciplinaId: string;
    nome: string;
    data: string; // YYYY-MM-DD
    prioridade: 'baixa' | 'media' | 'alta';
    status: 'pendente' | 'concluida';
}
