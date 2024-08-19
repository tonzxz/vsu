import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskFormsComponent } from './kiosk-forms.component';

describe('KioskFormsComponent', () => {
  let component: KioskFormsComponent;
  let fixture: ComponentFixture<KioskFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KioskFormsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KioskFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
