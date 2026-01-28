import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MajorTransferFormComponent } from './major-transfer-form.component';

describe('MajorTransferFormComponent', () => {
  let component: MajorTransferFormComponent;
  let fixture: ComponentFixture<MajorTransferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MajorTransferFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MajorTransferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
