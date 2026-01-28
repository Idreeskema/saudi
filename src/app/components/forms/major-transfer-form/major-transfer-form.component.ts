import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
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
    // Personal Information
    studentName: "",
    studentId: ["", "", "", "", "", "", "", "", ""],
    level: "",
    major: "",
    gpa: "",

    // Transfer Request
    currentMajor: "",
    proposedMajor: "",

    // Student and Guardian
    applicationDateDay: "",
    applicationDateMonth: "",
    applicationDateYear: "",
    mobile: "",

    // Authorized Person
    authorizedName: "",
    authorizedDateDay: "",
    authorizedDateMonth: "",
    authorizedDateYear: "",
    authorizedDateYear2: "",

    // Accounting Department
    hasPreviousFee: false,
    noPreviousFee: false,
    feeDifferencePaid: "",
    accountingName: "",
    accountingDateDay: "",
    accountingDateMonth: "",
    accountingDateYear: "",
    accountingDateYear2: "",

    // Registration Department
    transferApproved: false,
    transferDenied: false,
    denialReason: "",
    registrationName: "",
    registrationDateDay: "",
    registrationDateMonth: "",
    registrationDateYear: "",
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
      console.log("Transfer request submitted");
      alert("Major transfer form submitted successfully!");
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
