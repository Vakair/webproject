import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = new BehaviorSubject<boolean>(this.getCurrentUser() !== null);
  isLoggedIn$ = this.isLoggedIn.asObservable();

  private user: any = null;

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    const testUser = { email: 'teszt@example.com', password: '1234', name: 'Teszt Felhasználó' };

    if (email === testUser.email && password === testUser.password) {
      this.user = testUser;
      localStorage.setItem('user', JSON.stringify(this.user));
      this.isLoggedIn.next(true);
      return true;
    }

    return false;
  }

  register(newUser: any): boolean {
    // csak dummy validáció (később bővíthető)
    if (newUser.email === 'teszt@example.com') {
      return false;
    }

    this.user = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
    this.isLoggedIn.next(true);
    return true;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.user = null;
    this.isLoggedIn.next(false);
    this.router.navigate(['/']);
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
