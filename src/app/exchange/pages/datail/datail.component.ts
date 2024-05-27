import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExchangeService } from '../../services/exchange.service';
import { Observable } from 'rxjs';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-datail',
  standalone: true,
  imports: [CommonModule, NavBarComponent, RouterLink],
  templateUrl: './datail.component.html',
  styleUrls: ['./datail.component.scss'],
})
export class DatailComponent {
  public rate = { date: new Date(), value: 0 };
  public classContent$!: Observable<number>;
  public changeCurrencies: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private exchangeService: ExchangeService,
    private sharedService: SharedService
  ) {
    this.classContent$ = this.sharedService.getScrollPercentage();
    this.route.params.subscribe((params) => {
      this.exchangeService.getSingleRate(params['id']).then((data: any) => {
        let date = new Date(Number(String(data.key).split('-')[1]));
        this.rate = {
          date: date,
          value: data.value,
        };
      });
    });
    this.exchangeService.getChangeCurrencies().then((data: any) => {
      this.changeCurrencies = data;
    });
  }
}
