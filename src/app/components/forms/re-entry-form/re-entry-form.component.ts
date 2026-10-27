import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { ApiService } from "../../../services/api.service";
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
    formId: 0,
    // Personal Information
    studentId: "",
    studentName: "",
    mobileNumber: "",
    email: "",
    gpa: 0,
    major: "",

    // Date of Enrollment - Checkboxes
    enrollmentFirstSemester: false,
    enrollmentSecondSemester: false,
    enrollmentAcademicYear: "",

    // Date of Enrollment - String format for backend
    dateOfEnrollmentSemester: "", // "Fall" or "Spring"
    dateOfEnrollmentAcademicYear: "",

    // Last Semester Enrolled - Checkboxes
    lastSemesterFirst: false,
    lastSemesterSecond: false,
    lastSemesterAcademicYear: "",

    // Last Semester Enrolled - String format for backend
    lastSemesterEnrolled: "", // "Fall" or "Spring"
    lastSemesterAcademicYearBackend: "",

    // Declaration
    declarationName: "",
    declarationNameEn: "",
    studentSignature: "",
    dateSigned: "",

    // Faculty Council Decision
    facultyName: "",
    sessionNo: "",
    decision: "",
    decisionDate: "",
    facultySessionNo: "",
    facultyDecision: false,
    facultyDate: "",

    // Dean Information
    deanName: "",
    deanSignature: "",
    deanDate: "",
    deanDecision: false,
  };

  semesters = [
    { value: "Fall", arabic: "الخريف" },
    { value: "Spring", arabic: "الربيع" },
    { value: "Summer", arabic: "الصيفي" },
  ];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }
    
    // Get formId from route parameters if editing an existing form
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.formData.formId = +id;
      this.loadFormData();
    }

    // Set default date to current date
    if (!this.formData.dateSigned) {
      this.formData.dateSigned = new Date().toISOString();
    }
  }

  loadFormData(): void {
    if (this.formData.formId > 0) {
      this.apiService.get(`re-entry-forms/${this.formData.formId}`).subscribe({
        next: (response: any) => {
          console.log("Form data loaded successfully", response);
          this.populateFormData(response);
        },
        error: (error) => {
          console.error("Error loading form data", error);
        },
      });
    }
  }

  populateFormData(data: any): void {
    const mainData = data.data || data;
    
    this.formData.studentId = mainData.studentId || "";
    this.formData.studentName = mainData.studentName || "";
    this.formData.mobileNumber = mainData.mobileNumber || "";
    this.formData.email = mainData.email || "";
    this.formData.gpa = mainData.gpa || 0;
    this.formData.major = mainData.major || "";
    
    // Convert semester strings to checkboxes for enrollment
    this.formData.dateOfEnrollmentSemester = mainData.dateOfEnrollmentSemester || "";
    this.formData.enrollmentFirstSemester = mainData.dateOfEnrollmentSemester === "Fall";
    this.formData.enrollmentSecondSemester = mainData.dateOfEnrollmentSemester === "Spring";
    this.formData.enrollmentAcademicYear = mainData.dateOfEnrollmentAcademicYear || "";
    this.formData.dateOfEnrollmentAcademicYear = mainData.dateOfEnrollmentAcademicYear || "";
    
    // Convert semester strings to checkboxes for last semester
    this.formData.lastSemesterEnrolled = mainData.lastSemesterEnrolled || "";
    this.formData.lastSemesterFirst = mainData.lastSemesterEnrolled === "Fall";
    this.formData.lastSemesterSecond = mainData.lastSemesterEnrolled === "Spring";
    this.formData.lastSemesterAcademicYear = mainData.lastSemesterAcademicYear || "";
    
    this.formData.studentSignature = mainData.studentSignature || "";
    this.formData.dateSigned = mainData.dateSigned || "";
    
    // Faculty Council Data
    if (mainData.facultyCouncilSection) {
      this.formData.facultySessionNo = mainData.facultyCouncilSection.sessionNo || "";
      this.formData.facultyDecision = mainData.facultyCouncilSection.decision || false;
      const fDate = mainData.facultyCouncilSection.date;
      this.formData.facultyDate = fDate ? fDate.split('T')[0] : "";
    }
    
    // Dean Data
    if (mainData.collegeDeanSection) {
      this.formData.deanName = mainData.collegeDeanSection.name || "";
      this.formData.deanSignature = mainData.collegeDeanSection.signature || "";
      const dDate = mainData.collegeDeanSection.date;
      this.formData.deanDate = dDate ? dDate.split('T')[0] : "";
      this.formData.deanDecision = mainData.collegeDeanSection.decision || false;
    }
  }

  canViewSection(section: string): boolean {
    if (!this.currentUser) return false;

    const role = this.currentUser.role;

    switch (section) {
      case "student":
        return true;
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
    return this.currentUser?.role === "student";
  }

  canProcessFaculty(): boolean {
    return this.currentUser?.role === "faculty" || this.currentUser?.role === "admin";
  }

  canProcessDean(): boolean {
    return this.currentUser?.role === "dean" || this.currentUser?.role === "admin";
  }

  // Helper method to convert enrollment checkboxes to semester string
  private getEnrollmentSemester(): string {
    if (this.formData.enrollmentFirstSemester) return "Fall";
    if (this.formData.enrollmentSecondSemester) return "Spring";
    return "";
  }

  // Helper method to convert last semester checkboxes to semester string
  private getLastSemester(): string {
    if (this.formData.lastSemesterFirst) return "Fall";
    if (this.formData.lastSemesterSecond) return "Spring";
    return "";
  }

  saveForm(): void {
    console.log("Form Data:", this.formData);
    alert("Form saved successfully!");
  }

  submitForm(): void {
    // Validate mandatory fields
    if (!this.formData.studentId || !this.formData.studentName || !this.formData.mobileNumber || 
        !this.formData.email || !this.formData.major || this.formData.gpa === null || this.formData.gpa === undefined) {
      alert("Please fill in all mandatory fields: Student ID, Student's Name, Mobile, E-mail, GPA, and Major.");
      return;
    }

    if (
      confirm(
        "Are you sure you want to submit this form? This action cannot be undone.",
      )
    ) {
      // Convert checkbox values to semester strings for backend
      this.formData.dateOfEnrollmentSemester = this.getEnrollmentSemester();
      this.formData.lastSemesterEnrolled = this.getLastSemester();

      const payload: any = {
        studentId: this.formData.studentId,
        studentName: this.formData.studentName,
        email: this.formData.email,
        mobileNumber: this.formData.mobileNumber,
        major: this.formData.major,
        gpa: this.formData.gpa,
        dateOfEnrollmentSemester: this.formData.dateOfEnrollmentSemester,
        dateOfEnrollmentAcademicYear: this.formData.enrollmentAcademicYear,
        lastSemesterEnrolled: this.formData.lastSemesterEnrolled,
        lastSemesterAcademicYear: this.formData.lastSemesterAcademicYear,
        studentSignature: this.formData.studentSignature,
        dateSigned: this.formData.dateSigned || new Date().toISOString(),
      };

      // Only include formId if editing an existing form
      if (this.formData.formId > 0) {
        payload.formId = this.formData.formId;
      }

      this.apiService.post("re-entry-forms", payload).subscribe({
        next: (response: any) => {
          console.log("Form submitted successfully", response);
          if (response.id) {
            this.formData.formId = response.id;
          }
          alert("Form submitted successfully!");
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          console.error("Error submitting form", error);
          alert("Error submitting form. Please try again.");
        },
      });
    }
  }

  submitFacultySection(): void {
    if (confirm("Are you sure you want to submit the faculty council decision?")) {
      const payload = {
        id: this.formData.formId,
        facultyCouncilSection: {
          sessionNo: this.formData.facultySessionNo,
          decision: this.formData.facultyDecision,
          date: this.formData.facultyDate || new Date().toISOString(),
        },
      };

      this.apiService.patch("re-entry-forms", payload).subscribe({
        next: (response) => {
          console.log("Faculty council decision submitted successfully", response);
          alert("Faculty council decision submitted successfully!");
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          console.error("Error submitting faculty council decision", error);
          alert("Error submitting section. Please try again.");
        },
      });
    }
  }

  submitDeanSection(): void {
    if (confirm("Are you sure you want to submit the dean section?")) {
      const payload = {
        id: this.formData.formId,
        collegeDeanSection: {
          name: this.formData.deanName,
          signature: this.formData.deanSignature,
          date: this.formData.deanDate || new Date().toISOString(),
          decision: this.formData.deanDecision,
        },
      };

      this.apiService.patch("re-entry-forms", payload).subscribe({
        next: (response) => {
          console.log("Dean section submitted successfully", response);
          alert("Dean section submitted successfully!");
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          console.error("Error submitting dean section", error);
          alert("Error submitting section. Please try again.");
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
