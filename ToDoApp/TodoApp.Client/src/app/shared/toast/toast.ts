import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class Toast {

  constructor(
    protected toastService: ToastService
  ) {}
}