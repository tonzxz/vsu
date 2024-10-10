import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskManagementComponent } from './kiosk-management.component';

describe('KioskManagementComponent', () => {
  let component: KioskManagementComponent;
  let fixture: ComponentFixture<KioskManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KioskManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KioskManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
