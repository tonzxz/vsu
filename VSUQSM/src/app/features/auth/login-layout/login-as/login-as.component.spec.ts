import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAsComponent } from './login-as.component';

describe('LoginAsComponent', () => {
  let component: LoginAsComponent;
  let fixture: ComponentFixture<LoginAsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginAsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginAsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
