import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseAddDropFormComponent } from './course-add-drop-form.component';

describe('CourseAddDropFormComponent', () => {
  let component: CourseAddDropFormComponent;
  let fixture: ComponentFixture<CourseAddDropFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseAddDropFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourseAddDropFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
