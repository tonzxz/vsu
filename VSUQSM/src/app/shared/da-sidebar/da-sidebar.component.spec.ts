import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaSidebarComponent } from './da-sidebar.component';

describe('DaSidebarComponent', () => {
  let component: DaSidebarComponent;
  let fixture: ComponentFixture<DaSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DaSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
