import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { HttpClient } from '@angular/common/http';
import { timeInterval, interval, Observable } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  readonly URL_API = `https://api.coindesk.com/v2`;
  private seconds = interval(10000);
  conection$!: Observable<boolean>;
  constructor(
    private http: HttpClient,
    private dbService: DbService,
    private sharedService: SharedService
  ) {
    this.conection$ = this.sharedService.getConectionStatus();
  }

  public getTodayValue(): void {
    this.getExchangeRate();
    this.seconds
      .pipe(timeInterval())
      .subscribe((value) => this.getExchangeRate());
  }

  getExchangeRate(): void {
    this.conection$.subscribe((status) => {
      if (status == false) return;
      this.http
        .get(`${this.URL_API}/tb/price/ticker?assets=BTC`)
        .subscribe((data: any) => {
          const exchangeRate = data.data.BTC.ohlc.c;
          this.dbService.saveExchangeRateToday(exchangeRate);
        });
    });
  }

  getHistoricalValue(start: string, end: string): void {
    this.conection$.subscribe((status) => {
      if (status == false) return;
      this.http
        .get(
          `${this.URL_API}/tb/price/values/BTC?start_date=${start}&end_date=${end}&interval=1d`
        )
        .subscribe((data: any) => {
          const exchangeRateH = data.data.entries;
          this.dbService.saveExchangeRateHistory(exchangeRateH);
          this.saveChangeCurrencies(exchangeRateH);
        });
    });
  }

  saveChangeCurrencies(exchangeRateH: any): void {
    this.conection$.subscribe((status) => {
      if (status == false) return;
      this.http
        .get(`https://api.currencyapi.com/v3/latest`, {
          headers: {
            apikey: 'cur_live_7rofLFDIDyeh3bY5Dd2U3sp7P1CAxtOpJaot8wME',
          },
        })
        .subscribe((data: any) => {
          this.dbService.saveChangeCurrencies(data.data);
          for (let i = 0; i < exchangeRateH.length; i++) {
            const eRH = exchangeRateH[i];
            this.dbService.saveSingleExchangeRateHistory(eRH);
          }
        });
    });
  }

  getChangeCurrencies(): any {
    let currencies = this.dbService
      .queryWithoutObservable('changeCurrencies')
      .then((data: any) => {
        const obj = Object.entries(data.value).map((value: any) => {
          return { currency: value[1]!.code, value: value[1]!.value };
        });

        const indexEur = obj.findIndex((element) => element.currency === 'EUR');
        const eur = obj[indexEur];
        obj.splice(indexEur, 1);
        obj.unshift(eur);
        const indexCop = obj.findIndex((element) => element.currency === 'COP');
        const cop = obj[indexCop];
        obj.splice(indexCop, 1);
        obj.unshift(cop);

        return obj;
      });
    return currencies;
  }

  getSingleRate(id: string): any {
    let rate = this.dbService
      .queryWithoutObservable('history-' + id)
      .then((data: any) => {
        return data;
      });
    return rate;
  }
}
