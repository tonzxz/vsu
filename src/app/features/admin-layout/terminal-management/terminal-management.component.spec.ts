import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalManagementComponent } from './terminal-management.component';

describe('ATerminalManagementComponent', () => {
  let component: TerminalManagementComponent;
  let fixture: ComponentFixture<TerminalManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TerminalManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
