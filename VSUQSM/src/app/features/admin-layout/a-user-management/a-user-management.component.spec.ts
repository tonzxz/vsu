import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AUserManagementComponent } from './a-user-management.component';

describe('AUserManagementComponent', () => {
  let component: AUserManagementComponent;
  let fixture: ComponentFixture<AUserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AUserManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
