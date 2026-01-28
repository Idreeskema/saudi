import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ApiService } from "../../services/api.service";
import { FormStorageService } from "../../services/form-storage.service";
import { RefundForm, User } from "../../models/form.model";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: "app-request-list",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: "./request-list.component.html",
  styleUrls: ["./request-list.component.scss"],
})
export class RequestListComponent implements OnInit {
  currentUser: User | null = null;
  forms: any[] = [];

  requestSummary = [
    { title: "All Requests", count: 0, type: "all" },
    { title: "Leave Request", count: 0, type: "leave" },
    { title: "Recommendation Letter", count: 0, type: "recommendation" },
    { title: "Reference Letter", count: 0, type: "reference" },
    { title: "Clearance Request", count: 0, type: "clearance" },
    { title: "Thesis Defense Request", count: 0, type: "thesis-defense" },
    { title: "Degree Granting Request", count: 0, type: "degree" },
    { title: "Thesis Proposal Request", count: 0, type: "thesis-proposal" },
  ];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private formStorageService: FormStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }

    this.loadForms();
  }

  loadForms(): void {
    // Get studentId from localStorage (saved from refund-form component)
    const studentId = localStorage.getItem("currentStudentId");
    const studentIdNumber = studentId ? parseInt(studentId, 10) : 3; // Default to 3 if not found

    // First try to load from API
    this.apiService.getStudentRequests(studentIdNumber).subscribe({
      next: (response) => {
        this.forms = response.data || response;
        this.requestSummary[0].count = this.forms.length;
        // Update other counts based on form types when implemented
      },
      error: (error) => {
        console.error("Error loading requests from API:", error);
        // Fallback to local storage
        this.forms = this.formStorageService.getAllForms();
        this.requestSummary[0].count = this.forms.length;
      },
    });
  }

  viewForm(formId: string): void {
    if (!formId) {
      formId = "13";
    }
    this.router.navigate(["/view-request", formId]);
  }

  deleteForm(formId: string, event: Event): void {
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this request?")) {
      this.formStorageService.deleteForm(formId);
      this.loadForms();
    }
  }

  printForm(formId: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(["/letter", formId], {
      queryParams: { print: true },
    });
  }

  getStatusClass(form: any): string {
    if (form.status === "Approved") return "status-completed";
    if (form.status === "Pending") return "status-progress";
    return "status-new";
  }

  goBack(): void {
    this.router.navigate(["/dashboard"]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
