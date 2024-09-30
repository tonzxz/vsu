import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskSelectionComponent } from './kiosk-selection.component';

describe('KioskSelectionComponent', () => {
  let component: KioskSelectionComponent;
  let fixture: ComponentFixture<KioskSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KioskSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KioskSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
