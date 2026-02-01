import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from "ngx-toastr";
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
  formId: number = 24;

  formData = {
    // Student Information
    studentId: "",
    studentName: "",
    major: "",
    level: "",
    email: "",
    mobileNumber: "",

    // Course Information
    courseName: "",
    semesterRequested: "",
    academicYear: "",

    // Declaration
    absenceReason: "",
    hasMissedOtherExams: false,

    // Signature
    studentSignature: "",
    dateSigned: "",
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }
    if (this.formId > 0) {
      this.loadFormData();
    }
  }

  loadFormData(): void {
    this.apiService.get(`declaration-replacement-exam/${this.formId}`).subscribe({
      next: (response: any) => {
        const data = response.data || response;
        if (data) {
          this.formData = {
            ...this.formData,
            ...data
          };
        }
      },
      error: (error) => {
        console.error("Error loading declaration data:", error);
      }
    });
  }

  canViewSection(section: string): boolean {
    if (!this.currentUser) return false;
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
      this.currentUser?.role === "student" ||
      this.currentUser?.role === "admin"
    );
  }

  saveForm(): void {
    console.log("Form Data:", this.formData);
    alert("Declaration saved successfully!");
  }

  submitForm(): void {
    if (!this.currentUser) {
      this.toastr.error("Please login first", "Error");
      return;
    }

    const payload = {
      formId: this.formId,
      studentId: this.formData.studentId,
      studentName: this.formData.studentName,
      major: this.formData.major,
      level: this.formData.level,
      email: this.formData.email,
      mobileNumber: this.formData.mobileNumber,
      courseName: this.formData.courseName,
      semesterRequested: this.formData.semesterRequested,
      academicYear: this.formData.academicYear,
      absenceReason: this.formData.absenceReason,
      hasMissedOtherExams: this.formData.hasMissedOtherExams,
      studentSignature: this.formData.studentSignature,
      dateSigned: this.formData.dateSigned,
    };

    this.apiService.post("declaration-replacement-exam", payload).subscribe({
      next: (response) => {
        this.toastr.success(
          "Replacement examination declaration submitted successfully!",
          "Success"
        );
        this.router.navigate(["/dashboard"]);
      },
      error: (error) => {
        this.toastr.error("Failed to submit declaration", "Error");
        console.error("Error submitting form:", error);
      },
    });
  }

  cancel(): void {
    if (
      confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost."
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
