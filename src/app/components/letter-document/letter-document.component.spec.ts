import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterDocumentComponent } from './letter-document.component';

describe('LetterDocumentComponent', () => {
  let component: LetterDocumentComponent;
  let fixture: ComponentFixture<LetterDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetterDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LetterDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
