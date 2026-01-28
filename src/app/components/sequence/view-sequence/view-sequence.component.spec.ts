import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSequenceComponent } from './view-sequence.component';

describe('ViewSequenceComponent', () => {
  let component: ViewSequenceComponent;
  let fixture: ComponentFixture<ViewSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSequenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
