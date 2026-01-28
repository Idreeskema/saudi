import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormStorageService } from '../../services/form-storage.service';
import { RefundForm } from '../../models/form.model';

@Component({
  selector: 'app-print-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print-form.component.html',
  styleUrls: ['./print-form.component.scss']
})
export class PrintFormComponent implements OnInit {
  form: RefundForm | null = null;
  formId: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private formStorageService: FormStorageService
  ) {}

  ngOnInit(): void {
    // Get form ID from route
    this.formId = "1002-5096"; // Fixed ID as per service
    
    // Load form from localStorage
    this.loadForm();
  }

  loadForm(): void {
    const existingForm = this.formStorageService.getFormById(this.formId);
    
    if (existingForm) {
      this.form = existingForm;
    } else {
      console.error('Form not found with ID:', this.formId);
    }
    
    this.isLoading = false;
  }

  downloadPDF(): void {
    // Trigger browser print dialog
    window.print();
  }
}