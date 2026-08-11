import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { RegisterRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register', 
  standalone: true, 
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html', 
  styleUrl: './register.css'})
export class Register {

  registerRequest: RegisterRequest = 
  {
    email: '',
    password: ''
  };

  confirmPassword = '';
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router, 
    private cdr: ChangeDetectorRef) {}

  onSubmit(): void 
  {
    if (!this.registerRequest.email || !this.registerRequest.password) 
    {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    if (this.registerRequest.password !== this.confirmPassword) 
    {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.registerRequest.email)) 
    {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    this.cdr.detectChanges();

    this.authService.register(this.registerRequest).subscribe(
    {
      next: () => 
      {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/tasks']);
      },
      error: error => 
      {
        this.isLoading = false;
        this.errorMessage = error.error?.message ?? 'Registration failed.';
        this.cdr.detectChanges();
      }
    });
  }

  togglePassword(): void 
  {
    this.showPassword = !this.showPassword;
  }
}