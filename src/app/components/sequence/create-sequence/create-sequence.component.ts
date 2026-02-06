import { Component, OnInit, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { ApiService } from "src/app/services/api.service";
import { ToastrService } from "ngx-toastr";
import { User } from "src/app/models/form.model";
import { SidebarComponent } from "src/app/components/sidebar/sidebar.component";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Sequence {
  id: string;
  sequenceModel: string;
  sequenceStatus: string;
  sequenceStatusClass: string;
  nextSequence: string;
  nextSequenceClass: string;
  previousSequence: string;
  previousSequenceClass: string;
  optionSequence: string;
  optionSequenceClass: string;
  emailTemplate: string;
  isActive: boolean;
}

@Component({
  selector: "app-create-sequence",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./create-sequence.component.html",
  styleUrls: ["./create-sequence.component.scss"],
})
export class CreateSequenceComponent implements OnInit {
  currentUser: User | null = null;
  searchText: string = "";
  currentPage: number = 1;
  sequenceModels: any[] = [];
  sequenceStatuses: any[] = [];
  emailTemplates: any[] = [];
  sequences: Sequence[] = [
    {
      id: "1",
      sequenceModel: "Student Leave",
      sequenceStatus: "NEW",
      sequenceStatusClass: "badge-green",
      nextSequence: "REQUEST APPROVED",
      nextSequenceClass: "badge-green",
      previousSequence: "INCOMPLETE REQUIREMENTS",
      previousSequenceClass: "badge-orange",
      optionSequence: "REJECTED",
      optionSequenceClass: "badge-red",
      emailTemplate: "Leave Request",
      isActive: true,
    },
    {
      id: "2",
      sequenceModel: "Student Leave",
      sequenceStatus: "VIEWED",
      sequenceStatusClass: "badge-gray",
      nextSequence: "PROCESSING",
      nextSequenceClass: "badge-blue",
      previousSequence: "REJECTED",
      previousSequenceClass: "badge-red",
      optionSequence: "REQUEST APPROVED",
      optionSequenceClass: "badge-green",
      emailTemplate: "Leave Request",
      isActive: false,
    },
    {
      id: "3",
      sequenceModel: "Student Leave",
      sequenceStatus: "PROCESSING",
      sequenceStatusClass: "badge-blue",
      nextSequence: "REQUEST APPROVED",
      nextSequenceClass: "badge-green",
      previousSequence: "INCOMPLETE REQUIREMENTS",
      previousSequenceClass: "badge-orange",
      optionSequence: "REJECTED",
      optionSequenceClass: "badge-red",
      emailTemplate: "",
      isActive: false,
    },
    {
      id: "4",
      sequenceModel: "Student Leave",
      sequenceStatus: "REQUEST APPROVED",
      sequenceStatusClass: "badge-green",
      nextSequence: "NOTIFICATIONS",
      nextSequenceClass: "badge-blue",
      previousSequence: "",
      previousSequenceClass: "",
      optionSequence: "",
      optionSequenceClass: "",
      emailTemplate: "Leave Request",
      isActive: true,
    },
    {
      id: "5",
      sequenceModel: "Recommendation Letter",
      sequenceStatus: "NEW",
      sequenceStatusClass: "badge-green",
      nextSequence: "REQUEST APPROVED",
      nextSequenceClass: "badge-green",
      previousSequence: "INCOMPLETE REQUIREMENTS",
      previousSequenceClass: "badge-orange",
      optionSequence: "REJECTED",
      optionSequenceClass: "badge-red",
      emailTemplate: "Letter Request",
      isActive: true,
    },
    {
      id: "6",
      sequenceModel: "Recommendation Letter",
      sequenceStatus: "REQUEST APPROVED",
      sequenceStatusClass: "badge-green",
      nextSequence: "NOTIFICATIONS",
      nextSequenceClass: "badge-blue",
      previousSequence: "",
      previousSequenceClass: "",
      optionSequence: "",
      optionSequenceClass: "",
      emailTemplate: "Letter Request",
      isActive: true,
    },
    {
      id: "7",
      sequenceModel: "Student Leave 2",
      sequenceStatus: "NEW",
      sequenceStatusClass: "badge-green",
      nextSequence: "VIEWED",
      nextSequenceClass: "badge-gray",
      previousSequence: "",
      previousSequenceClass: "",
      optionSequence: "",
      optionSequenceClass: "",
      emailTemplate: "",
      isActive: true,
    },
    {
      id: "8",
      sequenceModel: "Student Leave 2",
      sequenceStatus: "VIEWED",
      sequenceStatusClass: "badge-gray",
      nextSequence: "PROCESSING",
      nextSequenceClass: "badge-blue",
      previousSequence: "NOTIFICATIONS",
      previousSequenceClass: "badge-blue",
      optionSequence: "",
      optionSequenceClass: "",
      emailTemplate: "",
      isActive: true,
    },
    {
      id: "9",
      sequenceModel: "Student Leave 2",
      sequenceStatus: "PROCESSING",
      sequenceStatusClass: "badge-blue",
      nextSequence: "",
      nextSequenceClass: "",
      previousSequence: "NOTIFICATIONS",
      previousSequenceClass: "badge-blue",
      optionSequence: "",
      optionSequenceClass: "",
      emailTemplate: "",
      isActive: true,
    },
    {
      id: "10",
      sequenceModel: "Model PG-RT - ميداف",
      sequenceStatus: "NEW",
      sequenceStatusClass: "badge-green",
      nextSequence: "PROGRAM DIRECTOR APPROVAL",
      nextSequenceClass: "badge-green",
      previousSequence: "",
      previousSequenceClass: "",
      optionSequence: "",
      optionSequenceClass: "",
      emailTemplate: "",
      isActive: true,
    },
  ];

  // Toggle Status Modal
  showToggleModal: boolean = false;
  selectedSeqForToggle: any = null;

  // Employee Multiselect
  isEmployeeDropdownOpen: boolean = false;
  selectedEmployees: Employee[] = [];

  availableEmployees: Employee[] = [
    {
      id: "1",
      name: "Accountant",
      email: "accountant@riyadh.edu.sa",
      role: "Accountant",
    },
    {
      id: "2",
      name: "Dr. Abdullah Salman BinAssfour",
      email: "abdullah.salman@riyadh.edu.sa",
      role: "Professor",
    },
    {
      id: "3",
      name: "Dr. Ahmed Hassan",
      email: "ahmed.hassan@riyadh.edu.sa",
      role: "Dean",
    },
    {
      id: "4",
      name: "Registration Officer",
      email: "registration@riyadh.edu.sa",
      role: "Registration",
    },
    {
      id: "5",
      name: "Program Director",
      email: "program.director@riyadh.edu.sa",
      role: "Director",
    },
    {
      id: "6",
      name: "Department Chairman",
      email: "chairman@riyadh.edu.sa",
      role: "Chairman",
    },
  ];

  sequenceData = {
    sequenceModel: "",
    sequenceStatus: "",
    nextSequenceId: "",
    previousSequenceId: "",
    optionSequenceId: "",
    emailTemplate: "",
    isActive: false,
    nextApprovalProgramDirector: false,
    employees: "",
    sendNotificationTo: "",
    emailTemplateId: "",
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }
    this.loadSequenceModels();
    this.loadSequenceStatuses();
    this.loadSequences();
  }

  onModelChange(): void {
    if (!this.sequenceData.sequenceModel) {
      this.emailTemplates = [];
      this.sequenceData.emailTemplate = "";
      return;
    }

    this.apiService.getEmailTemplatesByModelId(this.sequenceData.sequenceModel).subscribe({
      next: (response) => {
        const data = response.data || response;
        // Wrap in array if it's a single object, or use if it's already an array
        this.emailTemplates = Array.isArray(data) ? data : (data ? [data] : []);
        
        // Optionally auto-select if only one template exists
        if (this.emailTemplates.length === 1) {
          this.sequenceData.emailTemplate = this.emailTemplates[0].id.toString();
        }
      },
      error: (error) => {
        console.error("Error loading email templates:", error);
        this.emailTemplates = [];
        this.toastr.error("Failed to load email templates for this model");
      }
    });
  }

  loadSequenceModels(): void {
    this.apiService.getSequences(1, 50).subscribe({
      next: (response) => {
        this.sequenceModels = response.data || response;
      },
      error: (error) => {
        console.error("Error loading sequence models:", error);
      },
    });
  }

  loadSequenceStatuses(): void {
    this.apiService.getSequenceStatuses(1, 50).subscribe({
      next: (response) => {
        this.sequenceStatuses = response.data || response;
      },
      error: (error) => {
        console.error("Error loading sequence statuses:", error);
      },
    });
  }

  loadSequences(): void {
    this.apiService.getWorkflowSequences(this.currentPage, 50).subscribe({
      next: (response) => {
        const data = response.data || response;
        console.log("API Response data:", data); // Debug log
        this.sequences = data.map((item: any) => {
          console.log("Mapping item:", item); // Debug log
          // Helper function to get status name by ID
          const getStatusName = (id: string) => {
            const status = this.sequenceStatuses.find((s) => s.id === id);
            return status ? status.englishName : id;
          };

          const previousSequenceValue =
            item.previousSequence ||
            getStatusName(item.previousSequenceId) ||
            "";
          const optionSequenceValue =
            item.optionSequence || getStatusName(item.optionSequenceId) || "";

          const mappedItem = {
            id: item.id,
            sequenceModel: item.sequenceModel,
            sequenceStatus: item.sequenceStatus,
            sequenceStatusClass: this.getStatusClass(item.sequenceStatus),
            nextSequence:
              item.nextSequence || getStatusName(item.nextSequenceId) || "",
            nextSequenceClass: this.getNextSequenceClass(
              item.nextSequence || getStatusName(item.nextSequenceId) || ""
            ),
            previousSequence: previousSequenceValue,
            previousSequenceClass: this.getPreviousSequenceClass(
              previousSequenceValue
            ),
            optionSequence: optionSequenceValue,
            optionSequenceClass:
              this.getOptionSequenceClass(optionSequenceValue),
            emailTemplate: item.emailTemplate,
            isActive: item.isActive === true || item.isActive === "Active" || item.isActive === "Yes",
          };

          console.log(
            `Item ${item.id} - previousSequence: "${mappedItem.previousSequence}", optionSequence: "${mappedItem.optionSequence}"`
          );
          return mappedItem;
        });
        console.log("Mapped sequences:", this.sequences); // Debug log
      },
      error: (error) => {
        console.error("Error loading sequences:", error);
        // Keep hardcoded data as fallback
      },
    });
  }

  private getStatusClass(status: string): string {
    switch (status) {
      case "new":
        return "badge-green";
      case "request-approved":
        return "badge-green";
      case "processing":
        return "badge-blue";
      case "viewed":
        return "badge-gray";
      default:
        return "badge-gray";
    }
  }

  private getNextSequenceClass(next: string): string {
    switch (next) {
      case "request-approved":
        return "badge-green";
      case "notifications":
        return "badge-blue";
      case "processing":
        return "badge-blue";
      case "viewed":
        return "badge-gray";
      default:
        return "badge-gray";
    }
  }

  private getPreviousSequenceClass(previous: string): string {
    switch (previous) {
      case "incomplete-requirements":
        return "badge-orange";
      case "rejected":
        return "badge-red";
      case "notifications":
        return "badge-blue";
      default:
        return "";
    }
  }

  private getOptionSequenceClass(option: string): string {
    switch (option) {
      case "rejected":
        return "badge-red";
      case "request-approved":
        return "badge-green";
      default:
        return "";
    }
  }

  // Close dropdown when clicking outside
  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest(".multiselect-dropdown")) {
      this.isEmployeeDropdownOpen = false;
    }
  }

  toggleEmployeeDropdown(): void {
    this.isEmployeeDropdownOpen = !this.isEmployeeDropdownOpen;
  }

  toggleEmployee(employee: Employee): void {
    const index = this.selectedEmployees.findIndex((e) => e.id === employee.id);

    if (index > -1) {
      this.selectedEmployees.splice(index, 1);
    } else {
      this.selectedEmployees.push(employee);
    }

    this.updateEmployees();
  }

  removeEmployee(employee: Employee, event: Event): void {
    event.stopPropagation();
    this.selectedEmployees = this.selectedEmployees.filter(
      (e) => e.id !== employee.id
    );
    this.updateEmployees();
  }

  isEmployeeSelected(employee: Employee): boolean {
    return this.selectedEmployees.some((e) => e.id === employee.id);
  }

  updateEmployees(): void {
    // Employees are handled separately, no need to set sequenceData.employees
  }

  saveSequence(): void {
    if (!this.sequenceData.sequenceModel || !this.sequenceData.sequenceStatus) {
      this.toastr.warning("Please fill all required fields");
      return;
    }

    // Prepare data for API
    const data = {
      sequenceModelId: parseInt(this.sequenceData.sequenceModel, 10), // Assuming sequenceModel is ID
      sequenceStatusId: this.sequenceData.sequenceStatus,
      nextSequenceId: this.sequenceData.nextSequenceId,
      previousSequenceId: this.sequenceData.previousSequenceId,
      optionSequenceId: this.sequenceData.optionSequenceId,
      emailTemplateId: this.sequenceData.emailTemplate,
      isActive: this.sequenceData.isActive,
      requiresProgramDirectorApproval:
        this.sequenceData.nextApprovalProgramDirector,
      employees: this.selectedEmployees.map((emp) => ({ employeeId: emp.id })),
      notifications: this.sequenceData.sendNotificationTo
        ? this.sequenceData.sendNotificationTo
            .split(",")
            .map((email: string) => ({ email: email.trim() }))
        : [],
    };

    this.apiService.createWorkflowSequence(data).subscribe({
      next: (response) => {
        this.toastr.success("Sequence created successfully!");
        this.loadSequences(); // Reload the list
        this.resetForm();
      },
      error: (error) => {
        console.error("Error creating sequence:", error.error.message);
        this.toastr.error(error.error.message);
      },
    });
  }

  cancel(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.sequenceData = {
      sequenceModel: "",
      sequenceStatus: "",
      nextSequenceId: "",
      previousSequenceId: "",
      optionSequenceId: "",
      emailTemplate: "",
      isActive: false,
      nextApprovalProgramDirector: false,
      employees: "",
      sendNotificationTo: "",
      emailTemplateId: "",
    };
    this.selectedEmployees = [];
  }

  editSequence(seq: Sequence): void {
    // Assuming seq has the API structure, map to form
    this.sequenceData = {
      sequenceModel: seq.sequenceModel, // Assuming it's the ID or name
      sequenceStatus: seq.sequenceStatus,
      nextSequenceId: seq.nextSequence,
      previousSequenceId: seq.previousSequence,
      optionSequenceId: seq.optionSequence,
      emailTemplate: seq.emailTemplate,
      isActive: seq.isActive,
      nextApprovalProgramDirector: false,
      employees: "",
      sendNotificationTo: "",
      emailTemplateId: "",
    };
    // TODO: populate selectedEmployees from seq.employees if available
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    this.currentPage++;
  }

  openToggleModal(seq: any): void {
    this.selectedSeqForToggle = seq;
    this.showToggleModal = true;
  }

  closeToggleModal(): void {
    this.showToggleModal = false;
    this.selectedSeqForToggle = null;
  }

  confirmToggle(): void {
    if (!this.selectedSeqForToggle) return;

    const id = parseInt(this.selectedSeqForToggle.id, 10);
    // If it's currently active, we send false to deactivate it. 
    // If it's currently inactive, we send true to activate it.
    const newStatus = !this.selectedSeqForToggle.isActive;

    console.log("Sending Status Toggle Payload:", { id, isActive: newStatus });

    this.apiService.toggleSequenceStatus(id, newStatus).subscribe({
      next: (response) => {
        this.toastr.success(`Sequence ${newStatus ? 'activated' : 'deactivated'} successfully!`);
        this.loadSequences();
        this.closeToggleModal();
      },
      error: (error) => {
        console.error("Error toggling status:", error);
        this.toastr.error(error.error?.message || "Failed to update status");
        this.closeToggleModal();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  getRandomColor(): string {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
      "#F8C471",
      "#82E0AA",
      "#F1948A",
      "#85C1E9",
      "#D7BDE2",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
