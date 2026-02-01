import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ApiService } from "../../services/api.service";
import { User } from "../../models/form.model";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: "app-pending-requests",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: "./pending-requests.component.html",
  styleUrls: ["./pending-requests.component.scss"],
})
export class PendingRequestsComponent implements OnInit {
  currentUser: User | null = null;
  pendingRequests: any[] = [];
  loading: boolean = false;
  error: string = "";

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }

    this.loadPendingRequests();
  }

  loadPendingRequests(): void {
    this.loading = true;
    this.error = "";

    // Map user role to SequenceStatusEnum value
    const roleStatusMap: { [key: string]: string } = {
      "student": "StudentSection",
      "faculty": "FacultyCouncil",
      "dean": "CollegeDean",
      "registration": "RegistrationDepartment",
      "accounting": "AccountingDepartment",
      "authorized": "AuthorizedPerson",
      "courseDirector": "CourseDirector",
      "physician": "PhysicalExamination",
      "lab-technician": "Laboratory",
      "radiologist": "Radiology",
      "medical-director": "MedicalDirector",
      "medicalExamination": "MedicalExamination",
      "lecturer": "Lecturer",
      "program-director": "ProgramDirector",
      "facultyCouncil": "FacultyCouncil",
      "xray": "XRayExamination",
    };

    const statusEndpoint = roleStatusMap[this.currentUser?.role || ""];

    if (!statusEndpoint) {
      this.error = "You do not have permission to view pending requests";
      this.loading = false;
      return;
    }

    // Get requests pending approval based on user role
    this.apiService.get(`StudentRequest/status/${statusEndpoint}`).subscribe({
      next: (data: any) => {
        if (data.success && data.data) {
          this.pendingRequests = data.data;
        } else {
          this.pendingRequests = [];
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = "Failed to load pending requests";
        this.loading = false;
        console.error("Error loading requests:", error);
      }
    });
  }

  viewRequest(request: any): void {
    if (this.currentUser?.role === 'program-director') {
      this.router.navigate(['/program-director-decision', request.orderId], {
        queryParams: { type: request.requestType }
      });
      return;
    }
    // Navigate to the specific form component based on requestType
    const route = `/${request.requestType}/${request.orderId}`;
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
