import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AContentmgmtComponent } from './a-contentmgmt.component';

describe('AContentmgmtComponent', () => {
  let component: AContentmgmtComponent;
  let fixture: ComponentFixture<AContentmgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AContentmgmtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AContentmgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
