import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { ListTailComponent } from '../../components/list-tail/list-tail.component';
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
  public isTodayValueHigher$!: Observable<boolean>;
  public window$!: Observable<any>;
  public stateDB$!: Observable<any>;
  public todayValue$!: Observable<any>;
  public todayValueLast$!: Observable<any>;

  constructor(
    private sharedService: SharedService,
    private dbService: DbService
  ) {
    window.addEventListener('rateTodayUpdated', (e: any) => {
      if (!e.detail) return;
      this.getInformation();
    });
    window.addEventListener('dbInstanceReady', (e: any) => {
      this.getInformation();
    });
  }

  async getInformation() {
    this.todayValue$ = this.dbService.getQuery('todayNow').pipe();
    this.todayValueLast$ = this.dbService.getQuery('todayLast').pipe();
    this.classContent$ = this.sharedService.getScrollPercentage();
    this.isTodayValueHigher$ = new Observable((observer) => {
      this.todayValue$.subscribe((todayValue) => {
        if (todayValue) {
          this.todayValueLast$.subscribe((todayValueLast) => {
            if (todayValueLast) {
              observer.next(todayValue.value > todayValueLast.value);
            }
          });
        }
      });
    });
  }
}
