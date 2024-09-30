import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ATerminalManagementComponent } from './a-terminal-management.component';

describe('ATerminalManagementComponent', () => {
  let component: ATerminalManagementComponent;
  let fixture: ComponentFixture<ATerminalManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ATerminalManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ATerminalManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
