import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaTerminalmgmtComponent } from './da-terminalmgmt.component';

describe('DaTerminalmgmtComponent', () => {
  let component: DaTerminalmgmtComponent;
  let fixture: ComponentFixture<DaTerminalmgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaTerminalmgmtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DaTerminalmgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
