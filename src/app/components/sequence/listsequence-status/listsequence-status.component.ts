import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { ApiService } from "src/app/services/api.service";
import { ToastrService } from "ngx-toastr";
import { User } from "src/app/models/form.model";
import { SidebarComponent } from "src/app/components/sidebar/sidebar.component";

interface SequenceStatus {
  id: string;
  arabicName: string;
  englishName: string;
  arabicCaption: string;
  englishCaption: string;
  color: string;
  icon: string;
  isActive: boolean;
}

@Component({
  selector: "app-listsequence-status",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./listsequence-status.component.html",
  styleUrls: ["./listsequence-status.component.scss"],
})
export class ListsequenceStatusComponent implements OnInit {
  currentUser: User | null = null;
  selectedYear: string = "All Years";
  searchText: string = "";
  currentPage: number = 1;

  statusData = {
    arabicName: "",
    englishName: "",
    arabicCaption: "",
    englishCaption: "",
    color: "#000000",
    icon: "",
    isEndStatus: false,
    isActive: false,
  };

  statuses: SequenceStatus[] = [
    {
      id: "1",
      arabicName: "جديد",
      englishName: "New",
      arabicCaption: "جديد",
      englishCaption: "New",
      color: "#4CAF50",
      icon: "📄",
      isActive: true,
    },
    {
      id: "2",
      arabicName: "مقروءة",
      englishName: "Read",
      arabicCaption: "تم الاطلاع",
      englishCaption: "Viewed",
      color: "#9E9E9E",
      icon: "👁️",
      isActive: true,
    },
    {
      id: "3",
      arabicName: "إرسال الإشعار",
      englishName: "Send Notification",
      arabicCaption: "تم الإرسال",
      englishCaption: "Notifications",
      color: "#2196F3",
      icon: "🔔",
      isActive: true,
    },
    {
      id: "4",
      arabicName: "معالجة الطلب",
      englishName: "Request Processing",
      arabicCaption: "قيد المعالجة",
      englishCaption: "Processing",
      color: "#2196F3",
      icon: "⚙️",
      isActive: true,
    },
    {
      id: "5",
      arabicName: "موافقة",
      englishName: "Approve",
      arabicCaption: "تم قبول الطلب",
      englishCaption: "Request Approved",
      color: "#4CAF50",
      icon: "✅",
      isActive: true,
    },
    {
      id: "6",
      arabicName: "تحديد الوقت",
      englishName: "Determine the time",
      arabicCaption: "جاري تحديد الوقت",
      englishCaption: "Setting time",
      color: "#E91E63",
      icon: "📅",
      isActive: true,
    },
    {
      id: "7",
      arabicName: "موافقة",
      englishName: "Approve",
      arabicCaption: "موافقة رئيس القسم",
      englishCaption: "Department Chairman Approval",
      color: "#4CAF50",
      icon: "👤",
      isActive: true,
    },
    {
      id: "8",
      arabicName: "رفض",
      englishName: "Reject",
      arabicCaption: "تم الرفض",
      englishCaption: "Rejected",
      color: "#F44336",
      icon: "🔴",
      isActive: true,
    },
    {
      id: "9",
      arabicName: "موافقة",
      englishName: "Approve",
      arabicCaption: "موافقة مدير البرنامج",
      englishCaption: "Program Director Approval",
      color: "#4CAF50",
      icon: "👤",
      isActive: true,
    },
    {
      id: "10",
      arabicName: "موافقة",
      englishName: "Approve",
      arabicCaption: "موافقة مدير المستشفى (النموذجية)",
      englishCaption: "Hospital Director Approval (Namudhajiyah)",
      color: "#4CAF50",
      icon: "🏥",
      isActive: true,
    },
  ];

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
    this.loadSequenceStatuses();
  }

  loadSequenceStatuses(): void {
    this.apiService.getSequenceStatuses(this.currentPage, 50).subscribe({
      next: (response) => {
        this.statuses = response.data || response;
      },
      error: (error) => {
        console.error("Error loading sequence statuses:", error);
        // Keep hardcoded data as fallback
      },
    });
  }

  saveStatus(): void {
    if (!this.statusData.arabicName || !this.statusData.englishName) {
      this.toastr.warning("Please fill all required fields");
      return;
    }

    const data = {
      arabicName: this.statusData.arabicName,
      englishName: this.statusData.englishName,
      arabicCaption: this.statusData.arabicCaption,
      englishCaption: this.statusData.englishCaption,
      color: this.statusData.color,
      icon: this.statusData.icon,
      isActive: this.statusData.isActive,
    };

    this.apiService.createSequenceStatus(data).subscribe({
      next: (response) => {
        this.toastr.success("Status saved successfully!");
        this.loadSequenceStatuses(); // Reload the list
        this.resetForm();
      },
      error: (error) => {
        console.error("Error saving sequence status:", error);
        this.toastr.error("Error saving sequence status. Please try again.");
      },
    });
  }

  cancel(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.statusData = {
      arabicName: "",
      englishName: "",
      arabicCaption: "",
      englishCaption: "",
      color: "#000000",
      icon: "",
      isEndStatus: false,
      isActive: false,
    };
  }

  editStatus(status: SequenceStatus): void {
    this.statusData = {
      arabicName: status.arabicName,
      englishName: status.englishName,
      arabicCaption: status.arabicCaption,
      englishCaption: status.englishCaption,
      color: status.color,
      icon: status.icon,
      isEndStatus: false,
      isActive: status.isActive,
    };
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
