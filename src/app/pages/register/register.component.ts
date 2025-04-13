import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // Ellenőrizzük, hogy a jelszavak egyeznek-e
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'A jelszavak nem egyeznek!';
      return;
    }

    // Regisztráció
    const success = this.authService.register({
      name: this.user.name,
      email: this.user.email,
      password: this.user.password
    });

    if (!success) {
      this.errorMessage = 'Ez az email már használatban van!';
    } else {
      this.router.navigate(['/login']);
    }
  }
}
