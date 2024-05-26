import { Component, Input, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DbService } from '../../services/db.service';
import { CommonModule } from '@angular/common';
import { JsonToStringPipe } from '../../pipes/jsonToString.pipe';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  imports: [CommonModule, JsonToStringPipe],
  standalone: true,
})
export class NavBarComponent implements OnInit {
  public todayValue$!: Observable<any>;
  public todayValueLast$!: Observable<any>;
  public classContent$: Observable<number>;
  public isTodayValueHigher$: Observable<boolean>;
  @Input() content: any;

  constructor(private dbService: DbService) {
    this.todayValue$ = this.dbService.getQuery('todayNow').pipe();
    this.todayValueLast$ = this.dbService.getQuery('todayLast').pipe();

    this.classContent$ = new Observable((observer) => {
      window.addEventListener('scroll', () => {
        let scroll = (window.scrollY / window.document.body.scrollHeight) * 100;
        observer.next(scroll);
      });
    });

    this.isTodayValueHigher$ = new Observable((observer) => {
      this.todayValue$.subscribe((todayValue) => {
        this.todayValueLast$.subscribe((todayValueLast) => {
          if (todayValue && todayValueLast) {
            observer.next(todayValue.value > todayValueLast.value);
          }
        });
      });
    });
  }

  ngOnInit(): void {}
}
