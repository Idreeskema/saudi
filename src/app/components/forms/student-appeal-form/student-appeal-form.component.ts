import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { User } from "../../../models/form.model";
import { SidebarComponent } from "../../sidebar/sidebar.component";

@Component({
  selector: "app-student-appeal-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./student-appeal-form.component.html",
  styleUrls: ["./student-appeal-form.component.scss"],
})
export class StudentAppealFormComponent implements OnInit {
  currentUser: User | null = null;

  formData = {
    // Student Information
    studentId: ["", "", "", "", "", "", "", "", ""],
    studentName: "",
    program: "",
    courseNameCode: "",
    level: "",
    continuousAssessmentMark: "",
    courseDirectorName: "",

    // Reason
    reason: "",

    // Signature
    dateDay: "",
    dateMonth: "",
    dateYear: "",
    studentSignature: "",
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
    // All sections are for students in this form
    return true;
  }

  canEditSection(section: string): boolean {
    if (!this.currentUser) return false;
    const role = this.currentUser.role;
    return role === "student" || role === "admin";
  }

  canEditAnySection(): boolean {
    return this.canEditSection("student");
  }

  canSubmitForm(): boolean {
    return (
      this.currentUser?.role === "student" || this.currentUser?.role === "admin"
    );
  }

  saveForm(): void {
    console.log("Form Data:", this.formData);
    alert("Form saved successfully!");
  }

  submitForm(): void {
    if (
      confirm(
        "Are you sure you want to submit this appeal? This will be sent to the department head and course director via email.",
      )
    ) {
      console.log("Appeal submitted");
      alert(
        "Appeal submitted successfully! The form will be sent to the department head and course director via email.",
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
