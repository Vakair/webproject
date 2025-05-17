import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-session-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <article class="card">
      <h3>{{ title }}</h3>
      <p><strong>Dátum:</strong> {{ formattedDate}}</p>
      <p><strong>Helyszín:</strong> {{ location }}</p>
      <p><strong>Oktató:</strong> {{ tartja || 'Nincs megadva' }}</p>

      <button *ngIf="!booked" (click)="onBook()">
        Jelentkezem
      </button>

      <button *ngIf="booked" (click)="onCancel()">
        Lemondom
      </button>

      <!-- Értékelés kikapcsolva -->
<!--
<label *ngIf="booked">
  Értékelem:
  <select [(ngModel)]="rating" (change)="onRate()">
    <option *ngFor="let n of [1,2,3,4,5]" [value]="n">{{ n }}</option>
  </select>
</label>
-->
    </article>
  `,
  styles: [
    `.card{border:1px solid #ccc;padding:1rem;border-radius:8px;margin-bottom:.5rem}`
  ]
})
export class SessionCardComponent {

  /* ---------- @Input‑ok ---------- */
  @Input() title!: string;
  @Input() date!: Timestamp;
  @Input() location!: string;
  @Input() tartja!: string;   // oktató

  /* foglalt‑e már a felhasználó? */
  @Input() booked = false;

  /* ---------- @Output‑ok ---------- */
  @Output() book   = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() rate   = new EventEmitter<number>();

  rating = 1;


  get formattedDate(): string {
    return this.date ? this.date.toDate().toLocaleString() : '';
  }

  /* gomb‑kattintások */
  onBook()   { this.book.emit(); }
  onCancel() { this.cancel.emit(); }
  onRate()   { this.rate.emit(this.rating); }
}
