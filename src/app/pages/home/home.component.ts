import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Firestore, collectionData, collection, query, where, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirestoreDatePipe } from '../../pipe/firestore-date.pipe';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FirestoreDatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  instructors: any[] = [];
  upcomingSessions: any[] = [];

  constructor(private http: HttpClient, private firestore: Firestore) {}

  ngOnInit(): void {
    // Az oktatókat maradhat JSON-ból betölteni
    this.http.get<any[]>('/assets/instructors.json').subscribe(data => {
      this.instructors = data;
    });

    // Firestore-ból töltjük be a következő 3 jógaórát (dátum szerint szűrve)
    const now = new Date();
    const sessionsRef = collection(this.firestore, 'sessions');
    const q = query(
      sessionsRef,
      where('date', '>=', now),
      orderBy('date', 'asc')
    );

    collectionData(q, { idField: 'id' }).subscribe(sessions => {
      this.upcomingSessions = sessions.slice(0, 3);
    });
  }
}


