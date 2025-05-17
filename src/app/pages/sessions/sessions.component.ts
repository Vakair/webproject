import { Component, OnInit } from '@angular/core';
import { SessionService, Session } from '../../services/session.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SessionCardComponent } from './sessionCard.component';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, RouterModule, SessionCardComponent],
  template: `
    <h2>Elérhető jógaórák</h2>

    <app-session-card
      *ngFor="let s of sessions"
      [title]="s.title"
      [date]="s.date"
      [location]="s.location"
      [tartja]="s.tartja"
      [booked]="isAlreadyBooked(s.id)"
      (book)="signUp(s)"
      (cancel)="cancelSignUp(s)"
      (rate)="handleRate(s, $event)">
    </app-session-card>
  `,
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {

  sessions: Session[] = [];
  bookedIds: string[] = [];

  constructor(private sessionService: SessionService,
              public  authService: AuthService) {}

  ngOnInit(): void {
    // Összes óra
    this.sessionService.getSessions()
        .subscribe(list => this.sessions = list);

    // User foglalásai (ID‑lista)
    this.sessionService.getUserSessions()
        .subscribe(ids => this.bookedIds = ids);
  }

  

  /* ------------- @Output‑ok fogadása ------------- */

  async signUp(session: Session) {
    if (!this.authService.isAuthenticated()) {
      alert('Bejelentkezés szükséges az óra jelentkezéséhez.'); return;
    }
    if (this.isAlreadyBooked(session.id)) {
      alert('Már jelentkeztél erre az órára!'); return;
    }
    await this.sessionService.addUserSession(session.id);
    this.bookedIds.push(session.id);
    alert(`Sikeresen jelentkeztél a "${session.title}" órára!`);
  }

  async cancelSignUp(session: Session) {
    await this.sessionService.removeUserSession(session.id);
    this.bookedIds = this.bookedIds.filter(id => id !== session.id);
    alert(`Lemondtad a(z) "${session.title}" órát.`);
  }

  async handleRate(session: Session, rating: number) {
    await this.sessionService.rateSession(session.id, rating);
    alert(`Köszönjük! A "${session.title}" órát ${rating}★‑ra értékelted.`);
  }

  /* helper */
  isAlreadyBooked(sessionId: string): boolean {
    return this.bookedIds.includes(sessionId);
  }
}
