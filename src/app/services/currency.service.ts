import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'https://api.currencyfreaks.com/latest'; // CurrencyFreaks API URL
  private apiKey = '6739f86ad02b4df2a256783b219adb99'; // Your API key

  constructor(private http: HttpClient) {}

  // Fetch currency data every 2 seconds
  getCurrencyData(): Observable<any> {
    return interval(2000).pipe(
      switchMap(() => this.http.get<any>(`${this.apiUrl}?apikey=${this.apiKey}`))
    );
  }
}