export class ApiService {
  readonly URL_API = `https://api.coindesk.com/v2`;
  constructor() {}

  async getExchangeRate(): Promise<any> {
    return await fetch(`${this.URL_API}/tb/price/ticker?assets=BTC`).then(
      (data: any) => {
        const exchangeRate = data.data.BTC.ohlc.c;
        return exchangeRate;
      }
    );
  }

  async getHistoricalValue(start: string, end: string): Promise<any> {
    return await fetch(
      `${this.URL_API}/tb/price/values/BTC?start_date=${start}&end_date=${end}&interval=1d`
    ).then((data: any) => {
      const exchangeRateH = data.data.entries;
      return exchangeRateH;
    });
  }

  async saveChangeCurrencies(): Promise<any> {
    return await fetch(`https://api.currencyapi.com/v3/latest`, {
      headers: {
        apikey: 'cur_live_7rofLFDIDyeh3bY5Dd2U3sp7P1CAxtOpJaot8wME',
      },
    }).then((data: any) => {
      return data.data;
    });
  }
}
