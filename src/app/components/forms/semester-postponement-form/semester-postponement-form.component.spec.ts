import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterPostponementFormComponent } from './semester-postponement-form.component';

describe('SemesterPostponementFormComponent', () => {
  let component: SemesterPostponementFormComponent;
  let fixture: ComponentFixture<SemesterPostponementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemesterPostponementFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SemesterPostponementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
