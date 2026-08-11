import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task';
import { CreateTaskRequest } from '../../../core/models/task.model';
import { CategoryService } from '../../../core/services/category';
import { CategoryResponse } from '../../../core/models/category.model';

@Component({
  selector: 'app-task-form', 
  standalone: true, 
  imports: [FormsModule],
  templateUrl: './task-form.html', 
  styleUrl: './task-form.css'})
export class TaskForm implements OnInit 
{

  @Output() taskCreated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  categories: CategoryResponse[] = [];

  task: CreateTaskRequest = 
  {
    title: '',
    description: '',
    dueDate: null,
    categoryId: null
  };

  isLoading = false;
  errorMessage = '';

  constructor(private taskService: TaskService, private categoryService: CategoryService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void 
  {
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
    const title = this.task.title.trim();

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

    if (this.task.description && this.task.description.length > 1000) 
    {
      this.errorMessage = 'Description cannot exceed 1000 characters.';
      return;
    }

    this.task.title = title;
    this.isLoading = true;

    this.taskService.create(this.task).subscribe(
    {
      next: () => 
      {
        this.isLoading = false;
        this.taskCreated.emit();
      },

      error: error => 
      {
        console.error(error);
        this.errorMessage = error.error?.message ?? 'Failed to create task.';
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