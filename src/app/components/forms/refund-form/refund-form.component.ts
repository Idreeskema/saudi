import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../../services/auth.service";
import { FormStorageService } from "../../../services/form-storage.service";
import { PdfService } from "../../../services/pdf.service";
import { ApiService } from "../../../services/api.service";
import { RefundForm, User } from "../../../models/form.model";
import { SidebarComponent } from "../../sidebar/sidebar.component";

@Component({
  selector: "app-refund-form",
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: "./refund-form.component.html",
  styleUrls: ["./refund-form.component.scss"],
})
export class RefundFormComponent implements OnInit {
  currentUser: User | null = null;
  form: RefundForm | null = null;
  formId: string = "";
  apiId: number | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private formStorageService: FormStorageService,
    private pdfService: PdfService,
    private apiService: ApiService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }

    this.route.paramMap.subscribe((paramMap) => {
      this.formId = paramMap.get("id") || "1002-5096";
      this.loadForm();
      this.loadApiId();
      this.fetchFormData();
    });
  }

  loadForm(): void {
    const existingForm = this.formStorageService.getFormById(this.formId);
    if (existingForm) {
      this.form = JSON.parse(JSON.stringify(existingForm));
      this.form!.createdAt = new Date(existingForm.createdAt);
      this.form!.updatedAt = new Date(existingForm.updatedAt);
    } else {
      this.form = this.formStorageService.createEmptyForm();
    }
    this.isLoading = false;
  }

  loadApiId(): void {
    // Attempt to get API ID from URL (formId) first
    if (this.formId && !isNaN(parseInt(this.formId, 10))) {
      this.apiId = parseInt(this.formId, 10);
      return;
    }

    const storedApiId = localStorage.getItem(`apiId_${this.formId}`);
    if (storedApiId) {
      this.apiId = parseInt(storedApiId, 10);
    }
  }

  fetchFormData(): void {
    if (this.apiId) {
      this.apiService.get(`RefundForms/${this.apiId}`).subscribe({
        next: (response: any) => {
          const data = response.data || response;
          if (data && this.form) {
             // Map student section
             if (data.studentSection || data.studentName) {
               this.form.studentSection = {
                 ...this.form.studentSection,
                 name: data.studentName || this.form.studentSection.name,
                 studentId: data.studentId || this.form.studentSection.studentId,
                 mobileNumber: data.mobileNumber || this.form.studentSection.mobileNumber,
                 nationality: data.nationality || this.form.studentSection.nationality,
                 major: data.major || this.form.studentSection.major,
                 level: data.level || this.form.studentSection.level,
                 refundAmount: data.refundAmount || this.form.studentSection.refundAmount,
                 refundReason: data.refundReason || this.form.studentSection.refundReason,
                 bankName: data.bankName || this.form.studentSection.bankName,
                 accountHolderName: data.accountHolderName || this.form.studentSection.accountHolderName,
                 relationship: data.relationship || this.form.studentSection.relationship,
                 ibanArabic: data.iban_Arabic || this.form.studentSection.ibanArabic,
                 ibanEnglish: data.iban_English || this.form.studentSection.ibanEnglish,
                 holderIdIqama: data.holderIdIqama || this.form.studentSection.holderIdIqama,
                 studentSignature: data.studentSignature || this.form.studentSection.studentSignature,
                 studentDate: data.studentDate || this.form.studentSection.studentDate,
                 completed: true
               };
             }
             
             // Map registration section
             if (data.registration) {
               this.form.registrationSection = {
                 ...this.form.registrationSection,
                 withdrawalType: data.registration.withdrawalType === "Voluntary" ? "complete" : "partial",
                 semesterTiming: data.registration.semesterTiming,
                 otherReason: data.registration.OtherReason,
                 departmentHead: data.registration.departmentHead,
                 signature: data.registration.registrationSignature,
                 date: data.registration.registrationDate,
                 completed: true
               };
             }
             
             // Map accounting section
             if (data.accounting) {
               this.form.accountingVerificationSection = {
                 ...this.form.accountingVerificationSection,
                 paymentAmountNumeric: data.accounting.paymentAmount_Numeric,
                 paymentAmountWords: data.accounting.paymentAmount_Words,
                 accountantName: data.accounting.accountantName,
                 accountantSignature: data.accounting.accountantSignature,
                 accountantDate: data.accounting.accountantDate,
                 chiefAccountant: data.accounting.chiefAccountant,
                 chiefSignature: data.accounting.chiefSignature,
                 chiefDate: data.accounting.chiefDate,
                 completed: true
               };
             }
             
             // Map authorized section
             if (data.authorized) {
               this.form.authorizedSection = {
                 ...this.form.authorizedSection,
                 decision: data.authorized.decision,
                 approvedAmountNumeric: data.authorized.approvedAmount_Numeric,
                 approvedAmountWords: data.authorized.approvedAmount_Words,
                 signature: data.authorized.authorizedSignature,
                 date: data.authorized.authorizedDate,
                 completed: true
               };
             }
             
             // Map final disbursement
             if (data.finalDisbursement) {
               this.form.accountingDisbursementSection = {
                 ...this.form.accountingDisbursementSection,
                 chequeNumber: data.finalDisbursement.chequeNumber,
                 issueDate: data.finalDisbursement.issueDate,
                 finalAmount: data.finalDisbursement.finalAmount,
                 accountantSignature: data.finalDisbursement.finalAccountantSignature,
                 date: data.finalDisbursement.finalAccountantDate,
                 completed: true
               };
             }
          }
        },
        error: (error) => {
          console.error("Error fetching form data:", error);
        }
      });
    }
  }

  saveApiId(apiId: number): void {
    this.apiId = apiId;
    localStorage.setItem(`apiId_${this.formId}`, apiId.toString());
  }

  canEditSection(section: string): boolean {
    if (!this.currentUser) return false;
    const role = this.currentUser.role;

    switch (section) {
      case "student":
        return role === "student" || role === "admin";
      case "registration":
        return role === "registration" || role === "admin";
      case "accountingVerification":
        return role === "accounting" || role === "admin";
      case "authorized":
        return role === "authorized" || role === "admin";
      case "accountingDisbursement":
        return role === "accounting" || role === "admin";
      default:
        return false;
    }
  }

  canViewSection(section: string): boolean {
    if (!this.currentUser) return false;
    
    // Students should ONLY see the student section
    if (this.currentUser.role === "student") {
      return section === "student";
    }
    
    // All other roles (Registration, Accounting, Authorized, Admin, etc.) can see everything
    return true;
  }

  saveSection(section: string): void {
    if (!this.form) return;

    switch (section) {
      case "student":
        this.submitStudentSection();
        break;
      case "registration":
        this.submitRegistrationSection();
        break;
      case "accountingVerification":
        this.submitAccountingVerificationSection();
        break;
      case "authorized":
        this.submitAuthorizedSection();
        break;
      case "accountingDisbursement":
        this.submitAccountingDisbursementSection();
        break;
    }
  }

  private submitStudentSection(): void {
    if (!this.form) return;

    const studentId = this.form.studentSection.studentId || "3";

    const payload = {
      formId: this.formId,
      studentId: studentId,
      studentName: this.form.studentSection.name,
      mobileNumber:
        this.form.studentSection.mobileNumber?.toString() || "9876543210",
      nationality: this.form.studentSection.nationality,
      major: this.form.studentSection.major,
      level: this.form.studentSection.level,
      refundAmount: this.form.studentSection.refundAmount || 5000,
      refundReason: this.form.studentSection.refundReason,
      bankName: this.form.studentSection.bankName,
      accountHolderName: this.form.studentSection.accountHolderName,
      relationship: this.form.studentSection.relationship,
      iban_Arabic: this.form.studentSection.ibanArabic,
      iban_English: this.form.studentSection.ibanEnglish,
      holderIdIqama: this.form.studentSection.holderIdIqama,
      studentSignature: this.form.studentSection.studentSignature,
      studentDate: this.form.studentSection.studentDate,
    };

    this.apiService.post<{ id: number }>("RefundForms", payload).subscribe({
      next: (response: any) => {
        this.saveApiId(response.data.id);
        // Save studentId to localStorage
        localStorage.setItem("currentStudentId", studentId.toString());
        this.form!.studentSection.completed = true;
        this.toastr.success(response.message || "Student section submitted successfully!");
        setTimeout(() => {
          this.router.navigate(["/request-list"]);
        }, 2000); // Navigate after 2 seconds to allow user to see the success message
      },
      error: (error) => {
        console.error("Error submitting student section:", error);
        this.toastr.error(
          "Failed to submit student section. Please try again.",
        );
      },
    });
  }

  private submitRegistrationSection(): void {
    if (!this.apiId) {
      this.toastr.warning("Please submit student section first.");
      return;
    }

    if (!this.form) return;

    const payload = {
      id: this.apiId,
      registration: {
        withdrawalType:
          this.form.registrationSection.withdrawalType === "complete"
            ? "Voluntary"
            : "Partial",
        semesterTiming: this.form.registrationSection.semesterTiming,
        OtherReason: this.form.registrationSection.otherReason,
        departmentHead: this.form.registrationSection.departmentHead,
        registrationSignature: this.form.registrationSection.signature,
        registrationDate: this.form.registrationSection.date,
      },
    };

    this.apiService.patch("RefundForms", payload).subscribe({
      next: (response: any) => {
        this.form!.registrationSection.completed = true;
        this.toastr.success(response.message || "Registration section submitted successfully!");
      },
      error: (error) => {
        console.error("Error submitting registration section:", error);
        this.toastr.error(
          "Failed to submit registration section. Please try again.",
        );
      },
    });
  }

  private submitAccountingVerificationSection(): void {
    if (!this.apiId) {
      this.toastr.warning("Please submit student section first.");
      return;
    }

    if (!this.form) return;

    const payload = {
      id: this.apiId,
      accounting: {
        paymentAmount_Numeric:
          this.form.accountingVerificationSection.paymentAmountNumeric ||
          1500.0,
        paymentAmount_Words:
          this.form.accountingVerificationSection.paymentAmountWords,
        accountantName: this.form.accountingVerificationSection.accountantName,
        accountantSignature:
          this.form.accountingVerificationSection.accountantSignature,
        accountantDate: this.form.accountingVerificationSection.accountantDate,
        chiefAccountant:
          this.form.accountingVerificationSection.chiefAccountant,
        chiefSignature: this.form.accountingVerificationSection.chiefSignature,
        chiefDate: this.form.accountingVerificationSection.chiefDate,
      },
    };

    this.apiService.patch("RefundForms", payload).subscribe({
      next: (response: any) => {
        this.form!.accountingVerificationSection.completed = true;
        this.toastr.success(response.message || "Accounting verification section submitted successfully!");
      },
      error: (error) => {
        console.error(
          "Error submitting accounting verification section:",
          error,
        );
        this.toastr.error(
          "Failed to submit accounting verification section. Please try again.",
        );
      },
    });
  }

  private submitAuthorizedSection(): void {
    if (!this.apiId) {
      this.toastr.warning("Please submit student section first.");
      return;
    }

    if (!this.form) return;

    const payload = {
      id: this.apiId,
      authorized: {
        decision: this.form.authorizedSection.decision || false,
        approvedAmount_Numeric:
          this.form.authorizedSection.approvedAmountNumeric || 1500.0,
        approvedAmount_Words: this.form.authorizedSection.approvedAmountWords,
        authorizedSignature: this.form.authorizedSection.signature,
        authorizedDate: this.form.authorizedSection.date,
      },
    };

    this.apiService.patch("RefundForms", payload).subscribe({
      next: (response: any) => {
        this.form!.authorizedSection.completed = true;
        this.toastr.success(response.message || "Authorized section submitted successfully!");
      },
      error: (error) => {
        console.error("Error submitting authorized section:", error);
        this.toastr.error(
          "Failed to submit authorized section. Please try again.",
        );
      },
    });
  }

  private submitAccountingDisbursementSection(): void {
    if (!this.apiId) {
      this.toastr.warning("Please submit student section first.");
      return;
    }

    if (!this.form) return;

    const payload = {
      id: this.apiId,
      finalDisbursement: {
        chequeNumber: this.form.accountingDisbursementSection.chequeNumber,
        issueDate: this.form.accountingDisbursementSection.issueDate,
        finalAmount:
          this.form.accountingDisbursementSection.finalAmount || 1500.0,
        finalAccountantSignature:
          this.form.accountingDisbursementSection.accountantSignature,
        finalAccountantDate: this.form.accountingDisbursementSection.date,
      },
    };

    this.apiService.patch("RefundForms", payload).subscribe({
      next: (response: any) => {
        this.form!.accountingDisbursementSection.completed = true;
        this.toastr.success(response.message || "Accounting disbursement section submitted successfully!");
      },
      error: (error) => {
        console.error(
          "Error submitting accounting disbursement section:",
          error,
        );
        this.toastr.error(
          error.error.message ||
            "Failed to submit accounting disbursement section. Please try again.",
        );
      },
    });
  }

  goBack(): void {
    this.router.navigate(["/request-list"]);
  }

  generatePDF(): void {
    if (this.form) {
      this.pdfService.generatePDFFromData(this.form);
    }
  }

  printForm(): void {
    const url = `/print-form/${this.formId}`;
    window.open(url, "_blank");
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
