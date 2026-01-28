import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReEntryFormComponent } from './re-entry-form.component';

describe('ReEntryFormComponent', () => {
  let component: ReEntryFormComponent;
  let fixture: ComponentFixture<ReEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReEntryFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
