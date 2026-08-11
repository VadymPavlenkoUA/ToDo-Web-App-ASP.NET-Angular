import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task';
import { CategoryService } from '../../../core/services/category';
import { Task, UpdateTaskRequest } from '../../../core/models/task.model';
import { CategoryResponse } from '../../../core/models/category.model';

@Component({
  selector: 'app-task-edit-form', 
  standalone: true, 
  imports: [FormsModule], 
  templateUrl: './task-edit-form.html', 
  styleUrl: './task-edit-form.css'})
export class TaskEditForm implements OnInit 
{

  @Input() task!: Task;

  @Output() taskUpdated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  categories: CategoryResponse[] = [];

  updateRequest: UpdateTaskRequest = 
  {
    title: '',
    description: '',
    isCompleted: false,
    dueDate: null,
    categoryId: null
  };

  isLoading = false;
  errorMessage = '';

  constructor(private taskService: TaskService, private categoryService: CategoryService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void 
  {
    this.updateRequest = 
    {
      title: this.task.title,
      description: this.task.description,
      isCompleted: this.task.isCompleted,
      dueDate: this.task.dueDate,
      categoryId: this.task.categoryId
    };

    this.loadCategories();
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

  onSubmit(): void 
  {
    this.errorMessage = '';
    const title = this.updateRequest.title.trim();

    if (!title) 
    {
      this.errorMessage = 'Title is required.';
      return;
    }

    if (title.length > 100) 
    {
      this.errorMessage = 'Title cannot exceed 100 characters.';
      return;
    }

    if (this.updateRequest.description && this.updateRequest.description.length > 1000) 
    {
      this.errorMessage = 'Description cannot exceed 1000 characters.';
      return;
    }

    this.updateRequest.title = title;
    this.isLoading = true;
    this.taskService.update(this.task.id, this.updateRequest).subscribe(
    {
      next: () => 
      {
        this.isLoading = false;
        this.taskUpdated.emit();
      },

      error: error => 
      {
        console.error(error);
        this.errorMessage = error.error?.message ?? 'Failed to update task.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCancel(): void 
  {
    if (!this.isLoading) 
    {
      this.cancelled.emit();
    }
  }
}