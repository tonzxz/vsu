import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaDashboardComponent } from './da-dashboard.component';

describe('DaDashboardComponent', () => {
  let component: DaDashboardComponent;
  let fixture: ComponentFixture<DaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
