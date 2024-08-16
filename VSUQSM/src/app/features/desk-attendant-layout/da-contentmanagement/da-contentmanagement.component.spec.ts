import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaContentmanagementComponent } from './da-contentmanagement.component';

describe('DaContentmanagementComponent', () => {
  let component: DaContentmanagementComponent;
  let fixture: ComponentFixture<DaContentmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaContentmanagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DaContentmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
