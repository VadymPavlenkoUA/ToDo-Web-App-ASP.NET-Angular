import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard-guard';

export const routes: Routes = [

  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },

  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register/register')
        .then(m => m.Register)
  },

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/main-layout/main-layout')
        .then(m => m.MainLayout),

    children: [
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full'
      },

      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/task-list/task-list')
            .then(m => m.TaskList)
      },

      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/category-list/category-list')
            .then(m => m.CategoryList)
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];