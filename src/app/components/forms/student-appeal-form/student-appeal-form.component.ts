import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { ApiService } from "../../../services/api.service";
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
  formId: string = "";

  formData = {
    // Student Information
    studentId: "",
    studentName: "",
    program: "",
    courseName: "",
    courseCode: "",
    level: "",
    continuousAssessmentMark: "",
    courseDirectorName: "",

    // Reason
    reason: "",

    // Signature
    studentSignature: "",
    studentDate: "",
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }

    // Get formId from route parameters
    this.route.params.subscribe((params) => {
      this.formId = params["id"];
      this.checkExistingAppeal();
    });
  }

  checkExistingAppeal(): void {
    if (this.currentUser && this.formId) {
      this.apiService.getStudentAppeal(parseInt(this.formId)).subscribe({
        next: (response) => {
          if (response && response.data) {
            // Populate form with existing data
            const appealData = response.data;
            this.formData.studentId = appealData.studentId || "";
            this.formData.studentName = appealData.studentName || "";
            this.formData.program = appealData.program || "";
            this.formData.courseName = appealData.courseName || "";
            this.formData.courseCode = appealData.courseCode || "";
            this.formData.level = appealData.level || "";
            this.formData.continuousAssessmentMark =
              appealData.continuousAssessmentMark?.toString() || "";
            this.formData.courseDirectorName =
              appealData.courseDirectorName || "";
            this.formData.reason = appealData.reason || "";
            this.formData.studentSignature = appealData.studentSignature || "";
            this.formData.studentDate = appealData.studentDate || "";
          }
        },
        error: (error) => {
          // If the appeal doesn't exist (404), that's expected - the student can submit a new one
          if (error.status !== 404) {
            console.error("Error checking existing appeal:", error);
          }
        },
      });
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
      // Prepare the payload according to the API requirements
      const payload = {
        formId: parseInt(this.formId),
        studentId: this.formData.studentId,
        studentName: this.formData.studentName,
        program: this.formData.program,
        courseName: this.formData.courseName,
        courseCode: this.formData.courseCode,
        level: this.formData.level,
        continuousAssessmentMark: parseFloat(
          this.formData.continuousAssessmentMark,
        ),
        courseDirectorName: this.formData.courseDirectorName,
        reason: this.formData.reason,
        studentSignature: this.formData.studentSignature,
        studentDate: new Date().toISOString(),
      };

      this.apiService.createStudentAppeal(payload).subscribe({
        next: (response) => {
          console.log("Appeal submitted successfully:", response);
          alert(
            "Appeal submitted successfully! The form will be sent to the department head and course director via email.",
          );
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          console.error("Error submitting appeal:", error);
          alert("Error submitting appeal. Please try again.");
        },
      });
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
