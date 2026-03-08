import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(private router: Router) {}

  onSubmit() {
    this.errorMessage.set('');

    if (!this.email() || !this.password()) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    this.isLoading.set(true);

    // Simulate authentication
    setTimeout(() => {
      if (this.email() === 'admin@example.com' && this.password() === 'password') {
        this.router.navigate(['/']);
      } else {
        this.errorMessage.set('Invalid email or password.');
      }
      this.isLoading.set(false);
    }, 1000);
  }
}