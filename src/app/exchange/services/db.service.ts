import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RxDatabase } from 'rxdb';

const Database = new RxDatabase({
  name: 'exchange',
  databaseVersion: '1',
});

@Injectable({
  providedIn: 'root',
})
export class DbService {
  saveExchangeRateToday(exchangeRate: any): void {
    // this.db.exchange
    //   .findOne({
    //     selector: {
    //       key: 'todayNow',
    //     },
    //   })
    //   .exec()
    //   .then((docs: any) => {
    //     if (docs === null) {
    //       this.db.exchange.insert({
    //         value: exchangeRate.toString(),
    //         key: 'todayNow',
    //       });
    //       this.db.exchange.insert({
    //         value: exchangeRate.toString(),
    //         key: 'todayLast',
    //       });
    //     } else {
    //       if (docs.value !== exchangeRate.toString()) {
    //         this.db.exchange.upsert({
    //           value: docs.value,
    //           key: 'todayLast',
    //         });
    //         this.db.exchange.upsert({
    //           value: exchangeRate.toString(),
    //           key: 'todayNow',
    //         });
    //       }
    //     }
    //   });
  }

  saveExchangeRateHistory(exchangeRateH: any): void {
    // this.db.exchange
    //   .findOne({
    //     selector: {
    //       key: 'history',
    //     },
    //   })
    //   .exec()
    //   .then((docs: any) => {
    //     if (docs === null) {
    //       this.db.exchange.insert({
    //         value: exchangeRateH,
    //         key: 'history',
    //       });
    //     } else {
    //       if (docs.value !== exchangeRateH) {
    //         this.db.exchange.upsert({
    //           value: exchangeRateH,
    //           key: 'history',
    //         });
    //       }
    //     }
    //   });
  }

  saveChangeCurrencies(currencies: any): void {
    // this.db.exchange
    //   .findOne({
    //     selector: {
    //       key: 'changeCurrencies',
    //     },
    //   })
    //   .exec()
    //   .then((docs: any) => {
    //     if (docs === null) {
    //       this.db.exchange.insert({
    //         value: currencies,
    //         key: 'changeCurrencies',
    //       });
    //     } else {
    //       if (docs.value !== currencies) {
    //         this.db.exchange.upsert({
    //           value: currencies,
    //           key: 'changeCurrencies',
    //         });
    //       }
    //     }
    //   });
  }

  saveSingleExchangeRateHistory(exchange: any): void {
    // this.db.exchange
    //   .findOne({
    //     selector: {
    //       key: `history-${exchange[0]}`,
    //     },
    //   })
    //   .exec()
    //   .then((docs: any) => {
    //     if (docs === null) {
    //       this.db.exchange.insert({
    //         value: exchange[1],
    //         key: `history-${exchange[0]}`,
    //       });
    //     }
    //   });
  }

  getQuery(query: string): any {
    console.log(window);
    // return this.db.exchange.findOne().where('key').eq(query).$.pipe();
    //return Obserble with null value
    return new Observable((observer) => {
      observer.next(null);
    });
  }

  queryWithoutObservable(query: string): any {
    // return this.db.exchange.findOne().where('key').eq(query).exec();
    return new Observable((observer) => {
      observer.next(null);
    });
  }
}
