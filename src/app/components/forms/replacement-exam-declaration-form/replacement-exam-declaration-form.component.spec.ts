import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementExamDeclarationFormComponent } from './replacement-exam-declaration-form.component';

describe('ReplacementExamDeclarationFormComponent', () => {
  let component: ReplacementExamDeclarationFormComponent;
  let fixture: ComponentFixture<ReplacementExamDeclarationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplacementExamDeclarationFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplacementExamDeclarationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
