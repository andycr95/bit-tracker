import { Component, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { JsonToStringPipe } from './app/exchange/pipes/jsonToString.pipe';
import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { RouterOutlet, provideRouter } from '@angular/router';
registerLocaleData(localeES, 'es');
import { routes } from './routes';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  standalone: true,
  imports: [RouterOutlet],
})
export class App {}

bootstrapApplication(App, {
  providers: [
    importProvidersFrom([BrowserModule, HttpClientModule, JsonToStringPipe]),
    {
      provide: LOCALE_ID,
      useValue: 'es',
    },
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
