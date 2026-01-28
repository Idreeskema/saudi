import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSequenceComponent } from './list-sequence.component';

describe('ListSequenceComponent', () => {
  let component: ListSequenceComponent;
  let fixture: ComponentFixture<ListSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSequenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
