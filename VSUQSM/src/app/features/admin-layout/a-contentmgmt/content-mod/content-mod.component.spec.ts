import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentModComponent } from './content-mod.component';

describe('ContentModComponent', () => {
  let component: ContentModComponent;
  let fixture: ComponentFixture<ContentModComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentModComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContentModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
