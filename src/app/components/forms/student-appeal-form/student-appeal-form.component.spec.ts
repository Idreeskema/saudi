import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAppealFormComponent } from './student-appeal-form.component';

describe('StudentAppealFormComponent', () => {
  let component: StudentAppealFormComponent;
  let fixture: ComponentFixture<StudentAppealFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentAppealFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentAppealFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
