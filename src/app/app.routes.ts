import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SessionsComponent } from './pages/sessions/sessions.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sessions', component: SessionsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent }
];
