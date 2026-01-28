import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { ApiService } from "src/app/services/api.service";
import { ToastrService } from "ngx-toastr";
import { User } from "src/app/models/form.model";
import { SidebarComponent } from "src/app/components/sidebar/sidebar.component";

interface Sequence {
  id: string;
  arabicName: string;
  englishName: string;
  isActive: boolean;
}

@Component({
  selector: "app-list-sequence",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./list-sequence.component.html",
  styleUrls: ["./list-sequence.component.scss"],
})
export class ListSequenceComponent implements OnInit {
  currentUser: User | null = null;
  selectedYear: string = "All Years";
  searchText: string = "";
  currentPage: number = 1;

  sequenceData = {
    id: "",
    arabicName: "",
    englishName: "",
    isActive: false,
  };

  sequences: Sequence[] = [];
  originalSequences: Sequence[] = [
    {
      id: "1",
      arabicName: "نموذج التقديم",
      englishName: "Application Form",
      isActive: false,
    },
    {
      id: "2",
      arabicName: "نموذج طلب إجازة",
      englishName: "Student Leave",
      isActive: true,
    },
    {
      id: "3",
      arabicName: "نموذج طلب توصية",
      englishName: "Recommendation Letter",
      isActive: true,
    },
    {
      id: "4",
      arabicName: "إجازة طالب 2",
      englishName: "Student Leave 2",
      isActive: false,
    },
    {
      id: "5",
      arabicName: "مدونة - PG-RT - ميداف",
      englishName: "Model PG-RT - ميداف",
      isActive: false,
    },
    { id: "6", arabicName: "تذرية", englishName: "تذرية", isActive: false },
    {
      id: "7",
      arabicName: "نموذج طلب إجازة 3",
      englishName: "نموذج طلب إجازة 3",
      isActive: false,
    },
    {
      id: "8",
      arabicName: "نموذج اخلاء طرف",
      englishName: "Clearance Form",
      isActive: false,
    },
    {
      id: "9",
      arabicName: "نموذج الشهادة مرجعية",
      englishName: "Reference Certificate",
      isActive: true,
    },
    {
      id: "10",
      arabicName: "تقرير لجنة مناقشة رسالة",
      englishName: "Thesis Defense Report",
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
    this.loadSequences();
  }

  loadSequences(): void {
    this.apiService.getSequences(this.currentPage, 50).subscribe({
      next: (response) => {
        this.sequences = response.data || response; // Assuming response has data array or is array
        this.originalSequences = [...this.sequences];
      },
      error: (error) => {
        console.error("Error loading sequences:", error);
        // Fallback to hardcoded data
        this.sequences = this.originalSequences;
      },
    });
  }

  get filteredSequences(): Sequence[] {
    if (!this.searchText.trim()) return this.sequences;
    return this.sequences.filter(
      (s) =>
        s.arabicName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        s.englishName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  saveSequence(): void {
    const isUpdate = !!this.sequenceData.id;

    // For create operations, don't send the id
    const payload = isUpdate
      ? this.sequenceData
      : {
          arabicName: this.sequenceData.arabicName,
          englishName: this.sequenceData.englishName,
          isActive: this.sequenceData.isActive,
        };

    const apiCall = isUpdate
      ? this.apiService.updateSequence(payload)
      : this.apiService.createSequence(payload);

    apiCall.subscribe({
      next: (response) => {
        this.toastr.success(
          `Sequence ${isUpdate ? "updated" : "created"} successfully!`
        );
        this.loadSequences(); // Reload the list
        this.sequenceData = {
          id: "",
          arabicName: "",
          englishName: "",
          isActive: false,
        }; // Reset form
      },
      error: (error) => {
        console.error(
          `Error ${isUpdate ? "updating" : "creating"} sequence:`,
          error
        );
        this.toastr.error(
          `Error ${
            isUpdate ? "updating" : "creating"
          } sequence. Please try again.`
        );
      },
    });
  }

  editSequence(sequence: Sequence): void {
    this.sequenceData = {
      id: sequence.id,
      arabicName: sequence.arabicName,
      englishName: sequence.englishName,
      isActive: sequence.isActive,
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
