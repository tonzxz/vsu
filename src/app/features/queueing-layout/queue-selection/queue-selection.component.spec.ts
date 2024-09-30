import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueSelectionComponent } from './queue-selection.component';

describe('QueueSelectionComponent', () => {
  let component: QueueSelectionComponent;
  let fixture: ComponentFixture<QueueSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QueueSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
