import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './pages/register/register.component';
import { FirestoreDatePipe } from './pipe/firestore-date.pipe';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'yoga-site-fin';
  constructor(private authService: AuthService) {}

  // A bejelentkezett felhasználó állapotának figyelemmel kísérése
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
