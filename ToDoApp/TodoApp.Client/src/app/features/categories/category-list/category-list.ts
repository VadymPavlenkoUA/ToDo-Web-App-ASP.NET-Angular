import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CategoryService } from '../../../core/services/category';
import { CategoryResponse } from '../../../core/models/category.model';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList implements OnInit {

  categories: CategoryResponse[] = [];

  isLoading = false;
  errorMessage = '';

  showForm = false;
  categoryName = '';
  isSaving = false;

  editingCategoryId: number | null = null;
  editingCategoryName = '';

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: error => {
        console.error(error);

        this.errorMessage =
          error.error?.message ?? 'Failed to load categories.';

        this.isLoading = false;

        this.cdr.detectChanges();
      }
    });
  }

  createCategory(): void {
    this.errorMessage = '';

    const name = this.categoryName.trim();

    if (!name) {
      this.errorMessage = 'Category name is required.';
      return;
    }

    if (name.length > 50) {
      this.errorMessage =
        'Category name cannot exceed 50 characters.';
      return;
    }

    this.isSaving = true;

    this.categoryService.createCategory({
      name
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.showForm = false;
        this.categoryName = '';

        this.loadCategories();
      },

      error: error => {
        console.error(error);

        this.errorMessage =
          error.error?.message ?? 'Failed to create category.';

        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(category: CategoryResponse): void {
    this.editingCategoryId = category.id;
    this.editingCategoryName = category.name;
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.editingCategoryName = '';
    this.errorMessage = '';
  }

  updateCategory(): void {
    if (this.editingCategoryId === null) {
      return;
    }

    this.errorMessage = '';

    const name = this.editingCategoryName.trim();

    if (!name) {
      this.errorMessage = 'Category name is required.';
      return;
    }

    if (name.length > 50) {
      this.errorMessage =
        'Category name cannot exceed 50 characters.';
      return;
    }

    this.isSaving = true;

    this.categoryService.updateCategory(
      this.editingCategoryId,
      { name }
    ).subscribe({
      next: () => {
        this.isSaving = false;
        this.editingCategoryId = null;
        this.editingCategoryName = '';

        this.loadCategories();
      },

      error: error => {
        console.error(error);

        this.errorMessage =
          error.error?.message ?? 'Failed to update category.';

        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteCategory(category: CategoryResponse): void {
    const confirmed = confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.isSaving = true;

    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.isSaving = false;
        this.loadCategories();
      },

      error: error => {
        console.error(error);

        this.errorMessage =
          error.error?.message ?? 'Failed to delete category.';

        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.categoryName = '';
    this.errorMessage = '';
  }

  closeForm(): void {
    if (this.isSaving) {
      return;
    }

    this.showForm = false;
    this.categoryName = '';
    this.errorMessage = '';
  }
}