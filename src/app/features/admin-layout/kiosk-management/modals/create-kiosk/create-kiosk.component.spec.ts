import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateKioskComponent } from './create-kiosk.component';

describe('CreateKioskComponent', () => {
  let component: CreateKioskComponent;
  let fixture: ComponentFixture<CreateKioskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateKioskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateKioskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
