import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Counter {
  id: number;
  name: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CounterStateService {
  private countersSubject = new BehaviorSubject<{ [key: string]: Counter[] }>({
    'Registrar': [],
    'Cash Division': [],
    'Accounting Office': []
  });

  counters$ = this.countersSubject.asObservable();

  updateCounters(newCounters: { [key: string]: Counter[] }) {
    this.countersSubject.next(newCounters);
  }

  getCounters() {
    return this.countersSubject.value;
  }
}