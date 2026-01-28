import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalExamReplacementFormComponent } from './final-exam-replacement-form.component';

describe('FinalExamReplacementFormComponent', () => {
  let component: FinalExamReplacementFormComponent;
  let fixture: ComponentFixture<FinalExamReplacementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalExamReplacementFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalExamReplacementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
