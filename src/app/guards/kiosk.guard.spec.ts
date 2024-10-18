import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { kioskGuard } from './kiosk.guard';

describe('kioskGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => kioskGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
