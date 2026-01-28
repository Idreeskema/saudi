import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSequenceComponent } from './create-sequence.component';

describe('CreateSequenceComponent', () => {
  let component: CreateSequenceComponent;
  let fixture: ComponentFixture<CreateSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSequenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
