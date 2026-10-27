import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ApiService } from "../../services/api.service";
import { filter } from "rxjs/operators";

const FORM_CREATION_ROUTE_PREFIXES = [
  "/new-request",
  "/MedicalExamination/",
  "/FeeRefund/",
  "/StudentAppeal/",
  "/CourseAddingDropping/",
  "/SemesterWithdrawal/",
  "/UniversityWithdrawal/",
  "/SemesterPostponement/",
  "/MidTermExamReplacement/",
  "/FinalExamReplacement/",
  "/MajorTransfer/",
  "/ReEntry/",
  "/ReplacementExamDeclaration/",
];

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
  selectedServiceId: string | null = null;

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
    this.selectedServiceId = this.router.parseUrl(url).queryParams["service"] ?? null;

    if (url.includes("/dashboard")) {
      this.activeRoute = "dashboard";
    } else if (url.includes("/request-list")) {
      this.activeRoute = "request-list";
    } else if (FORM_CREATION_ROUTE_PREFIXES.some((prefix) => url.includes(prefix))) {
      this.activeRoute = "new-request";
      this.showNewRequestsMenu = true;
    } else if (url.includes("/form/")) {
      this.activeRoute = "new-request";
      this.showNewRequestsMenu = true;
    } else if (url.includes("/print-form/")) {
      this.activeRoute = "new-request";
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

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  toggleNewRequestsMenu(event: Event): void {
    event.preventDefault();
    this.showNewRequestsMenu = !this.showNewRequestsMenu;
    if (this.showNewRequestsMenu) {
      this.router.navigate(["/new-request"]);
    }
  }

  selectFormFromSidebar(id: string): void {
    this.router.navigate(["/new-request"], { queryParams: { service: id } });
  }

  selectOtherFromSidebar(): void {
    this.router.navigate(["/new-request"], { queryParams: { service: "other" } });
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
