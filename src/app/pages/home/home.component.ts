import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  instructors: any[] = [];
  upcomingSessions: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/assets/instructors.json').subscribe(data => {
      this.instructors = data;
    });

    this.http.get<any[]>('/assets/sessions.json').subscribe(data => {
      const sorted = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.upcomingSessions = sorted.slice(0, 3);
    });
  }
}
