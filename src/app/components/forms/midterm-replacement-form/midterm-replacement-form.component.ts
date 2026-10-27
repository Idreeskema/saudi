import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { ApiService } from "../../../services/api.service";
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
  declarationSubmitted: boolean = false;

  formData = {
    id:0,
    formId: 0,
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
    approvalDecision: false,
    denialDecision: false,
  };

  semesters = [
    { value: "First", arabic: "الأول" },
    { value: "Second", arabic: "الثاني" },
    { value: "Summer", arabic: "الصيفي" },
  ];
  id: any;
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
     this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      this.formData.formId = +this.id;
      this.loadFormData();
    }
    // Get formId from route parameters
    // Note: If you add route params for this component later, use them here.
    // For now, attempting to load if a default or stored ID exists might be useful if integrated into requests list.
    
    // Auto-fill student info from current user
    this.formData.studentName = this.currentUser?.name || "";
  }

  loadFormData(): void {
    if (this.formData.formId > 0) {
      this.apiService.get(`MidTermExamReplacementForm/${this.formData.formId}`).subscribe({
        next: (response: any) => {
          const data = response.data || response;
          if (data) {
            this.formData = {
              ...this.formData,
              ...data,
              // Map nested approval results to flat checkboxes
              approvalDecision: data.authorizedPersonApproval?.approvalDecision === true,
              denialDecision: data.authorizedPersonApproval?.approvalDecision === false,
              // Format date for HTML input with fallbacks
              dateSigned: (data.dateSigned || data.studentDate || data.createdAt || "").split('T')[0]
            };
            
            // Track if form was already processed to keep buttons visible during current interaction
            this.isInitiallyProcessed = data.authorizedPersonApproval?.approvalDecision !== undefined && data.authorizedPersonApproval?.approvalDecision !== null;
          }
        },
        error: (error) => {
          console.error("Error loading mid-term replacement data:", error);
        }
      });
    }
  }

  canViewSection(section: string): boolean {
    if (!this.currentUser) return false;
    const role = this.currentUser.role;
    if (role === "student") return section === "student";
    return true; // Staff/Admin can see everything
  }

  canEditSection(section: string): boolean {
    if (!this.currentUser) return false;

    const role = this.currentUser.role;

    switch (section) {
      case "student":
        return role === "student";
      case "authorized":
        // Authorized Person and Admin can edit this section
        return role === "authorized" || role === "admin";
      default:
        return false;
    }
  }

  canEditAnySection(): boolean {
    return this.canEditSection("student") || this.canEditSection("authorized");
  }

  canSubmitForm(): boolean {
    return this.currentUser?.role === "student" || this.currentUser?.role === "authorized" || this.currentUser?.role === "admin";
  }

  getAcademicYear(): string {
    const year1 = this.formData.academicYear.split("/")[0];
    const year2 = this.formData.academicYear.split("/")[1];
    if (year1 && year2) {
      return `20${year1}/20${year2}`;
    }
    return "";
  }

  saveForm(): void {
    console.log("Form Data:", this.formData);
    alert("Form saved successfully!");
  }

  submitForm(): void {
    this.declarationSubmitted = true;

    if (!this.formData.absenceReason.trim()) {
      alert("Reason for Absence is required.");
      return;
    }

    if (
      confirm(
        "Are you sure you want to submit this mid-term exam replacement request?"
      )
    ) {
      const payload = {
        formId: this.formData.formId,
        id: this.formData.id,
        studentId: this.formData.studentId,
        studentName: this.formData.studentName,
        major: this.formData.major,
        level: this.formData.level,
        email: this.formData.email,
        mobileNumber: this.formData.mobileNumber,
        courseName: this.formData.courseName,
        semesterRequested: this.formData.semesterRequested,
        academicYear: this.getAcademicYear(),
        absenceReason: this.formData.absenceReason,
        hasMissedOtherExams: this.formData.hasMissedOtherExams,
        studentSignature: this.formData.studentSignature,
        dateSigned: new Date().toISOString(),
      };

      this.apiService
        .post("MidTermExamReplacementForm", payload)
        .subscribe({
          next: (response) => {
            console.log("Request submitted successfully", response);
            alert("Mid-term exam replacement form submitted successfully!");
            this.router.navigate(["/dashboard"]);
          },
          error: (error) => {
            console.error("Error submitting form", error);
            alert("Error submitting form. Please try again.");
          },
        });
    }
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

  authorizeForm(approvalDecision: boolean): void {
    if (
      confirm(
        `Are you sure you want to ${approvalDecision ? "approve" : "reject"} this request?`
      )
    ) {
      const payload = {
        id: this.formData.id,
        authorizedPersonApproval: {
          approvalDecision: approvalDecision,
        },
      };

      this.apiService
        .patch("MidTermExamReplacementForm", payload)
        .subscribe({
          next: (response) => {
            console.log("Authorization submitted successfully", response);
            alert(
              `Mid-term exam replacement form ${approvalDecision ? "approved" : "rejected"} successfully!`
            );
            this.router.navigate(["/dashboard"]);
          },
          error: (error) => {
            console.error("Error authorizing form", error);
            alert("Error authorizing form. Please try again.");
          },
        });
    }
  }

  isInitiallyProcessed: boolean = false;

  isFormProcessed(): boolean {
    // Buttons should be visible if we haven't submitted a decision in THIS session
    // and if the server didn't already have a finalized decision.
    return this.isInitiallyProcessed;
  }

  onApprovalChange(type: 'approve' | 'deny'): void {
    if (type === 'approve' && this.formData.approvalDecision) {
      this.formData.denialDecision = false;
    } else if (type === 'deny' && this.formData.denialDecision) {
      this.formData.approvalDecision = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
