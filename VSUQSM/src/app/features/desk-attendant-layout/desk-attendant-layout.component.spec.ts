import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeskAttendantLayoutComponent } from './desk-attendant-layout.component';

describe('DeskAttendantLayoutComponent', () => {
  let component: DeskAttendantLayoutComponent;
  let fixture: ComponentFixture<DeskAttendantLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeskAttendantLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeskAttendantLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
