import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { User } from "../../../models/form.model";
import { SidebarComponent } from "../../sidebar/sidebar.component";

@Component({
  selector: "app-course-add-drop-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./course-add-drop-form.component.html",
  styleUrls: ["./course-add-drop-form.component.scss"],
})
export class CourseAddDropFormComponent implements OnInit {
  currentUser: User | null = null;

  formData = {
    // Personal Information
    studentName: "",
    mobile: "",
    studentId: ["", "", "", "", "", "", "", "", ""],
    gpa: "",
    major: "",
    academicYear1: "",
    academicYear2: "",
    academicYear3: "",
    academicYear4: "",
    level: "",

    // Semester
    semesterFirst: false,
    semesterSecond: false,
    semesterSummer: false,

    registerCredit: "",

    // Courses
    coursesToDrop: "",
    coursesToAdd: "",
    otherIssues: "",

    // Student Signature
    studentSignDateDay: "",
    studentSignDateMonth: "",
    studentSignDateYear: "",

    // Registration Department
    registrationComments: "",
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
      case "registration":
        return role === "registration" || role === "admin";
      default:
        return false;
    }
  }

  canEditAnySection(): boolean {
    return (
      this.canEditSection("student") || this.canEditSection("registration")
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
