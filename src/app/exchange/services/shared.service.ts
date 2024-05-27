import { Injectable } from '@angular/core';
import { interval, Observable, timeInterval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private seconds = interval(1000);
  constructor() {}

  getScrollPercentage(): Observable<number> {
    return new Observable((observer) => {
      window.addEventListener('scroll', () => {
        let scroll = window.scrollY;
        observer.next(scroll);
      });
    });
  }

  getConectionStatus(): Observable<boolean> {
    return new Observable((observer) => {
      window.addEventListener('online', () => {
        observer.next(true);
      });
      window.addEventListener('offline', () => {
        observer.next(false);
      });
    });
  }
}
