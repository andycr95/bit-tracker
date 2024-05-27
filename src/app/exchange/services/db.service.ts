import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RxDatabase } from 'rxdb';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  get db() {
    return window.dbInstance! as RxDatabase;
  }

  getQuery(query: string): any {
    if (this.db === undefined) {
      return new Observable((observer) => {
        observer.next(null);
      });
    }
    return this.db.collections['exchange']
      .findOne()
      .where('key')
      .eq(query)
      .$.pipe();
  }

  async queryWithoutObservable(query: string): Promise<any> {
    return await this.db.collections['exchange']
      .findOne({
        selector: {
          key: query,
        },
      })
      .exec();
  }
}
