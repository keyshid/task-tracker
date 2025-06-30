export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'To Do' | 'In Progress' | 'Done';
    dueDate?: Date;
    category: 'Work' | 'Personal' | 'Urgent' | 'Other';
    tags?: string[];
    archived: boolean;
    priority?: 'Low' | 'Medium' | 'High';
    previousStatus?: 'To Do' | 'In Progress' | 'Done';
}
