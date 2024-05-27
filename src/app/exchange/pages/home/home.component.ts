import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { ListTailComponent } from '../../components/list-tail/list-tail.component';
import { ExchangeService } from '../../services/exchange.service';
import { DbService } from '../../services/db.service';
import { Observable } from 'rxjs';
import { JsonToStringPipe } from '../../pipes/jsonToString.pipe';
import { SharedService } from '../../services/shared.service';
import { ConectionIndicatorComponent } from '../../components/conection-indicator/conection-indicator.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    NavBarComponent,
    ListTailComponent,
    JsonToStringPipe,
    ConectionIndicatorComponent,
  ],
})
export class HomeComponent {
  public classContent$!: Observable<number>;
  public todayValue$!: Observable<any>;
  public todayValueLast$!: Observable<any>;
  public isTodayValueHigher$: Observable<boolean>;

  constructor(
    private exchangeService: ExchangeService,
    private dbService: DbService,
    private sharedService: SharedService
  ) {
    this.todayValue$ = this.dbService.getQuery('todayNow').pipe();
    this.todayValueLast$ = this.dbService.getQuery('todayLast').pipe();
    this.classContent$ = this.sharedService.getScrollPercentage();
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

  ngOnInit(): void {
    this.exchangeService.getTodayValue();
    this.exchangeService.getHistoricalValue(
      '2024-05-10T01:25',
      '2024-05-25T01:25'
    );
  }
}
