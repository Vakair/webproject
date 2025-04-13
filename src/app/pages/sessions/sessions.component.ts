import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {
  sessions: any[] = [];

  constructor(
    private sessionService: SessionService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.sessionService.getSessions().subscribe(data => {
      this.sessions = data;
    });
  }

  signUp(session: any) {
    if (!this.authService.isAuthenticated()) {
      alert('Bejelentkezés szükséges az óra jelentkezéshez.');
      return;
    }
  
    this.sessionService.getUserSessions().subscribe(userSessions => {
      const alreadySignedUp = userSessions.some(s => s.id === session.id);
  
      if (alreadySignedUp) {
        alert('Már jelentkeztél erre az órára!');
      } else {
        this.sessionService.addUserSession(session);
        alert(`Sikeresen jelentkeztél a(z) "${session.title}" órára!`);
      }
    });
  }

  removeSession(sessionId: number): void {
    this.sessionService.removeUserSession(sessionId);
  }
  
}
