import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './pages/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  // A bejelentkezett felhasználó állapotának figyelemmel kísérése
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
