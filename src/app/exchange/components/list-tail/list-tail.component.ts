import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from '../../services/db.service';
import { Observable } from 'rxjs';
import { TailInfoComponent } from '../tail-info/tail-info.component';
import { GetArrayPipe } from '../../pipes/getArray.pipe';

@Component({
  selector: 'app-list-tail',
  standalone: true,
  imports: [CommonModule, TailInfoComponent, GetArrayPipe],
  templateUrl: './list-tail.component.html',
  styleUrls: ['./list-tail.component.scss'],
})
export class ListTailComponent {
  public rates$!: Observable<any>;
  public stateDB$!: Observable<boolean>;
  constructor(private dbService: DbService) {
    window.addEventListener('dbInstanceReady', () => {
      this.getRates();
    });
  }

  ngOnInit() {
    this.getRates();
  }

  getRates() {
    this.rates$ = this.dbService.getQuery('history').pipe();
  }
}
