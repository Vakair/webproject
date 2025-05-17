import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SessionService, Session } from '../../services/session.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: any;
  userName: string = '';
  userSessions: Session[] = [];

  errorMessage: string = '';
  successMessage: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  private sessionsSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getUserProfileData(this.currentUser.uid).then(profileData => {
      if (profileData && profileData.name) {
        this.userName = profileData.name;
      }
    }).catch(error => {
      console.error('Nem sikerült betölteni a profil adatokat:', error);
    });

    this.sessionsSubscription = this.sessionService.getUserSessionsDetailed().subscribe(sessions => {
      this.userSessions = sessions;
    });
  }

  ngOnDestroy(): void {
    this.sessionsSubscription?.unsubscribe();
    console.log('ProfileComponent destroyed, leiratkozva a sessions előfizetésről.');
  }

  async changePassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.newPassword !== this.confirmNewPassword) {
      this.errorMessage = 'Az új jelszavak nem egyeznek!';
      return;
    }
    if (this.newPassword.length < 6) {
      this.errorMessage = 'A jelszónak legalább 6 karakter hosszúnak kell lennie!';
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(this.currentUser.email, this.oldPassword);
      await reauthenticateWithCredential(this.currentUser, credential);
      await updatePassword(this.currentUser, this.newPassword);

      this.successMessage = 'Jelszó sikeresen módosítva.';
      this.oldPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
    } catch (error: any) {
      this.errorMessage = error.message || 'Hiba történt a jelszó módosításakor.';
    }
  }

  async deleteProfile() {
    this.errorMessage = '';
    this.successMessage = '';

    const confirmed = confirm('Biztosan törölni szeretnéd a profilodat? Ez a művelet visszafordíthatatlan!');
    if (!confirmed) return;

    if (!this.oldPassword) {
      this.errorMessage = 'Kérlek add meg a jelszavadat a profil törléséhez.';
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(this.currentUser.email, this.oldPassword);
      await reauthenticateWithCredential(this.currentUser, credential);

      await this.authService.deleteUserProfileData(this.currentUser.uid);

      await deleteUser(this.currentUser);

      this.successMessage = 'Profil sikeresen törölve.';
      await this.authService.logout();
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Hiba történt a profil törlésekor.';
    }
  }

  removeSession(sessionId: string): void {
  this.sessionService.removeUserSession(sessionId).then(() => {
    // Törlés után újratöltjük a felhasználó óráit
    this.sessionService.getUserSessionsDetailed().subscribe(sessions => {
      this.userSessions = sessions;
    });
  }).catch(error => {
    console.error('Hiba a session törlésekor:', error);
  });
}
}
