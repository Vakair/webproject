import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';

export const LoggedInGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Ha be van jelentkezve, ne engedjük el a login/register oldalra
        router.navigate(['/']);
        resolve(false);
      } else {
        // Ha nincs bejelentkezve, mehet tovább az oldal
        resolve(true);
      }
    });
  });
};
