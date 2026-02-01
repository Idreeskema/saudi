import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { ApiService } from "../../../services/api.service";
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
    formId: 0,
    // Student Information
    studentId: "",
    studentName: "",
    major: "",
    level: "",
    email: "",
    mobileNumber: "",
    courseName: "",
    semesterRequested: "",
    academicYear: "",
    absenceReason: "",
    hasMissedOtherExams: false,
    studentSignature: "",
    dateSigned: "",
    id: 0,
    // Lecturer Information
    lecturerContinuousAssessmentMark: 0,
    lecturerMissedMidtermBefore: false,
    lecturerOpinion: "",
    lecturerSignature: "",

    // Course Director Information
    directorOpinion: "",
    directorSignature: "",

    // Dean Information
    deanDecision: false,
    deanSignature: "",
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.formData.formId = parseInt(id, 10);
        this.loadFormData(this.formData.formId);
      }
    });
  }

  loadFormData(id: number): void {
    this.apiService.get(`final-exam-replacement/${id}`).subscribe({
      next: (response: any) => {
        const data = response.data || response;
        if (data) {
          // Map API response to formData
          this.formData = {
            ...this.formData,
            ...data,
            // Ensure section objects are flattened or mapped if needed
            // The API might return lecturerSection: { ... }
            lecturerContinuousAssessmentMark: data.lecturerSection?.continuousAssessmentMark || data.lecturerContinuousAssessmentMark || 0,
            lecturerMissedMidtermBefore: data.lecturerSection?.missedMidtermBefore || data.lecturerMissedMidtermBefore || false,
            lecturerOpinion: data.lecturerSection?.opinion || data.lecturerOpinion || "",
            lecturerSignature: data.lecturerSection?.signature || data.lecturerSignature || "",
            
            directorOpinion: data.courseDirectorSection?.opinion || data.directorOpinion || "",
            directorSignature: data.courseDirectorSection?.signature || data.directorSignature || "",
            
            deanDecision: data.deanSection?.decision || data.deanDecision || false,
            deanSignature: data.deanSection?.signature || data.deanSignature || "",
          };
        }
      },
      error: (error) => {
        console.error("Error loading form data:", error);
      }
    });
  }

  canViewSection(section: string): boolean {
    if (!this.currentUser) return false;

    const role = this.currentUser.role;

    switch (section) {
      case "student":
        return true;
      case "lecturer":
        return ["lecturer", "faculty", "admin"].includes(role);
      case "courseDirector":
        return ["courseDirector", "authorized", "admin"].includes(role);
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
      case "lecturer":
        return role === "lecturer" || role === "faculty" || role === "admin";
      case "courseDirector":
        return role === "courseDirector" || role === "authorized" || role === "admin";
      case "dean":
        return role === "dean" || role === "admin";
      default:
        return false;
    }
  }

  canEditAnySection(): boolean {
    return (
      this.canEditSection("student") ||
      this.canEditSection("lecturer") ||
      this.canEditSection("courseDirector") ||
      this.canEditSection("dean")
    );
  }

  canSubmitForm(): boolean {
    return (
      this.currentUser?.role === "student" || 
      this.currentUser?.role === "lecturer" ||
      this.currentUser?.role === "courseDirector" ||
      this.currentUser?.role === "dean" ||
      this.currentUser?.role === "admin"
    );
  }

  saveForm(): void {
    console.log("Form Data:", this.formData);
    alert("Form saved successfully!");
  }

  submitForm(): void {
    if (confirm("Are you sure you want to submit this final exam replacement request?")) {
      const payload = {
        formId: this.formData.formId || 26, // Default or dynamic Ids
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
        dateSigned: this.formData.dateSigned || new Date().toISOString(),
      };

      this.apiService.post("final-exam-replacement", payload).subscribe({
        next: (response: any) => {
          console.log("Student request submitted successfully", response);
          alert("Student request submitted successfully!");
          this.router.navigate(["/dashboard"]);
        },
        error: (error: any) => {
          console.error("Error submitting student request", error);
          alert("Error submitting request. Please try again.");
        }
      });
    }
  }

  submitLecturerSection(): void {
    if (confirm("Are you sure you want to submit the lecturer section?")) {
      const payload = {
        id: this.formData.id,
        lecturerSection: {
          continuousAssessmentMark: this.formData.lecturerContinuousAssessmentMark,
          missedMidtermBefore: this.formData.lecturerMissedMidtermBefore,
          opinion: this.formData.lecturerOpinion,
          signature: this.formData.lecturerSignature
        }
      };

      this.apiService.patch("final-exam-replacement", payload).subscribe({
        next: (response: any) => {
          console.log("Lecturer section submitted successfully", response);
          alert("Lecturer section submitted successfully!");
          this.router.navigate(["/dashboard"]);
        },
        error: (error: any) => {
          console.error("Error submitting lecturer section", error);
          alert("Error submitting section. Please try again.");
        }
      });
    }
  }

  submitCourseDirectorSection(): void {
    if (confirm("Are you sure you want to submit the course director section?")) {
      const payload = {
        id: this.formData.id,
        courseDirectorSection: {
          opinion: this.formData.directorOpinion,
          signature: this.formData.directorSignature
        }
      };

      this.apiService.patch("final-exam-replacement", payload).subscribe({
        next: (response: any) => {
          console.log("Course director section submitted successfully", response);
          alert("Course director section submitted successfully!");
          this.router.navigate(["/dashboard"]);
        },
        error: (error: any) => {
          console.error("Error submitting course director section", error);
          alert("Error submitting section. Please try again.");
        }
      });
    }
  }

  submitDeanSection(): void {
    if (confirm("Are you sure you want to submit the dean section?")) {
      const payload = {
        id: this.formData.id,
        deanSection: {
          decision: this.formData.deanDecision,
          signature: this.formData.deanSignature
        }
      };

      this.apiService.patch("final-exam-replacement", payload).subscribe({
        next: (response: any) => {
          console.log("Dean section submitted successfully", response);
          alert("Dean section submitted successfully!");
          this.router.navigate(["/dashboard"]);
        },
        error: (error: any) => {
          console.error("Error submitting dean section", error);
          alert("Error submitting section. Please try again.");
        }
      });
    }
  }

  cancel(): void {
    if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      this.router.navigate(["/dashboard"]);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
