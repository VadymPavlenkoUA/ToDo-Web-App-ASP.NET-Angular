import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TaskService } from '../../../core/services/task';
import { Task } from '../../../core/models/task.model';
import { TaskForm } from '../task-form/task-form';
import { TaskEditForm } from '../task-edit-form/task-edit-form';
import { DatePipe } from '@angular/common';
import { CategoryService } from '../../../core/services/category';
import { CategoryResponse } from '../../../core/models/category.model';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast';
import { ConfirmModal } from '../../../shared/confirm-modal/confirm-modal';

@Component({
  selector: 'app-task-list', 
  standalone: true,
  imports: [TaskForm, TaskEditForm, DatePipe, FormsModule, ConfirmModal],
  templateUrl: './task-list.html', 
  styleUrl: './task-list.css'})
export class TaskList implements OnInit 
{

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

  private searchSubject = new Subject<string>();

  taskToDelete: Task | null = null;

  constructor(private taskService: TaskService, private categoryService: CategoryService, 
    private cdr: ChangeDetectorRef, private toastService: ToastService) {}

  ngOnInit(): void 
  {
    this.loadCategories();
    this.loadTasks();

    this.searchSubject.pipe(debounceTime(500)).subscribe(() => 
      {
        this.pageNumber = 1;
        this.loadTasks();
      });
  }

  loadTasks(): void 
  {
    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.getTasks(
      this.search || undefined,
      this.selectedCategoryId ?? undefined,
      this.pageNumber,
      this.pageSize
    ).subscribe(
    {
      next: response => 
      {
        this.tasks = response.items;
        this.totalCount = response.totalCount;
        this.pageNumber = response.pageNumber;
        this.pageSize = response.pageSize;
        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: error => 
      {
        this.errorMessage = error.error?.message ?? 'Failed to load tasks.';
        this.isLoading = false;

        this.cdr.detectChanges();
      }
    });
  }

  loadCategories(): void 
  {
    this.categoryService.getCategories().subscribe(
      {
      next: categories => 
      {
        this.categories = categories;
        this.cdr.detectChanges();
      },

      error: error => 
      {
        console.error('Failed to load categories:', error);
      }
    });
  }

  openForm(): void 
  {
    this.showForm = true;
  }

  closeForm(): void 
  {
    this.showForm = false;
  }

  onTaskCreated(): void 
  {
    this.showForm = false;
    this.toastService.success('Task created successfully.');
    this.loadTasks();
  }

  onSearch(): void 
  {
    this.isLoading = true;
    this.searchSubject.next(this.search);
    this.cdr.detectChanges();
  }

  searchImmediately(): void {
    this.pageNumber = 1;
    this.loadTasks();
  }

  onCategoryChange(): void 
  {
    this.pageNumber = 1;
    this.loadTasks();
    this.cdr.detectChanges();
  }

  startEdit(task: Task): void {
    this.editingTaskId = task.id;
  }

  cancelEdit(): void {
    this.editingTaskId = null;
  }

  onTaskUpdated(): void {
    this.editingTaskId = null;
    this.toastService.success('Task updated successfully.');
    this.loadTasks();
  }

  get totalPages(): number 
  {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  goToPage(page: number): void 
  {
    if (page < 1 || page > this.totalPages) 
    {
      return;
    }

    this.pageNumber = page;
    this.loadTasks();
  }

  previousPage(): void 
  {
    this.goToPage(this.pageNumber - 1);
  }

  nextPage(): void 
  {
    this.goToPage(this.pageNumber + 1);
  }

  get visiblePages(): (number | '...')[] 
  {
    const pages: (number | '...')[] = []; 
    const total = this.totalPages;
    const current = this.pageNumber;

    if (total <= 7) 
    {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (current > 3) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push('...');

    pages.push(total);

    return pages;
  }

  goToFirstPage(): void 
  {
    this.goToPage(1);
  }

  goToLastPage(): void 
  {
    this.goToPage(this.totalPages);
  }

  deleteTask(task: Task): void 
  {
    this.taskToDelete = task;
  }

  confirmDeleteTask(): void 
  {
    if (!this.taskToDelete) 
    {
      return;
    }

    const task = this.taskToDelete;

    this.taskService.delete(task.id).subscribe(
    {
      next: () => 
      {
        this.taskToDelete = null;
        this.toastService.success('Task deleted successfully.');
        this.loadTasks();
      },

      error: error => 
      {
        console.error(error);
        this.taskToDelete = null;
        this.errorMessage = error.error?.message ?? 'Failed to delete task.';
        this.toastService.error('Failed to delete task.');
        this.cdr.detectChanges();
      }
    });
  }

  toggleCompleted(task: Task): void 
  {
    const request = {
      title: task.title,
      description: task.description,
      isCompleted: !task.isCompleted,
      dueDate: task.dueDate,
      categoryId: task.categoryId
    };

    this.taskService.update(task.id, request).subscribe(
    {
      next: () => 
      {
        task.isCompleted = !task.isCompleted;
        this.cdr.detectChanges();
      },

      error: error => 
      {
        console.error(error);
        this.errorMessage = error.error?.message ?? 'Failed to update task status.';
        this.cdr.detectChanges();
      }
    });
  }

  isOverdue(task: Task): boolean 
  {
    if (!task.dueDate || task.isCompleted) 
    {
      return false;
    }

    return new Date(task.dueDate) < new Date();
  }
}