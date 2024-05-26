import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { HttpClient } from '@angular/common/http';
import { timeInterval, interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  readonly URL_API = `https://api.coindesk.com/v2`;
  private seconds = interval(10000);
  constructor(private http: HttpClient, private dbService: DbService) {}

  public getTodayValue(): void {
    this.getExchangeRate();
    this.seconds
      .pipe(timeInterval())
      .subscribe((value) => this.getExchangeRate());
  }

  getExchangeRate(): void {
    this.http
      .get(`${this.URL_API}/tb/price/ticker?assets=BTC`)
      .subscribe((data: any) => {
        const exchangeRate = data.data.BTC.ohlc.c;
        this.dbService.saveExchangeRateToday(exchangeRate);
      });
  }

  getHistoricalValue(start: string, end: string): void {
    this.http
      .get(
        `${this.URL_API}/tb/price/values/BTC?start_date=${start}&end_date=${end}&interval=1d`
      )
      .subscribe((data: any) => {
        const exchangeRateH = data.data.entries;
        this.dbService.saveExchangeRateHistory(exchangeRateH);
      });
  }

  getConvertCurrency(): void {
    this.http
      .get(`https://api.currencyapi.com/v3/latest?currencies=EUR,COP`, {
        headers: {
          apikey: 'cur_live_7rofLFDIDyeh3bY5Dd2U3sp7P1CAxtOpJaot8wME',
        },
      })
      .subscribe((data: any) => {
        // console.log(data);
      });
  }
}
