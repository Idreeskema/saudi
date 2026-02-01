import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { ApiService } from "../../../services/api.service";
import { User } from "../../../models/form.model";
import { SidebarComponent } from "../../sidebar/sidebar.component";

@Component({
  selector: "app-major-transfer-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./major-transfer-form.component.html",
  styleUrls: ["./major-transfer-form.component.scss"],
})
export class MajorTransferFormComponent implements OnInit {
  currentUser: User | null = null;

  formData = {
    formId: 0,
    // Personal Information
    studentName: "",
    studentId: "",
    level: "",
    major: "",
    gpa: "",

    // Transfer Request
    currentMajor: "",
    proposedMajor: "",

    // Student and Guardian Signatures
    studentSignature: "",
    guardianSignature: "",

    // Application Date
    dateOfApplication: "",
    mobile: "",
    email: "",

    // Authorized Person Section
    authorizedName: "",
    authorizedSignature: "",
    authorizedDateDay: "",
    authorizedDateMonth: "",
    authorizedDateYear: "",
    authorizedDateYear2: "",

    // Accounting Section
    hasPreviousFee: false,
    noPreviousFee: false,
    feeDifferencePaid: "", // "yes" or "no"
    accountingName: "",
    accountingSignature: "",
    accountingDateDay: "",
    accountingDateMonth: "",
    accountingDateYear: "",
    accountingDateYear2: "",

    // Registration Section
    transferApproved: false,
    transferDenied: false,
    denialReason: "",
    registrationName: "",
    registrationSignature: "",
    registrationDateDay: "",
    registrationDateMonth: "",
    registrationDateYear: "",
  };

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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formData.formId = +id;
      this.loadFormData();
    }
  }

  loadFormData(): void {
    if (this.formData.formId > 0) {
      this.apiService.get(`major-transfer-forms/${this.formData.formId}`).subscribe({
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
    this.formData.gpa = String(data.gpa || "");
    this.formData.currentMajor = data.currentMajor || "";
    this.formData.proposedMajor = data.proposedMajor || "";
    this.formData.studentSignature = data.studentSignature || "";
    this.formData.guardianSignature = data.guardianSignature || "";
    this.formData.mobile = data.mobileNumber || "";
    this.formData.email = data.email || "";
    this.formData.dateOfApplication = data.dateOfApplication ? new Date(data.dateOfApplication).toISOString().split('T')[0] : "";
  }

  getApplicationDateISO(): string {
    if (this.formData.dateOfApplication) {
      return new Date(this.formData.dateOfApplication).toISOString();
    }
    return new Date().toISOString();
  }

  getAuthorizedDateISO(): string {
    const day = this.formData.authorizedDateDay;
    const month = this.formData.authorizedDateMonth;
    const year = this.formData.authorizedDateYear;
    if (day && month && year) {
      const gregorianYear = parseInt(year) + 622;
      return `${gregorianYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00.000Z`;
    }
    return new Date().toISOString();
  }

  getAccountingDateISO(): string {
    const day = this.formData.accountingDateDay;
    const month = this.formData.accountingDateMonth;
    const year = this.formData.accountingDateYear;
    if (day && month && year) {
      const gregorianYear = parseInt(year) + 622;
      return `${gregorianYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00.000Z`;
    }
    return new Date().toISOString();
  }

  getRegistrationDateISO(): string {
    const day = this.formData.registrationDateDay;
    const month = this.formData.registrationDateMonth;
    const year = this.formData.registrationDateYear;
    if (day && month && year) {
      const gregorianYear = parseInt(year) + 622;
      return `${gregorianYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00.000Z`;
    }
    return new Date().toISOString();
  }

  canViewSection(section: string): boolean {
    if (!this.currentUser) return false;

    const role = this.currentUser.role;

    switch (section) {
      case "student":
        return true;
      case "authorized":
        return ["authorized", "admin"].includes(role);
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
      case "authorized":
        return role === "authorized" || role === "admin";
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
      this.canEditSection("authorized") ||
      this.canEditSection("accounting") ||
      this.canEditSection("registration")
    );
  }

  canSubmitForm(): boolean {
    return this.currentUser?.role === "student";
  }

  canAuthorizeForm(): boolean {
    return (
      this.currentUser?.role === "authorized" ||
      this.currentUser?.role === "admin"
    );
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
      confirm("Are you sure you want to submit this major transfer request?")
    ) {
      const payload: any = {
        studentId: this.formData.studentId,
        studentName: this.formData.studentName,
        email: this.formData.email,
        mobileNumber: this.formData.mobile,
        major: this.formData.major,
        level: this.formData.level,
        gpa: parseFloat(this.formData.gpa) || 0,
        currentMajor: this.formData.currentMajor,
        proposedMajor: this.formData.proposedMajor,
        studentSignature: this.formData.studentSignature,
        guardianSignature: this.formData.guardianSignature,
        dateOfApplication: this.getApplicationDateISO(),
      };

      // Only include formId if editing an existing form
      if (this.formData.formId > 0) {
        payload.formId = this.formData.formId;
      }

      this.apiService
        .post("major-transfer-forms", payload)
        .subscribe({
          next: (response: any) => {
            console.log("Major transfer request submitted successfully", response);
            if (response.id) {
              this.formData.formId = response.id;
            }
            alert("Major transfer form submitted successfully!");
            this.router.navigate(["/dashboard"]);
          },
          error: (error) => {
            console.error("Error submitting major transfer form", error);
            alert("Error submitting form. Please try again.");
          },
        });
    }
  }

  submitAuthorizedSection(): void {
    if (
      confirm("Are you sure you want to submit the authorized person section?")
    ) {
      const payload = {
        id: this.formData.formId,
        authorizedPersonSection: {
          name: this.formData.authorizedName,
          signature: this.formData.authorizedSignature,
          date: this.getAuthorizedDateISO(),
        },
      };

      this.apiService
        .patch("major-transfer-forms", payload)
        .subscribe({
          next: (response) => {
            console.log("Authorized section submitted successfully", response);
            alert("Authorized person section submitted successfully!");
            this.router.navigate(["/dashboard"]);
          },
          error: (error) => {
            console.error("Error submitting authorized section", error);
            alert("Error submitting section. Please try again.");
          },
        });
    }
  }

  submitAccountingSection(): void {
    if (
      confirm("Are you sure you want to submit the accounting section?")
    ) {
      const payload = {
        id: this.formData.formId,
        accountingSection: {
          hasPreviousTuition: this.formData.hasPreviousFee,
          tuitionDifferencePaid: this.formData.feeDifferencePaid === "yes",
          name: this.formData.accountingName,
          signature: this.formData.accountingSignature,
          date: this.getAccountingDateISO(),
        },
      };

      this.apiService
        .patch("major-transfer-forms", payload)
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
    if (
      confirm("Are you sure you want to submit the registration section?")
    ) {
      const payload = {
        id: this.formData.formId,
        registrationSection: {
          decision: this.formData.transferApproved,
          reason: this.formData.denialReason,
          name: this.formData.registrationName,
          signature: this.formData.registrationSignature,
          date: this.getRegistrationDateISO(),
        },
      };

      this.apiService
        .patch("major-transfer-forms", payload)
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
