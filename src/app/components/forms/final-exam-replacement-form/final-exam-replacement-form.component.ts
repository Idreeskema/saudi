import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { User } from "../../../models/form.model";
import { SidebarComponent } from "../../sidebar/sidebar.component";

@Component({
  selector: "app-final-exam-replacement-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./final-exam-replacement-form.component.html",
  styleUrls: ["./final-exam-replacement-form.component.scss"],
})
export class FinalExamReplacementFormComponent implements OnInit {
  currentUser: User | null = null;

  formData = {
    // Student Information
    studentName: "",
    studentId: ["", "", "", "", "", "", "", "", ""],
    major: "",
    email: "",
    mobile: "",
    level: "",
    courseNotAttended: "",

    // Semester Details
    semesterFirst: false,
    semesterSecond: false,
    semesterSummer: false,
    academicYear1: "",
    academicYear2: "",
    academicYear3: "",

    // Reasons
    reason1: "",
    reason2: "",

    // Previous Absence
    previousAbsence: "",

    // Lecturer Information
    continuesAssessmentMark: "",
    missedMidterm: "",
    directorOpinion: "",

    // Board Decision
    approved: false,
    denied: false,
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
      case "lecturer":
        return ["lecturer", "faculty", "admin"].includes(role);
      case "board":
        return ["dean", "board", "admin"].includes(role);
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
      case "lecturer":
        return role === "lecturer" || role === "faculty" || role === "admin";
      case "board":
        return role === "dean" || role === "board" || role === "admin";
      default:
        return false;
    }
  }

  canEditAnySection(): boolean {
    return (
      this.canEditSection("student") ||
      this.canEditSection("lecturer") ||
      this.canEditSection("board")
    );
  }

  canSubmitForm(): boolean {
    return (
      this.currentUser?.role === "dean" ||
      this.currentUser?.role === "board" ||
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
        "Are you sure you want to submit this final exam replacement request?",
      )
    ) {
      console.log("Request submitted");
      alert("Final exam replacement form submitted successfully!");
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
