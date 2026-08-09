export interface Task {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
  dueDate: string | null;
  categoryId: number | null;
  categoryName: string | null;
}

export interface TaskListResponse {
  items: Task[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  categoryId?: number | null;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string | null;
  isCompleted: boolean;
  dueDate?: string | null;
  categoryId?: number | null;
}