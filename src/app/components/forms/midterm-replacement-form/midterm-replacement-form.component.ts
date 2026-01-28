import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { User } from "../../../models/form.model";
import { SidebarComponent } from "../../sidebar/sidebar.component";

@Component({
  selector: "app-midterm-replacement-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./midterm-replacement-form.component.html",
  styleUrls: ["./midterm-replacement-form.component.scss"],
})
export class MidtermReplacementFormComponent implements OnInit {
  currentUser: User | null = null;
  reasonLines: number[] = Array(6).fill(0); // 6 lines for reasons

  formData = {
    // Student Information
    studentName: "",
    studentId: ["", "", "", "", "", "", "", "", ""],
    major: "",
    level: "",
    courseNotAttended: "",
    mobile: "",
    email: "",

    // Exam Details
    semesterFirst: false,
    semesterSecond: false,
    semesterSummer: false,
    academicYear1: "",
    academicYear2: "",
    academicYear3: "",

    midtermFirst: false,
    midtermSecond: false,
    midtermSummer: false,

    // Reasons (6 lines)
    reasonLines: Array(6).fill(""),

    // Decision
    approvalDecision: false,
    denialDecision: false,
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
      case "dean":
        return ["dean", "admin"].includes(role);
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
      case "dean":
        return role === "dean" || role === "admin";
      default:
        return false;
    }
  }

  canEditAnySection(): boolean {
    return this.canEditSection("student") || this.canEditSection("dean");
  }

  canSubmitForm(): boolean {
    return (
      this.currentUser?.role === "dean" || this.currentUser?.role === "admin"
    );
  }

  saveForm(): void {
    console.log("Form Data:", this.formData);
    alert("Form saved successfully!");
  }

  submitForm(): void {
    if (
      confirm(
        "Are you sure you want to submit this mid-term exam replacement request?",
      )
    ) {
      console.log("Request submitted");
      alert("Mid-term exam replacement form submitted successfully!");
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
