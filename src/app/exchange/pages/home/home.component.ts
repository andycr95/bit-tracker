import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { ListTailComponent } from '../../components/list-tail/list-tail.component';
import { ExchangeService } from '../../services/exchange.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, NavBarComponent, ListTailComponent],
})
export class HomeComponent {
  constructor(private exchangeService: ExchangeService) {}

  ngOnInit(): void {
    this.exchangeService.getTodayValue();
    this.exchangeService.getHistoricalValue(
      '2024-05-10T01:25',
      '2024-05-25T01:25'
    );
  }
}
