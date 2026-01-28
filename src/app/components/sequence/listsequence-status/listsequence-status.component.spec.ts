import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsequenceStatusComponent } from './listsequence-status.component';

describe('ListsequenceStatusComponent', () => {
  let component: ListsequenceStatusComponent;
  let fixture: ComponentFixture<ListsequenceStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListsequenceStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListsequenceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
