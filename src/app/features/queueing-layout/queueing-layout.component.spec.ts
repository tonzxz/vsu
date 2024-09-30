import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueingLayoutComponent } from './queueing-layout.component';

describe('QueueingLayoutComponent', () => {
  let component: QueueingLayoutComponent;
  let fixture: ComponentFixture<QueueingLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueingLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QueueingLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
