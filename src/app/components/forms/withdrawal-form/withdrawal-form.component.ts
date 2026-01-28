import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
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
  reasonLines: number[] = Array(4).fill(0); // 4 lines for reasons

  formData = {
    // Personal Information
    studentName: "",
    studentId: "",
    level: "",
    major: "",
    gpa: "",

    // Withdrawal Reasons (4 lines)
    reasonLines: Array(4).fill(""),

    // Student and Guardian Signatures
    applicationDateDay: "",
    applicationDateMonth: "",
    applicationDateYear: "",
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

    // File Receipt
    receiptDateDay: "",
    receiptDateMonth: "",
    receiptDateYear: "",
    receiptDateYear2: "",
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
        "Are you sure you want to submit this withdrawal form? This action cannot be undone.",
      )
    ) {
      console.log("Withdrawal submitted");
      alert("Withdrawal form submitted successfully!");
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
