import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskLayoutComponent } from './kiosk-layout.component';

describe('KioskLayoutComponent', () => {
  let component: KioskLayoutComponent;
  let fixture: ComponentFixture<KioskLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KioskLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KioskLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
