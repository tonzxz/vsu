import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueingLayoutModule } from './queueing-layout.component';

describe('QueueingLayoutComponent', () => {
  let component: QueueingLayoutModule;
  let fixture: ComponentFixture<QueueingLayoutModule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueingLayoutModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QueueingLayoutModule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
