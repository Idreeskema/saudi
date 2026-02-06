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
    { title: "All Requests", count: 0, type: "all" }
  ];
  studentIdNumber: any = 0;
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
    console.log(studentId);
    this.studentIdNumber = studentId; // Default to 3 if not found

    // First try to load from API
    this.apiService.getStudentRequests(this.studentIdNumber).subscribe({
      next: (response) => {
        this.forms = response.data || response;
        console.log(this.forms);
        // Calculate counts dynamically
        const typeCounts = new Map<string, number>();
        this.forms.forEach(form => {
          const type = form.requestType || 'Unknown';
          typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
        });

        // Rebuild summary array
        this.requestSummary = [
          { title: "All Requests", count: this.forms.length, type: "all" }
        ];

        // Add cards for each unique type found
        typeCounts.forEach((count, type) => {
          // Format basic camelCase or PascalCase to spaced words if needed
          const title = type.replace(/([A-Z])/g, ' $1').trim();
          this.requestSummary.push({
            title: title,
            count: count,
            type: type
          });
        });
      },
      error: (error) => {
        console.error("Error loading requests from API:", error);
        // Fallback to local storage
        this.forms = this.formStorageService.getAllForms();
        this.requestSummary[0].count = this.forms.length;
      },
    });
  }

  viewForm(formId: string | number, requestType?: string): void {
    if (!formId) return;
    
    this.router.navigate(["/view-request", formId], { 
      queryParams: { type: requestType || 'FeeRefund' } 
    });
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
