import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { AuthService } from "../../services/auth.service";
import { ApiService } from "../../services/api.service";
import { User } from "../../models/form.model";

type ServiceCategory = "Academic" | "Administrative" | "Medical" | "Financial";
type ServiceIcon =
  | "document"
  | "medical"
  | "refund"
  | "exit"
  | "login"
  | "calendar"
  | "flag"
  | "shuffle"
  | "list"
  | "plus";

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  processingTime: string;
  category: ServiceCategory;
  icon: ServiceIcon;
  englishName: string;
}

const SERVICE_METADATA: Record<
  string,
  { name: string; description: string; processingTime: string; category: ServiceCategory; icon: ServiceIcon }
> = {
  medicalexamination: {
    name: "Medical Examination",
    description: "Request your official medical examination",
    processingTime: "3-5 business days",
    category: "Medical",
    icon: "medical",
  },
  feerefund: {
    name: "Fee Refund",
    description: "Request a refund of paid tuition fees",
    processingTime: "3-5 business days",
    category: "Financial",
    icon: "refund",
  },
  studentappeal: {
    name: "Academic Appeal",
    description: "Submit an appeal regarding an academic decision",
    processingTime: "3-5 business days",
    category: "Academic",
    icon: "flag",
  },
  courseaddingdropping: {
    name: "Course Add / Drop",
    description: "Request to add or drop a course",
    processingTime: "3-5 business days",
    category: "Academic",
    icon: "list",
  },
  semesterwithdrawal: {
    name: "Semester Withdrawal",
    description: "Request to withdraw from the current semester",
    processingTime: "3-5 business days",
    category: "Administrative",
    icon: "exit",
  },
  universitywithdrawal: {
    name: "University Withdrawal",
    description: "Request to withdraw from the university",
    processingTime: "3-5 business days",
    category: "Administrative",
    icon: "exit",
  },
  semesterpostponement: {
    name: "Semester Postponement",
    description: "Request to postpone the current semester",
    processingTime: "3-5 business days",
    category: "Administrative",
    icon: "calendar",
  },
  midtermexamreplacement: {
    name: "Replacement Mid Exam",
    description: "Request a replacement for a missed midterm exam",
    processingTime: "3-5 business days",
    category: "Academic",
    icon: "calendar",
  },
  finalexamreplacement: {
    name: "Replacement Final Exam",
    description: "Request a replacement for a missed final exam",
    processingTime: "3-5 business days",
    category: "Academic",
    icon: "calendar",
  },
  majortransfer: {
    name: "Major Transfer",
    description: "Request to transfer to a different major",
    processingTime: "3-5 business days",
    category: "Academic",
    icon: "shuffle",
  },
  reentry: {
    name: "Re-Entry Request",
    description: "Request to re-enter the university after withdrawal",
    processingTime: "3-5 business days",
    category: "Administrative",
    icon: "login",
  },
  replacementexamdeclaration: {
    name: "Replacement Exam Declaration",
    description: "Declare a request for a replacement exam",
    processingTime: "3-5 business days",
    category: "Academic",
    icon: "document",
  },
};

const DEFAULT_METADATA = {
  description: "Request your official academic transcript",
  processingTime: "3-5 business days",
  category: "Academic" as ServiceCategory,
  icon: "document" as ServiceIcon,
};

@Component({
  selector: "app-create-request",
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: "./create-request.component.html",
  styleUrls: ["./create-request.component.scss"],
})
export class CreateRequestComponent implements OnInit {
  currentUser: User | null = null;
  showUserMenu = false;

  steps = ["Select Service", "Provide Details", "Review & Confirm", "Completed"];
  currentStep = 0;

  categories: ("All" | ServiceCategory)[] = ["All", "Academic", "Administrative", "Medical", "Financial"];
  selectedCategory: "All" | ServiceCategory = "All";
  searchTerm = "";

  services: ServiceOption[] = [];
  otherRequest: ServiceOption = {
    id: "other",
    name: "Other Request",
    description: "Submit a request that doesn't fit the categories above",
    processingTime: "5-7 business days",
    category: "Administrative",
    icon: "plus",
    englishName: "other",
  };

  selectedServiceId: string | null = null;

  programOptions = [
    "PhD Medical Sciences",
    "Master of Public Health",
    "PhD Health Informatics",
    "Master of Clinical Nutrition",
  ];
  academicYearOptions = ["2024/2025", "2025/2026", "2026/2027", "2027/2028"];
  priorityOptions = ["Low", "Normal", "Urgent"];
  institutionOptions = ["RIYADH ELM UNIVERSITY"];
  requiredDocuments = ["Student ID Copy", "Academic Record", "Supporting Documents"];
  readonly totalRequiredFields = 7;

  details = {
    program: "PhD Medical Sciences",
    academicYear: "2026/2027",
    priority: "Urgent",
    institution: "RIYADH ELM UNIVERSITY",
    notes: "",
  };

  attachedFiles: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    this.route.queryParamMap.subscribe((params) => {
      this.selectedServiceId = params.get("service");
    });

    this.apiService.getSequenceForms(1, 50).subscribe((data: any) => {
      const forms = (data.data || []) as any[];
      this.services = forms.map((form) => this.toServiceOption(form));
    });
  }

  get initials(): string {
    return (this.currentUser?.name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  private toServiceOption(form: any): ServiceOption {
    const englishName: string = form.englishName || "";
    const key = englishName.trim().toLowerCase().replace(/\s*form$/, "").replace(/\s+/g, "");
    const meta = SERVICE_METADATA[key];
    return {
      id: form.id.toString(),
      name: meta?.name ?? englishName,
      description: meta?.description ?? DEFAULT_METADATA.description,
      processingTime: meta?.processingTime ?? DEFAULT_METADATA.processingTime,
      category: meta?.category ?? DEFAULT_METADATA.category,
      icon: meta?.icon ?? DEFAULT_METADATA.icon,
      englishName,
    };
  }

  get allServices(): ServiceOption[] {
    return [...this.services, this.otherRequest];
  }

  get selectedService(): ServiceOption | undefined {
    return this.allServices.find((s) => s.id === this.selectedServiceId);
  }

  get completedRequiredFieldsCount(): number {
    const fields = [
      this.currentUser?.studentId != null,
      !!this.currentUser?.name,
      !!this.details.program,
      !!this.details.academicYear,
      !!this.details.priority,
      !!this.details.institution,
      !!this.details.notes.trim(),
    ];
    return fields.filter(Boolean).length;
  }

  get filteredServices(): ServiceOption[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.allServices.filter((service) => {
      const matchesCategory = this.selectedCategory === "All" || service.category === this.selectedCategory;
      const matchesSearch = !term || service.name.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }

  selectCategory(category: "All" | ServiceCategory): void {
    this.selectedCategory = category;
  }

  selectService(service: ServiceOption): void {
    this.selectedServiceId = service.id;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { service: service.id },
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }

  cancel(): void {
    this.router.navigate(["/dashboard"]);
  }

  goToStep(step: number): void {
    if (step < this.currentStep) {
      this.currentStep = step;
    }
  }

  continue(): void {
    if (!this.selectedServiceId) {
      return;
    }

    if (this.selectedServiceId === "other") {
      this.toastr.info("Other form types coming soon!");
      return;
    }

    this.currentStep = 1;
  }

  saveDraft(): void {
    this.toastr.success("Draft saved successfully!");
  }

  continueToReview(): void {
    this.toastr.info("Review & Confirm coming soon!");
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(input.files);
    }
    input.value = "";
  }

  removeFile(index: number): void {
    this.attachedFiles.splice(index, 1);
  }

  private addFiles(fileList: FileList): void {
    this.attachedFiles.push(...Array.from(fileList).map((file) => file.name));
  }
}
