import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { ApiService } from "../../../services/api.service";
import { User } from "../../../models/form.model";
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-course-add-drop-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./course-add-drop-form.component.html",
  styleUrls: ["./course-add-drop-form.component.scss"],
})
export class CourseAddDropFormComponent implements OnInit {
  currentUser: User | null = null;
  formId: number = 21; // Default, can be from route

  formData = {
    // Personal Information
    studentName: "",
    mobileNo: "",
    studentId: "",
    gpa: 0,
    major: "",
    academicYear: "",
    level: "",

    // Semester
    semester: "",

    registeredCredits: 0,

    // Courses
    coursesToDrop: [] as { courseCode: string; courseName: string }[],
    coursesToAdd: [] as { courseCode: string; courseName: string }[],
    otherIssues: "",

    // Student Signature
    studentSignature: "",
    studentDate: "",

    // Registration Department
    registrationComments: "",
    registrationName: "",
    registrarSignature: "",
    registrationDateDay: "",
    registrationDateMonth: "",
    registrationDateYear: "",
    registrationDateYear2: "",
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formId = +id;
      this.loadFormData();
    }
  }

  loadFormData(): void {
    if (this.formId > 0) {
      this.apiService.get(`adddrop/${this.formId}`).subscribe({
        next: (response: any) => {
          const data = response.data || response;
          if (data) {
            this.formData = {
              ...this.formData,
              ...data,
              // Map registration fields if they are in a sub-object
              registrationComments: data.registration?.comments || data.registrationComments || "",
              registrationName: data.registration?.registrarName || data.registrationName || "",
              registrarSignature: data.registration?.registrarSignature || data.registrarSignature || "",
            };
          }
        },
        error: (error) => {
          console.error("Error loading course add/drop data:", error);
        }
      });
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

  addCourseToDrop() {
    this.formData.coursesToDrop.push({ courseCode: '', courseName: '' });
  }

  removeCourseToDrop(index: number) {
    this.formData.coursesToDrop.splice(index, 1);
  }

  addCourseToAdd() {
    this.formData.coursesToAdd.push({ courseCode: '', courseName: '' });
  }

  removeCourseToAdd(index: number) {
    this.formData.coursesToAdd.splice(index, 1);
  }

  submitForm() {
    const role = this.currentUser?.role;

    if (role === 'student') {
      // Student submits the full form data
      const payload = {
        formId: this.formId,
        studentId: this.formData.studentId,
        studentName: this.formData.studentName,
        mobileNo: this.formData.mobileNo,
        major: this.formData.major,
        gpa: this.formData.gpa,
        academicYear: this.formData.academicYear,
        level: this.formData.level,
        semester: this.formData.semester,
        registeredCredits: this.formData.registeredCredits,
        coursesToDrop: this.formData.coursesToDrop,
        coursesToAdd: this.formData.coursesToAdd,
        otherIssues: this.formData.otherIssues,
        studentSignature: this.formData.studentSignature,
        studentDate: this.formData.studentDate,
      };

      this.apiService.post('adddrop', payload).subscribe({
        next: (response: any) => {
          this.toastr.success('Form submitted successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          this.toastr.error('Failed to submit form. Please try again.');
          console.error('Submit error:', error);
        }
      });
    } else if (role === 'registration' || role === 'admin') {
      // Registration department submits approval
      const payload = {
        id: this.formId,
        registration: {
          registrarName: this.formData.registrationName,
          registrarSignature: this.formData.registrarSignature,
          registrarDate: new Date().toISOString(),
        }
      };

      this.apiService.patch('adddrop', payload).subscribe({
        next: (response: any) => {
          this.toastr.success('Registration approval submitted successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          this.toastr.error('Failed to submit approval. Please try again.');
          console.error('Submit error:', error);
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  canEditAnySection(): boolean {
    return (
      this.canEditSection("student") || this.canEditSection("registration")
    );
  }

  canSubmitForm(): boolean {
    return (
      this.currentUser?.role === "student" ||
      this.currentUser?.role === "registration" ||
      this.currentUser?.role === "admin"
    );
  }

  saveForm(): void {
    this.toastr.success("Form saved successfully!");
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
}
