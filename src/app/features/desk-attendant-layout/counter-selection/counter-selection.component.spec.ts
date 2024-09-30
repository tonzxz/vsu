import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterSelectionComponent } from './counter-selection.component';

describe('CounterSelectionComponent', () => {
  let component: CounterSelectionComponent;
  let fixture: ComponentFixture<CounterSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CounterSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
