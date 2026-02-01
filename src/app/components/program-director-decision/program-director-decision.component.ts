import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ApiService } from "../../services/api.service";
import { ToastrService } from "ngx-toastr";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: "app-program-director-decision",
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: "./program-director-decision.component.html",
  styleUrls: ["./program-director-decision.component.scss"],
})
export class ProgramDirectorDecisionComponent implements OnInit {
  requestId: number = 0;
  formType: string = "";
  decision: boolean = true;
  comments: string = "";
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    public router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (!user || user.role !== "program-director") {
      this.router.navigate(["/login"]);
      return;
    }

    this.route.params.subscribe((params) => {
      this.requestId = +params["id"];
      this.formType = this.route.snapshot.queryParams["type"] || "";
    });
  }

  submitDecision(): void {
    if (!this.requestId || !this.formType) {
      this.toastr.error("Missing request information");
      return;
    }

    const payload = {
      requestId: this.requestId,
      formType: this.formType,
      decision: this.decision,
      comments: this.comments,
    };

    console.log("Submitting Program Director Decision:", payload);

    this.isLoading = true;
    this.apiService.post("program-director/decision", payload).subscribe({
      next: (response) => {
        this.toastr.success("Decision submitted successfully!");
        this.isLoading = false;
        this.router.navigate(["/pending-requests"]);
      },
      error: (error) => {
        console.error("Error submitting decision:", error);
        this.toastr.error("Failed to submit decision. Please try again.");
        this.isLoading = false;
      },
    });
  }
}
