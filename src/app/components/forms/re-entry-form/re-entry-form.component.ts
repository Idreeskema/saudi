import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { User } from "../../../models/form.model";
import { SidebarComponent } from "../../sidebar/sidebar.component";

@Component({
  selector: "app-re-entry-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./re-entry-form.component.html",
  styleUrls: ["./re-entry-form.component.scss"],
})
export class ReEntryFormComponent implements OnInit {
  currentUser: User | null = null;

  formData = {
    // Personal Information
    studentName: "",
    mobile: "",
    email: "",
    gpa: "",
    major: "",

    // Date of Enrollment
    enrollmentFirstSemester: false,
    enrollmentSecondSemester: false,
    enrollmentYear1: "",
    enrollmentYear2: "",
    enrollmentYear3: "",
    enrollmentYear4: "",

    // Last Semester Enrolled
    lastSemesterFirst: false,
    lastSemesterSecond: false,
    lastSemesterYear1: "",
    lastSemesterYear2: "",
    lastSemesterYear3: "",
    lastSemesterYear4: "",

    // Declaration
    declarationName: "",
    declarationNameEn: "",

    // Faculty Council Decision
    facultyName: "",
    sessionNo: "",
    decisionDateDay: "",
    decisionDateMonth: "",
    decisionDateYear: "",
    decision: "",

    // Dean Information
    deanName: "",
    deanDateDay: "",
    deanDateMonth: "",
    deanDateYear: "",
    deanDateYear2: "",
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
      case "faculty":
        return ["faculty", "dean", "admin"].includes(role);
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
      case "faculty":
        return role === "faculty" || role === "admin";
      case "dean":
        return role === "dean" || role === "admin";
      default:
        return false;
    }
  }

  canEditAnySection(): boolean {
    return (
      this.canEditSection("student") ||
      this.canEditSection("faculty") ||
      this.canEditSection("dean")
    );
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
        "Are you sure you want to submit this form? This action cannot be undone.",
      )
    ) {
      console.log("Form submitted");
      alert("Form submitted successfully!");
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
