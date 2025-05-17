import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor(
    private router: Router,
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.auth.onAuthStateChanged((user) => {
      this.isLoggedIn.next(!!user);
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(newUser: { email: string; password: string; name: string }): Promise<boolean> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        newUser.email,
        newUser.password
      );

      const uid = userCredential.user?.uid;
      if (!uid) {
        throw new Error('A felhasználó azonosító nem érhető el.');
      }

      const userRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userRef, {
        email: newUser.email,
        name: newUser.name,
        uid: uid
      });

      return true;
    } catch (error: any) {
      console.error('Registration failed:', error);

      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Ez az email cím már használatban van.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Érvénytelen email cím.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('A jelszó túl gyenge.');
      } else {
        throw new Error('Ismeretlen hiba történt a regisztráció során.');
      }
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/']);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  async getUserProfileData(uid: string): Promise<any> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  async deleteUserProfileData(uid: string): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', uid);
    await deleteDoc(userDocRef);
  }
}
