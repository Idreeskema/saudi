import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { ApiService } from "src/app/services/api.service";
import { ToastrService } from "ngx-toastr";
import { User } from "src/app/models/form.model";
import { SidebarComponent } from "src/app/components/sidebar/sidebar.component";

interface SequenceForm {
  id: string;
  arabicName: string;
  englishName: string;
  sequenceModelName: string;
}

@Component({
  selector: "app-sequence-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./sequence-form.component.html",
  styleUrls: ["./sequence-form.component.scss"],
})
export class SequenceFormComponent implements OnInit {
  currentUser: User | null = null;
  selectedYear: string = "All Years";
  searchText: string = "";
  currentPage: number = 1;
  sequenceModels: any[] = [];

  formData = {
    arabicName: "",
    englishName: "",
    sequenceModelName: "",
  };

  sequenceForms: SequenceForm[] = [
    {
      id: "1",
      arabicName: "طلب إجازة",
      englishName: "Leaves Request",
      sequenceModelName: "Student Leave",
    },
    {
      id: "2",
      arabicName: "طلب مناقشة",
      englishName: "Thesis Defense Request",
      sequenceModelName: "Thesis Defense Request",
    },
    {
      id: "3",
      arabicName: "طلب توصية",
      englishName: "Recommendation Letters Request",
      sequenceModelName: "Recommendation Letter",
    },
    {
      id: "4",
      arabicName: "طلب الشهادة مرجعية",
      englishName: "Reference Certificates Request",
      sequenceModelName: "Reference Certificate",
    },
    {
      id: "5",
      arabicName: "طلب اخلاء طرف - ماجستير",
      englishName: "Clearance form - Master",
      sequenceModelName: "Clearance Form - Master",
    },
    {
      id: "6",
      arabicName: "طلب منح الدرجة العلمية",
      englishName: "Degree Granting Request",
      sequenceModelName: "Thesis Defense Report",
    },
    {
      id: "7",
      arabicName: "طلب مقترح رسالة",
      englishName: "Thesis Defense Request",
      sequenceModelName: "Thesis Proposal Request",
    },
    {
      id: "8",
      arabicName: "طلب اخلاء طرف - صيدلة",
      englishName: "Clearance form Request - Pharmacy",
      sequenceModelName: "Clearance form Request - Pharmacy",
    },
    {
      id: "9",
      arabicName: "طلب اخلاء طرف - تقنية اختصاص سنوية",
      englishName: "Clearance form - SSC",
      sequenceModelName: "Clearance Form - SSC",
    },
    {
      id: "10",
      arabicName: "طلب تقييم دورة - صيدلة",
      englishName: "Rotation Evaluation - Pharmacy",
      sequenceModelName: "Rotation Evaluation - Pharmacy",
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
    this.loadSequenceModels();
    this.loadSequenceForms();
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

  loadSequenceForms(): void {
    this.apiService.getSequenceForms(this.currentPage, 50).subscribe({
      next: (response) => {
        this.sequenceForms = response.data || response;
      },
      error: (error) => {
        console.error("Error loading sequence forms:", error);
        // Keep hardcoded data as fallback
      },
    });
  }

  saveForm(): void {
    if (
      !this.formData.arabicName ||
      !this.formData.englishName ||
      !this.formData.sequenceModelName
    ) {
      this.toastr.warning("Please fill all required fields");
      return;
    }

    const data = {
      sequenceModelId: parseInt(this.formData.sequenceModelName, 10),
      arabicName: this.formData.arabicName,
      englishName: this.formData.englishName,
    };

    this.apiService.createSequenceForm(data).subscribe({
      next: (response) => {
        this.toastr.success("Sequence form saved successfully!");
        this.loadSequenceForms(); // Reload the list
        this.resetForm();
      },
      error: (error) => {
        console.error("Error saving sequence form:", error);
        this.toastr.error("Error saving sequence form. Please try again.");
      },
    });
  }

  cancel(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      arabicName: "",
      englishName: "",
      sequenceModelName: "",
    };
  }

  editForm(form: SequenceForm): void {
    this.formData = {
      arabicName: form.arabicName,
      englishName: form.englishName,
      sequenceModelName: form.sequenceModelName,
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
