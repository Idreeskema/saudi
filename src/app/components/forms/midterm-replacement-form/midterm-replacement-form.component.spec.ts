import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidtermReplacementFormComponent } from './midterm-replacement-form.component';

describe('MidtermReplacementFormComponent', () => {
  let component: MidtermReplacementFormComponent;
  let fixture: ComponentFixture<MidtermReplacementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MidtermReplacementFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MidtermReplacementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
