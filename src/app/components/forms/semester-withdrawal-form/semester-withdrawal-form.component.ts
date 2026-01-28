import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { User } from "../../../models/form.model";
import { SidebarComponent } from "../../sidebar/sidebar.component";

@Component({
  selector: "app-semester-withdrawal-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./semester-withdrawal-form.component.html",
  styleUrls: ["./semester-withdrawal-form.component.scss"],
})
export class SemesterWithdrawalFormComponent implements OnInit {
  currentUser: User | null = null;

  formData = {
    // Personal Information
    studentName: "",
    studentId: ["", "", "", "", "", "", "", "", ""],
    level: "",
    major: "",
    gpa: "",
    creditHours: "",

    // Semester Selection
    semesterFirst: false,
    semesterSecond: false,
    semesterSummer: false,

    // Student and Guardian Signatures
    applicationDateDay: "",
    applicationDateMonth: "",
    applicationDateYear: "",
    applicationDateYear2: "",
    mobile: "",

    // Accounting Department
    tuitionFee: "",
    accountingName: "",
    accountingDateDay: "",
    accountingDateMonth: "",
    accountingDateYear: "",
    accountingDateYear2: "",

    // Registration Department
    registrationName: "",
    registrationDateDay: "",
    registrationDateMonth: "",
    registrationDateYear: "",
    registrationDateYear2: "",
  };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }
  }

  canViewSection(section: string): boolean {
    if (!this.currentUser) return false;

    const role = this.currentUser.role;

    switch (section) {
      case "student":
        return true; // Everyone can see student info
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
        "Are you sure you want to submit this semester withdrawal request? This action cannot be undone.",
      )
    ) {
      console.log("Withdrawal submitted");
      alert(
        'Semester withdrawal form submitted successfully! You will receive a "W" grade for this semester.',
      );
      this.router.navigate(["/dashboard"]);
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
