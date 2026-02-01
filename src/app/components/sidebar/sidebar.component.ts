import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ApiService } from "../../services/api.service";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  activeRoute: string = "";
  showNewRequestsMenu: boolean = false;
  showSystemAdminMenu: boolean = false;
  isAdmin: boolean = false;
  isStudent: boolean = false;
  isFaculty: boolean = false;
  isDean: boolean = false;
  isAccounting: boolean = false;
  isRegistration: boolean = false;
  isPD: boolean = false;
  forms: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    this.isAdmin = role === "admin";
    this.isStudent = role === "student";
    this.isFaculty = role === "faculty";
    this.isDean = role === "dean";
    this.isAccounting = role === "accounting";
    this.isRegistration = role === "registration";
    this.isPD = role === "program-director";
    this.updateActiveRoute(this.router.url);

    this.apiService.getSequenceForms(1, 50).subscribe((data: any) => {
      this.forms = data.data;
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateActiveRoute(event.url);
      });
  }

  updateActiveRoute(url: string): void {
    if (url.includes("/dashboard")) {
      this.activeRoute = "dashboard";
    } else if (url.includes("/request-list")) {
      this.activeRoute = "request-list";
    } else if (url.includes("/form/")) {
      this.activeRoute = "form";
      this.showNewRequestsMenu = true;
    } else if (url.includes("/print-form/")) {
      this.activeRoute = "form";
    } else if (url.includes("/list-sequence")) {
      this.activeRoute = "list-sequence";
      this.showSystemAdminMenu = true;
    } else if (url.includes("/view-sequence")) {
      this.activeRoute = "view-sequence";
      this.showSystemAdminMenu = true;
    } else if (url.includes("/sequence-form")) {
      this.activeRoute = "sequence-form";
      this.showSystemAdminMenu = true;
    } else if (url.includes("/listsequence-status")) {
      this.activeRoute = "listsequence-status";
      this.showSystemAdminMenu = true;
    } else if (url.includes("/create-sequence")) {
      this.activeRoute = "create-sequence";
      this.showSystemAdminMenu = true;
    } else {
      this.activeRoute = "";
    }
  }

  toggleNewRequestsMenu(event: Event): void {
    event.preventDefault();
    this.showNewRequestsMenu = !this.showNewRequestsMenu;
  }

  createForm(id: string): void {
    const form = this.forms.find((f) => f.id.toString() === id);
    if (form) {
      switch (form.sequenceModelName.trim()) {
        case "MedicalExamination":
          this.router.navigate(["/MedicalExamination/" + id]);
          break;
        case "FeeRefund":
          this.router.navigate(["/FeeRefund/" + id]);
          break;
        case "StudentAppeal":
          this.router.navigate(["/StudentAppeal/" + id]);
          break;
        case "CourseAddingDropping":
          this.router.navigate(["/CourseAddingDropping/" + id]);
          break;
        case "SemesterWithdrawal":
          this.router.navigate(["/SemesterWithdrawal/" + id]);
          break;
        case "UniversityWithdrawal":
          this.router.navigate(["/UniversityWithdrawal/" + id]);
          break;
        case "SemesterPostponement":
          this.router.navigate(["/SemesterPostponement/" + id]);
          break;
        case "MidTermExamReplacement":
          this.router.navigate(["/MidTermExamReplacement/" + id]);
          break;
        case "FinalExamReplacement":
          this.router.navigate(["/FinalExamReplacement/" + id]);
          break;
        case "MajorTransfer":
          this.router.navigate(["/MajorTransfer/" + id]);
          break;
        case "ReEntry":
          this.router.navigate(["/ReEntry/" + id]);
          break;
        case "ReplacementExamDeclaration":
          this.router.navigate(["/ReplacementExamDeclaration/" + id]);
          break;
        default:
          this.router.navigate(["/form/" + id]);
          break;
      }
    } else {
      this.router.navigate(["/form/" + id]);
    }
  }

  createOtherForm(): void {
    alert("Other form types coming soon!");
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  navigateToAllRequests(): void {
    this.router.navigate(["/request-list"]);
  }

  navigateToPendingRequests(): void {
    this.router.navigate(["/pending-requests"]);
  }

  navigateToDashboard(): void {
    this.router.navigate(["/dashboard"]);
  }

  toggleSystemAdminMenu(event: Event): void {
    event.preventDefault();
    this.showSystemAdminMenu = !this.showSystemAdminMenu;
  }

  navigateToListSequence(): void {
    this.router.navigate(["/list-sequence"]);
  }

  createSequence(): void {
    alert("Create Sequence functionality coming soon!");
  }

  navigateToViewSequence(): void {
    this.router.navigate(["/view-sequence"]);
  }
  navigateTocreateSequence(): void {
    this.router.navigate(["/create-sequence"]);
  }
  navigateToSequenceForm(): void {
    this.router.navigate(["/sequence-form"]);
  }

  navigateToListSequenceStatus(): void {
    this.router.navigate(["/listsequence-status"]);
  }
}
