import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  userSessions: any[] = [];

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

    this.sessionService.getUserSessions().subscribe(sessions => {
      this.userSessions = sessions;
    });
  }

  removeSession(sessionId: number): void {
    this.sessionService.removeUserSession(sessionId);
  }
  


}
