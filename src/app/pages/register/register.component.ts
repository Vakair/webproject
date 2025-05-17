import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  // Felhasználói adatok tárolása
  user = {
    name: '',
    email: '',
    password: '',
    sessions: []
  };
  confirmPassword: string = '';  // Jelszó megerősítés mező
  errorMessage: string = '';     // Hibaüzenet megjelenítéshez

  constructor(private authService: AuthService, private router: Router) {}

  // Regisztrációs űrlap elküldése
  async onSubmit() {
    this.errorMessage = ''; // Hibaüzenet alaphelyzetbe állítása

    // Jelszavak egyezőségének ellenőrzése
    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'A jelszavak nem egyeznek!';
      return;
    }

    // Jelszó hosszának ellenőrzése (minimum 6 karakter)
    if (this.user.password.length < 6) {
      this.errorMessage = 'A jelszónak legalább 6 karakter hosszúnak kell lennie!';
      return;
    }

    try {
      // AuthService-ben lévő regisztrációs függvény meghívása
      await this.authService.register(this.user);

      
      this.router.navigate(['/profile']);
    } catch (error: any) {
      console.error('Regisztrációs hiba:', error);

      // Hibakódok kezelése és felhasználónak való megjelenítés
      if (error.message) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'Hiba történt a regisztráció során.';
      }
    }
  }
}
