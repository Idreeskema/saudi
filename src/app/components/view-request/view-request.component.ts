import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ApiService } from "../../services/api.service";
import { ToastrService } from "ngx-toastr";
import { User } from "../../models/form.model";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: "app-view-request",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: "./view-request.component.html",
  styleUrls: ["./view-request.component.scss"],
})
export class ViewRequestComponent implements OnInit {
  currentUser: User | null = null;
  requestId: string = "";
  statusData: any = null;
  requestTypeDisplay: string = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }

    this.requestId = this.route.snapshot.params["id"] || "49";
    this.loadRequestStatus();
  }

  loadRequestStatus(): void {
    const apiId = parseInt(this.requestId, 10);
    const requestType = this.route.snapshot.queryParams["type"] || "FeeRefund";

    // Map request types to API endpoints
    const requestTypeEndpointMap: { [key: string]: string } = {
      'FeeRefund': 'RefundForms',
      'ReEntry': 're-entry-forms',
      'MidTermExamReplacement': 'MidTermExamReplacementForm',
      'SemesterPostponement': 'semester-postponement-forms',
      'MajorTransfer': 'major-transfer-forms',
      'SemesterWithdrawal': 'semester-withdrawals',
      'ReplacementExamDeclaration': 'declaration-replacement-exam',
      'MedicalExamination': 'medical-exams',
      'CourseAddingDropping': 'adddrop',
      'StudentAppeal': 'student-appeals',
      'UniversityWithdrawal': 'university-withdrawals'
    };

    const endpoint = requestType || 'RefundForms';
    this.requestTypeDisplay = requestType.replace(/([A-Z])/g, ' $1').trim();

    if (apiId) {
      this.apiService.getFormStatus(endpoint, apiId).subscribe({
        next: (response) => {
          this.statusData = response.data || response;
        },
        error: (error) => {
          console.error("Error loading request status:", error);
          this.toastr.error("Error loading request status.");
        },
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
