import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { ApiService } from "../../../services/api.service";
import { User } from "../../../models/form.model";
import { SidebarComponent } from "../../sidebar/sidebar.component";

@Component({
  selector: "app-semester-postponement-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./semester-postponement-form.component.html",
  styleUrls: ["./semester-postponement-form.component.scss"],
})
export class SemesterPostponementFormComponent implements OnInit {
  currentUser: User | null = null;

  formData = {
    formId: 0,
    // Personal Information
    studentName: "",
    studentId: "",
    level: "",
    major: "",
    gpa: 0,
    creditHours: 0,

    // Semester Selection
    semesterRequested: "",

    // Student and Guardian Signatures
    studentSignature: "",
    guardianSignature: "",
    dateOfApplication: "",
    mobileNumber: "",

    // Accounting Department
    hasTuitionFee: false,
    accountingName: "",
    accountingSignature: "",
    accountingDate: "",

    // Registration Department
    registrationDecision: false,
    registrationReason: "",
    registrationName: "",
    registrationSignature: "",
    registrationDate: "",
  };

  semesters = [
    { value: "Fall 2025", arabic: "الخريف 2025" },
    { value: "Spring 2026", arabic: "الربيع 2026" },
    { value: "Summer 2026", arabic: "الصيفي 2026" },
  ];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }

    // Get formId from route parameters if editing an existing form
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.formData.formId = +id;
      this.loadFormData();
    }

    // Set default date to current date
    if (!this.formData.dateOfApplication) {
      this.formData.dateOfApplication = new Date().toISOString();
    }
  }

  loadFormData(): void {
    if (this.formData.formId > 0) {
      this.apiService
        .get(`semester-postponement-forms/${this.formData.formId}`)
        .subscribe({
          next: (response: any) => {
            console.log("Form data loaded successfully", response);
            this.populateFormData(response);
          },
          error: (error) => {
            console.error("Error loading form data", error);
          },
        });
    }
  }

  populateFormData(data: any): void {
    this.formData.studentName = data.studentName || "";
    this.formData.studentId = data.studentId || "";
    this.formData.level = data.level || "";
    this.formData.major = data.major || "";
    this.formData.gpa = data.gpa || 0;
    this.formData.creditHours = data.creditHours || 0;
    this.formData.semesterRequested = data.semesterRequested || "";
    this.formData.studentSignature = data.studentSignature || "";
    this.formData.guardianSignature = data.guardianSignature || "";
    this.formData.mobileNumber = data.mobileNumber || "";
    this.formData.dateOfApplication = data.dateOfApplication || "";
    this.formData.hasTuitionFee = data.hasTuitionFee || false;
    this.formData.accountingName = data.accountingName || "";
    this.formData.accountingSignature = data.accountingSignature || "";
    this.formData.accountingDate = data.accountingDate || "";
    this.formData.registrationDecision = data.registrationDecision || false;
    this.formData.registrationReason = data.registrationReason || "";
    this.formData.registrationName = data.registrationName || "";
    this.formData.registrationSignature = data.registrationSignature || "";
    this.formData.registrationDate = data.registrationDate || "";
  }

  canViewSection(section: string): boolean {
    if (!this.currentUser) return false;

    const role = this.currentUser.role;

    switch (section) {
      case "student":
        return true;
      case "accounting":
        return ["accounting", "admin"].includes(role);
      case "registration":
        return ["registration", "admin"].includes(role);
      default:
        return false;
    }
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
    return this.currentUser?.role === "student";
  }

  canProcessAccounting(): boolean {
    return (
      this.currentUser?.role === "accounting" ||
      this.currentUser?.role === "admin"
    );
  }

  canProcessRegistration(): boolean {
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
    if (
      confirm(
        "Are you sure you want to submit this semester postponement request? This action cannot be undone.",
      )
    ) {
      const payload: any = {
        studentId: this.formData.studentId,
        studentName: this.formData.studentName,
        major: this.formData.major,
        level: this.formData.level,
        gpa: this.formData.gpa,
        creditHours: this.formData.creditHours,
        semesterRequested: this.formData.semesterRequested,
        studentSignature: this.formData.studentSignature,
        guardianSignature: this.formData.guardianSignature,
        dateOfApplication: this.formData.dateOfApplication,
        mobileNumber: this.formData.mobileNumber,
      };

      // Only include formId if editing an existing form
      if (this.formData.formId > 0) {
        payload.formId = this.formData.formId;
      }

      this.apiService
        .post("semester-postponement-forms", payload)
        .subscribe({
          next: (response: any) => {
            console.log("Postponement submitted successfully", response);
            if (response.id) {
              this.formData.formId = response.id;
            }
            alert("Semester postponement form submitted successfully!");
            this.router.navigate(["/dashboard"]);
          },
          error: (error) => {
            console.error("Error submitting postponement form", error);
            alert("Error submitting form. Please try again.");
          },
        });
    }
  }

  submitAccountingSection(): void {
    if (confirm("Are you sure you want to submit the accounting section?")) {
      const payload = {
        id: this.formData.formId,
        accountingSection: {
          hasTuitionFee: this.formData.hasTuitionFee,
          name: this.formData.accountingName,
          signature: this.formData.accountingSignature,
          date: this.formData.accountingDate || new Date().toISOString(),
        },
      };

      this.apiService
        .patch("semester-postponement-forms", payload)
        .subscribe({
          next: (response) => {
            console.log("Accounting section submitted successfully", response);
            alert("Accounting section submitted successfully!");
            this.router.navigate(["/dashboard"]);
          },
          error: (error) => {
            console.error("Error submitting accounting section", error);
            alert("Error submitting section. Please try again.");
          },
        });
    }
  }

  submitRegistrationSection(): void {
    if (confirm("Are you sure you want to submit the registration section?")) {
      const payload = {
        id: this.formData.formId,
        registrationSection: {
          decision: this.formData.registrationDecision,
          reason: this.formData.registrationReason,
          name: this.formData.registrationName,
          signature: this.formData.registrationSignature,
          date: this.formData.registrationDate || new Date().toISOString(),
        },
      };

      this.apiService
        .patch("semester-postponement-forms", payload)
        .subscribe({
          next: (response) => {
            console.log("Registration section submitted successfully", response);
            alert("Registration section submitted successfully!");
            this.router.navigate(["/dashboard"]);
          },
          error: (error) => {
            console.error("Error submitting registration section", error);
            alert("Error submitting section. Please try again.");
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
