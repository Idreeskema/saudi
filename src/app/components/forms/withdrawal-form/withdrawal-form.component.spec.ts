import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalFormComponent } from './withdrawal-form.component';

describe('WithdrawalFormComponent', () => {
  let component: WithdrawalFormComponent;
  let fixture: ComponentFixture<WithdrawalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawalFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WithdrawalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
