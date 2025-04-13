import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const success = this.authService.login(this.email, this.password);

    if (success) {
      this.router.navigate(['/profile']); // Ha sikerült a bejelentkezés, átirányítás a profil oldalra
    } else {
      this.errorMessage = 'Hibás email vagy jelszó!';
    }
  }
}
