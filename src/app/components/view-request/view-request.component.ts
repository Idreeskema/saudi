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
    if (apiId) {
      this.apiService.getRefundFormStatus(apiId).subscribe({
        next: (response) => {
          this.statusData = response;
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
