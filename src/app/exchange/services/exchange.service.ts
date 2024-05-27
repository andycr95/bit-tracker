import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  readonly URL_API = `https://api.coindesk.com/v2`;
  conection$!: Observable<boolean>;
  constructor(
    private dbService: DbService,
    private sharedService: SharedService
  ) {
    this.conection$ = this.sharedService.getConectionStatus();
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
