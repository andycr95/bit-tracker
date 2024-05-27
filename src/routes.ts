import { Route } from '@angular/router';

import { HomeComponent } from './app/exchange/pages/home/home.component';
import { DatailComponent } from './app/exchange/pages/datail/datail.component';

export const routes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: ':id',
    component: DatailComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];
