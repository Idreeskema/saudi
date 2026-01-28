import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { User } from "../../../models/form.model";
import { SidebarComponent } from "../../sidebar/sidebar.component";

@Component({
  selector: "app-replacement-exam-declaration-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./replacement-exam-declaration-form.component.html",
  styleUrls: ["./replacement-exam-declaration-form.component.scss"],
})
export class ReplacementExamDeclarationFormComponent implements OnInit {
  currentUser: User | null = null;

  formData = {
    // Declaration Text
    studentName: "",
    courseName: "",
    semester: "",
    year1: "",
    year2: "",

    studentNameEn: "",
    courseNameEn: "",
    semesterEn: "",
    year3: "",

    // Student Information
    studentNameFinal: "",
    studentId: ["", "", "", "", "", "", "", "", ""],
    dateDay: "",
    dateMonth: "",
    dateYear: "",
    dateYear2: "",
    dateYear3: "",
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
    // All sections are for students in this declaration form
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
    alert("Declaration saved successfully!");
  }

  submitForm(): void {
    if (
      confirm(
        "Are you sure you want to submit this replacement examination declaration? By submitting, you acknowledge that you understand the terms and conditions.",
      )
    ) {
      console.log("Declaration submitted");
      alert("Replacement examination declaration submitted successfully!");
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
