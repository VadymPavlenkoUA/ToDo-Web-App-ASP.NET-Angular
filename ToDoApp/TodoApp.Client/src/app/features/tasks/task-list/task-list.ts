import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskService } from '../../../core/services/task';
import { Task } from '../../../core/models/task.model';
import { TaskForm } from '../task-form/task-form';
import { TaskEditForm } from '../task-edit-form/task-edit-form';
import { DatePipe } from '@angular/common';
import { CategoryService } from '../../../core/services/category';
import { CategoryResponse } from '../../../core/models/category.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskForm, TaskEditForm, DatePipe, FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {

  tasks: Task[] = [];
  isLoading = false;
  errorMessage = '';
  showForm = false;

  editingTaskId: number | null = null;

  search = '';
  selectedCategoryId: number | null = null;
  categories: CategoryResponse[] = [];

  totalCount = 0;
  pageNumber = 1;
  pageSize = 10;

  constructor(private taskService: TaskService, private categoryService: CategoryService, 
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.getTasks(
      this.search || undefined,
      this.selectedCategoryId ?? undefined,
      this.pageNumber,
      this.pageSize
    ).subscribe({
      next: response => {
        console.log('LOAD SUCCESS', response);

        this.tasks = response.items;
        this.totalCount = response.totalCount;
        this.pageNumber = response.pageNumber;
        this.pageSize = response.pageSize;

        this.isLoading = false;

        console.log('TASKS:', this.tasks);
        console.log('LOADING:', this.isLoading);

        this.cdr.detectChanges();
      },
      error: error => {
        console.error('LOAD ERROR', error);

        this.errorMessage =
          error.error?.message ?? 'Failed to load tasks.';

        this.isLoading = false;

        console.log('LOADING:', this.isLoading);

        this.cdr.detectChanges();
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
        this.cdr.detectChanges();
      },

      error: error => {
        console.error('Failed to load categories:', error);
      }
    });
  }

  openForm(): void {
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  onTaskCreated(): void {
    console.log('TASK CREATED EVENT');
    this.showForm = false;
    this.loadTasks();
  }

  onSearch(): void {
    this.pageNumber = 1;
    this.loadTasks();
  }

  startEdit(task: Task): void {
    this.editingTaskId = task.id;
  }

  cancelEdit(): void {
    this.editingTaskId = null;
  }

  onTaskUpdated(): void {
    this.editingTaskId = null;
    this.loadTasks();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.pageNumber = page;
    this.loadTasks();
  }

  previousPage(): void {
    this.goToPage(this.pageNumber - 1);
  }

  nextPage(): void {
    this.goToPage(this.pageNumber + 1);
  }

  deleteTask(task: Task): void {
    const confirmed = confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';

    this.taskService.delete(task.id).subscribe({
      next: () => {
        this.loadTasks();
      },

      error: error => {
        console.error(error);

        this.errorMessage =
          error.error?.message ?? 'Failed to delete task.';

        this.cdr.detectChanges();
      }
    });
  }

  toggleCompleted(task: Task): void {
    const request = {
      title: task.title,
      description: task.description,
      isCompleted: !task.isCompleted,
      dueDate: task.dueDate,
      categoryId: task.categoryId
    };

    this.taskService.update(task.id, request).subscribe({
      next: () => {
        task.isCompleted = !task.isCompleted;
        this.cdr.detectChanges();
      },

      error: error => {
        console.error(error);

        this.errorMessage =
          error.error?.message ?? 'Failed to update task status.';

        this.cdr.detectChanges();
      }
    });
  }
}