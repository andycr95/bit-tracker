import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-conection-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conection-indicator.component.html',
  styleUrls: ['./conection-indicator.component.scss'],
})
export class ConectionIndicatorComponent {
  public onlineStatus$!: Observable<boolean>;
  constructor() {
    this.onlineStatus$ = new Observable((observer) => {
      window.addEventListener('online', () => {
        observer.next(false);
      });
      window.addEventListener('offline', () => {
        observer.next(true);
      });
    });
  }
}
