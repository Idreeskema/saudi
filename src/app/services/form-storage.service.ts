import { Injectable } from '@angular/core';
import { RefundForm, FormStatus } from '../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class FormStorageService {
  private readonly STORAGE_KEY = 'refundForms';
  private readonly FIXED_FORM_ID = '1002-5096';

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  createEmptyForm(): RefundForm {
    const now = new Date();
    
    const newForm: RefundForm = {
      id: this.FIXED_FORM_ID,
      status: {
        overall: 'draft',
        studentCompleted: false,
        registrationCompleted: false,
        accountingVerificationCompleted: false,
        authorizedCompleted: false,
        accountingDisbursementCompleted: false
      },
      createdAt: now,
      updatedAt: now,
      
      studentSection: {
        mobileNumber: null,
        studentId: '',
        name: '',
        nationality: '',
        major: '',
        level: '',
        refundAmount: null,
        refundReason: '',
        bankName: '',
        accountHolderName: '',
        relationship: '',
        ibanArabic: '',
        ibanEnglish: '',
        holderIdIqama: '',
        studentSignature: '',
        studentDate: '',
        completed: false
      },
      
      registrationSection: {
        withdrawalType: '',
        semesterTiming: '',
        otherReason: '',
        departmentHead: '',
        signature: '',
        date: '',
        completed: false
      },
      
      accountingVerificationSection: {
        paymentAmountNumeric: null,
        paymentAmountWords: '',
        accountantName: '',
        accountantSignature: '',
        accountantDate: '',
        chiefAccountant: '',
        chiefSignature: '',
        chiefDate: '',
        completed: false
      },
      
      authorizedSection: {
        decision: null,
        approvedAmountNumeric: null,
        approvedAmountWords: '',
        signature: '',
        date: '',
        completed: false
      },
      
      accountingDisbursementSection: {
        chequeNumber: '',
        issueDate: '',
        finalAmount: null,
        accountantSignature: '',
        date: '',
        completed: false
      }
    };
    
    return newForm;
  }

  getOrCreateDefaultForm(): RefundForm {
    const existingForm = this.getFormById(this.FIXED_FORM_ID);
    if (existingForm) {
      return existingForm;
    } else {
      const newForm = this.createEmptyForm();
      this.saveForm(newForm);
      return newForm;
    }
  }

  getAllForms(): RefundForm[] {
    const forms = localStorage.getItem(this.STORAGE_KEY);
    if (!forms) return [];
    
    const parsedForms: RefundForm[] = JSON.parse(forms);
    
    return parsedForms.map(form => ({
      ...form,
      createdAt: new Date(form.createdAt),
      updatedAt: new Date(form.updatedAt)
    }));
  }

  getFormById(id: string): RefundForm | null {
    const forms = this.getAllForms();
    const form = forms.find(f => f.id === id);
    return form || null;
  }

  saveForm(form: RefundForm): void {
    const forms = this.getAllForms();
    const index = forms.findIndex(f => f.id === form.id);
    
    form.updatedAt = new Date();
    this.updateFormStatus(form);
    
    if (index !== -1) {
      forms[index] = form;
    } else {
      forms.push(form);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(forms));
  }

  deleteForm(id: string): void {
    const forms = this.getAllForms();
    const filtered = forms.filter(f => f.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  private updateFormStatus(form: RefundForm): void {
    form.status.studentCompleted = form.studentSection.completed;
    form.status.registrationCompleted = form.registrationSection.completed;
    form.status.accountingVerificationCompleted = form.accountingVerificationSection.completed;
    form.status.authorizedCompleted = form.authorizedSection.completed;
    form.status.accountingDisbursementCompleted = form.accountingDisbursementSection.completed;
    
    const allCompleted = 
      form.status.studentCompleted &&
      form.status.registrationCompleted &&
      form.status.accountingVerificationCompleted &&
      form.status.authorizedCompleted &&
      form.status.accountingDisbursementCompleted;
    
    const anyCompleted = 
      form.status.studentCompleted ||
      form.status.registrationCompleted ||
      form.status.accountingVerificationCompleted ||
      form.status.authorizedCompleted ||
      form.status.accountingDisbursementCompleted;
    
    if (allCompleted) {
      form.status.overall = 'completed';
    } else if (anyCompleted) {
      form.status.overall = 'in-progress';
    } else {
      form.status.overall = 'draft';
    }
  }

  getFormStats() {
    const forms = this.getAllForms();
    return {
      total: forms.length,
      inProgress: forms.filter(f => f.status.overall === 'in-progress').length,
      rejected: 0,
      approved: forms.filter(f => f.status.overall === 'completed').length
    };
  }
}