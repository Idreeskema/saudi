import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalExamFormComponent } from './medical-exam-form.component';

describe('MedicalExamFormComponent', () => {
  let component: MedicalExamFormComponent;
  let fixture: ComponentFixture<MedicalExamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalExamFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicalExamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
