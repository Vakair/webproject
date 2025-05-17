import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SessionsComponent } from './pages/sessions/sessions.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoggedInGuard } from './guards/logged-in.guard'; // Győződj meg róla, hogy ez létezik

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sessions', component: SessionsComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoggedInGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard] },
  { path: 'profile', component: ProfileComponent }
];
