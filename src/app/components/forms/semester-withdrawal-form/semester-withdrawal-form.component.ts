import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { ApiService } from "../../../services/api.service";
import { User } from "../../../models/form.model";
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-semester-withdrawal-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./semester-withdrawal-form.component.html",
  styleUrls: ["./semester-withdrawal-form.component.scss"],
})
export class SemesterWithdrawalFormComponent implements OnInit {
  currentUser: User | null = null;
  formId: number = 22; // Default, can be from route

  formData = {
    // Personal Information
    studentName: "",
    studentId: "",
    level: "",
    major: "",
    gpa: 0,
    creditHours: 0,

    // Withdrawal Details
    semesterRequested: "",
    mobileNumber: "",

    // Dates
    dateOfApplication: "",
    studentSignature: "",
    guardianSignature: "",

    // Accounting Department
    accountingName: "",
    accountingSignature: "",
    accountingDate: "",
    tuitionFeeApplicable: false,

    // Registration Department
    registrationName: "",
    registrationSignature: "",
    registrationDate: "",
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.route.params.subscribe(params => {
      this.formId = +params['id'] || 22; 
      if (this.formId > 0) {
        this.loadFormData();
      }
    });
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }
  }

  loadFormData(): void {
    this.apiService.get(`semester-withdrawals/${this.formId}`).subscribe({
      next: (response: any) => {
        const data = response.data || response;
        if (data) {
          this.formData = {
            ...this.formData,
            ...data,
            dateOfApplication: data.dateOfApplication ? data.dateOfApplication.split('T')[0] : "",
            accountingName: data.accounting?.accountingName || data.accountingName || "",
            accountingSignature: data.accounting?.accountingSignature || data.accountingSignature || "",
            accountingDate: (data.accounting?.accountingDate || data.accountingDate || "").split('T')[0],
            registrationName: data.registration?.registrationName || data.registrationName || "",
            registrationSignature: data.registration?.registrationSignature || data.registrationSignature || "",
            registrationDate: (data.registration?.registrationDate || data.registrationDate || "").split('T')[0],
          };
        }
      },
      error: (error) => {
        console.error("Error loading semester withdrawal data:", error);
      }
    });
  }

  canViewSection(section: string): boolean {
    if (!this.currentUser) return false;
    const role = this.currentUser.role;

    // Students only see their own section
    if (role === "student") return section === "student";

    // Staff roles (accounting, registration, admin) can see all sections
    return true;
  }

  canEditSection(section: string): boolean {
    if (!this.currentUser) return false;

    const role = this.currentUser.role;

    switch (section) {
      case "student":
        return role === "student";
      case "accounting":
        return role === "accounting" || role === "admin";
      case "registration":
        return role === "registration" || role === "admin";
      default:
        return false;
    }
  }

  canEditAnySection(): boolean {
    return (
      this.canEditSection("student") ||
      this.canEditSection("accounting") ||
      this.canEditSection("registration")
    );
  }

  canSubmitForm(): boolean {
    return (
      this.currentUser?.role === "registration" ||
      this.currentUser?.role === "admin"
    );
  }

  saveForm(): void {
    this.submitForm();
  }

  submitForm(): void {
    if (!this.currentUser) {
      this.toastr.error('User not authenticated');
      return;
    }

    if (this.currentUser.role === 'student') {
      // Student submits new form
      const studentPayload = {
        formId: this.formId,
        studentId: this.formData.studentId,
        studentName: this.formData.studentName,
        mobileNumber: this.formData.mobileNumber,
        major: this.formData.major,
        level: this.formData.level,
        creditHours: this.formData.creditHours,
        gpa: this.formData.gpa,
        semesterRequested: this.formData.semesterRequested,
        dateOfApplication: this.formData.dateOfApplication,
        guardianSignature: this.formData.guardianSignature,
      };

      this.apiService.post('semester-withdrawals', studentPayload).subscribe({
        next: (response) => {
          this.toastr.success('Semester withdrawal form submitted successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.toastr.error('Failed to submit form. Please try again.');
          console.error('Submit error:', error);
        }
      });
    } else if (this.currentUser.role === 'accounting') {
      // Accounting officer updates existing form
      const accountingPayload = {
        id: this.formId,
        accounting: {
          accountingName: this.formData.accountingName,
          accountingSignature: this.formData.accountingSignature,
          accountingDate: this.formData.accountingDate,
          tuitionFeeApplicable: this.formData.tuitionFeeApplicable,
        }
      };

      this.apiService.patch(`semester-withdrawals`, accountingPayload).subscribe({
        next: (response) => {
          this.toastr.success('Accounting section updated successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.toastr.error('Failed to update form. Please try again.');
          console.error('Update error:', error);
        }
      });
    } else if (this.currentUser.role === 'registration') {
      // Registration officer updates existing form
      const registrationPayload = {
        id: this.formId,
        registration: {
          registrationName: this.formData.registrationName,
          registrationSignature: this.formData.registrationSignature,
          registrationDate: this.formData.registrationDate,
        }
      };

      this.apiService.patch(`semester-withdrawals`, registrationPayload).subscribe({
        next: (response) => {
          this.toastr.success('Registration section updated successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.toastr.error('Failed to update form. Please try again.');
          console.error('Update error:', error);
        }
      });
    }
  }

  cancel(): void {
    if (
      confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost.",
      )
    ) {
      this.router.navigate(["/dashboard"]);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
