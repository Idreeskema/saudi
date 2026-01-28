import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterWithdrawalFormComponent } from './semester-withdrawal-form.component';

describe('SemesterWithdrawalFormComponent', () => {
  let component: SemesterWithdrawalFormComponent;
  let fixture: ComponentFixture<SemesterWithdrawalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemesterWithdrawalFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SemesterWithdrawalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
