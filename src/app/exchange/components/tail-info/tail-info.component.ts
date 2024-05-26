import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { JsonToStringPipe } from '../../pipes/jsonToString.pipe';
import { Observable } from 'rxjs';
import { DbService } from '../../services/db.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tail-info',
  templateUrl: './tail-info.component.html',
  styleUrls: ['./tail-info.component.scss'],
  imports: [CommonModule, JsonToStringPipe, RouterLink],
  standalone: true,
})
export class TailInfoComponent implements OnInit {
  @Input() tail: any;
  public tailDifference$!: Observable<string>;
  public todayValue$!: Observable<any>;
  public isTodayValueHigher$: Observable<boolean>;

  constructor(private dbService: DbService) {
    this.todayValue$ = this.dbService.getQuery('todayNow').pipe();
    this.isTodayValueHigher$ = new Observable((observer) => {
      this.todayValue$.subscribe((todayValue) => {
        if (todayValue) {
          observer.next(todayValue.value > this.tail.value);
        }
      });
    });
    this.tailDifference$ = new Observable((observer) => {
      this.todayValue$.subscribe((todayValue) => {
        if (todayValue) {
          observer.next(
            Number(
              ((todayValue.value > this.tail.value
                ? todayValue.value - this.tail.value
                : this.tail.value - todayValue.value) /
                todayValue.value) *
                100
            ).toFixed(2)
          );
        }
      });
    });
  }

  ngOnInit(): void {}
}
