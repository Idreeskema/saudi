import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from "ngx-toastr";
import { User } from "../../../models/form.model";
import { SidebarComponent } from "../../sidebar/sidebar.component";

@Component({
  selector: "app-withdrawal-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./withdrawal-form.component.html",
  styleUrls: ["./withdrawal-form.component.scss"],
})
export class WithdrawalFormComponent implements OnInit {
  currentUser: User | null = null;
  formId: number = 23; // Default, can be from route
  id: number = 0; // Request/sequence ID for accounting and registration
  withdrawalSubmitted: boolean = false;

  formData = {
    // Personal Information
    studentName: "",
    studentId: "",
    level: "",
    major: "",
    gpa: 0,
    mobileNumber: "",
    dateOfApplication: "",
    studentSignature: "",
    guardianSignature: "",
    withdrawalReason: "",

    // Accounting Department
    tuitionFeeApplicable: false,
    accountingName: "",
    accountingSignature: "",
    accountingDate: "",

    // Registration Department
    registrationName: "",
    registrationSignature: "",
    registrationDate: "",
    studentFileSignature: "",
    studentFileReceivedDate: "",
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
      this.formId = +params['id'] || 0; 
      this.id = +params['id'] || 0; 
      this.loadFormData();
    });
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }
  }

  loadFormData(): void {
    const fetchId = this.id;
    if (fetchId > 0) {
      this.apiService.get(`university-withdrawals/${fetchId}`).subscribe({
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
              studentFileReceivedDate: data.studentFileReceivedDate ? data.studentFileReceivedDate.split('T')[0] : "",
            };
          }
        },
        error: (error) => {
          console.error("Error loading withdrawal data:", error);
        }
      });
    }
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
    console.log("Form Data:", this.formData);
    alert("Form saved successfully!");
  }

  submitForm(): void {
    if (!this.currentUser) {
      this.toastr.error("Please login first", "Error");
      return;
    }

    const role = this.currentUser.role;
    const endpoint = "university-withdrawals";

    this.withdrawalSubmitted = true;

    if ((role === "student" || role === "admin") && !this.formData.withdrawalReason.trim()) {
      this.toastr.error("Withdrawal reason is required", "Error");
      return;
    }

    if (
      (role === "registration" || role === "admin") &&
      (!this.formData.studentFileSignature.trim() || !this.formData.studentFileReceivedDate)
    ) {
      this.toastr.error("Student signature on receiving file and its date are required", "Error");
      return;
    }

    if (role === "student") {
      if (
        !confirm(
          "Are you sure you want to withdraw from the University? This action cannot be undone.",
        )
      ) {
        return;
      }

      // Student submits new withdrawal request
      const payload = {
        formId: this.formId,
        studentName: this.formData.studentName,
        studentId: this.formData.studentId,
        level: this.formData.level,
        major: this.formData.major,
        gpa: this.formData.gpa,
        mobileNumber: this.formData.mobileNumber,
        dateOfApplication: this.formData.dateOfApplication,
        studentSignature: this.formData.studentSignature,
        guardianSignature: this.formData.guardianSignature,
        withdrawalReason: this.formData.withdrawalReason,
      };

      this.apiService.post(endpoint, payload).subscribe({
        next: (response) => {
          this.toastr.success("Withdrawal form submitted successfully!", "Success");
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          this.toastr.error(error.error.message, "Error");
          console.error("Error submitting form:", error);
        },
      });
    } else if (role === "accounting") {
      // Accounting officer approves/updates
      if (!this.id) {
        this.toastr.error("ID not found", "Error");
        return;
      }

      const payload = {
        id: this.id,
        accounting: {
          tuitionFeeApplicable: this.formData.tuitionFeeApplicable,
          accountingName: this.formData.accountingName,
          accountingSignature: this.formData.accountingSignature,
          accountingDate: this.formData.accountingDate,
        },
      };

      this.apiService.patch(`${endpoint}`, payload).subscribe({
        next: (response) => {
          this.toastr.success("Accounting section updated successfully!", "Success");
          this.router.navigate(["/pending-requests"]);
        },
        error: (error) => {
          this.toastr.error("Failed to update accounting section", "Error");
          console.error("Error updating accounting:", error);
        },
      });
    } else if (role === "registration") {
      // Registration officer approves/finalizes
      if (!this.id) {
        this.toastr.error("ID not found", "Error");
        return;
      }

      const payload = {
        id: this.id,
        registration: {
          registrationName: this.formData.registrationName,
          registrationSignature: this.formData.registrationSignature,
          registrationDate: this.formData.registrationDate,
          studentFileSignature: this.formData.studentFileSignature,
          studentFileReceivedDate: this.formData.studentFileReceivedDate,
        },
      };

      this.apiService.patch(`${endpoint}`, payload).subscribe({
        next: (response) => {
          this.toastr.success("Registration section updated successfully!", "Success");
          this.router.navigate(["/pending-requests"]);
        },
        error: (error) => {
          this.toastr.error("Failed to update registration section", "Error");
          console.error("Error updating registration:", error);
        },
      });
    } else if (role === "admin") {
      // Admin can submit any section
      if (!this.id) {
        this.toastr.error("ID not found", "Error");
        return;
      }

      const payload = {
        id: this.id,
        ...this.formData,
      };

      this.apiService.patch(`${endpoint}`, payload).subscribe({
        next: (response) => {
          this.toastr.success("Form updated successfully!", "Success");
          this.router.navigate(["/pending-requests"]);
        },
        error: (error) => {
          this.toastr.error("Failed to update form", "Error");
          console.error("Error updating form:", error);
        },
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
