import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionsUrl = 'assets/sessions.json';
  private userSessionsSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  getSessions(): Observable<any[]> {
    return this.http.get<any[]>(this.sessionsUrl);
  }

  getUserSessions(): Observable<any[]> {
    return this.userSessionsSubject.asObservable();
  }

  addUserSession(session: any): void {
    const current = this.userSessionsSubject.value;
    const updated = [...current, session];
    this.userSessionsSubject.next(updated);
  }

  removeUserSession(sessionId: number): void {
    const updated = this.userSessionsSubject.value.filter(s => s.id !== sessionId);
    this.userSessionsSubject.next(updated);
  }
  
  
  
}
