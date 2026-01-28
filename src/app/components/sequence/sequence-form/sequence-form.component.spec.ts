import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceFormComponent } from './sequence-form.component';

describe('SequenceFormComponent', () => {
  let component: SequenceFormComponent;
  let fixture: ComponentFixture<SequenceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SequenceFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SequenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
