import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AKioskManagementComponent } from './a-kiosk-management.component';

describe('AKioskManagementComponent', () => {
  let component: AKioskManagementComponent;
  let fixture: ComponentFixture<AKioskManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AKioskManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AKioskManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
