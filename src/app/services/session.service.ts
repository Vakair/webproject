import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  Timestamp
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, of, from, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export interface Session {
  id: string;
  title: string;
  tartja: string;
  date: Timestamp;
  location: string;
}

@Injectable({ providedIn: 'root' })
export class SessionService {

  constructor(private firestore: Firestore,
              private auth: Auth) {}

  // Összes jógaóra lekérése
  getSessions(): Observable<Session[]> {
    const coll = collection(this.firestore, 'sessions');
    return collectionData(coll, { idField: 'id' }).pipe(
      map(sessions => sessions.map(s => ({
        ...s,
        date: s['date'] instanceof Timestamp ? s['date'] : Timestamp.fromDate(new Date(s['date']))
      })))
    ) as Observable<Session[]>;
  }

  // Csak az adott user által foglalt session ID-k lekérése (string tömb)
  getUserSessions(): Observable<string[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) { return of([]); }
        const ref = doc(this.firestore, 'Users', user.uid);
        return from(getDoc(ref)).pipe(
          map(snap => (snap.data()?.['sessions'] ?? []) as string[])
        );
      })
    );
  }

  // Új metódus: user session ID-k alapján a részletes Session objektumok lekérése
  // Új metódus: user session ID-k alapján a részletes Session objektumok lekérése
getUserSessionsDetailed(): Observable<Session[]> {
  return authState(this.auth).pipe(
    switchMap(user => {
      if (!user) { return of([]); }
      const userDocRef = doc(this.firestore, 'users', user.uid);
      return from(getDoc(userDocRef)).pipe(
        switchMap(userSnap => {
          const sessionIds: string[] = userSnap.data()?.['sessions'] ?? [];
          if (sessionIds.length === 0) {
            return of([]);
          }
          const sessionDocs = sessionIds.map(id => getDoc(doc(this.firestore, 'sessions', id)));
          return forkJoin(sessionDocs).pipe(
            map(snaps => snaps
              .filter(snap => snap.exists())
              .map(snap => {
                const data = snap.data();
                return {
                  id: snap.id,
                  title: data?.['title'],
                  tartja: data?.['tartja'], // <<< EZT használjuk
                  date: data?.['date'] instanceof Timestamp ? data['date'] : Timestamp.fromDate(new Date(data?.['date'])),
                  location: data?.['location']
                } as Session;
              })
            )
          );
        })
      );
    })
  );
}


  // Új foglalás hozzáadása a userhez
  async addUserSession(sessionId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
    const ref = doc(this.firestore, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      // Ha nincs user dokumentum, létrehozás sessions tömbbel
      await setDoc(ref, { sessions: [sessionId] });
    } else {
      const current: string[] = snap.data()?.['sessions'] ?? [];
      if (!current.includes(sessionId)) {
        await updateDoc(ref, { sessions: [...current, sessionId] });
      }
    }
  }

  // Foglalás törlése
  async removeUserSession(sessionId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) { return; }
    const ref = doc(this.firestore, 'users', user.uid);
    const snap = await getDoc(ref);
    const current: string[] = snap.data()?.['sessions'] ?? [];
    await updateDoc(ref, { sessions: current.filter(id => id !== sessionId) });
  }

  // Példa értékelés mentése
  async rateSession(sessionId: string, rating: number): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) { return; }
    const ratingRef = doc(this.firestore,
                          'Users', user.uid,
                          'ratings', sessionId);
    await setDoc(ratingRef, { stars: rating });
  }
}
