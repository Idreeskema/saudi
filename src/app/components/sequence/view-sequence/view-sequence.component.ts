import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { User } from "src/app/models/form.model";
import { SidebarComponent } from "src/app/components/sidebar/sidebar.component";
import { ApiService } from "src/app/services/api.service";

interface SequenceRow {
  sequenceStatus: { text: string; class: string };
  nextSequence: { text: string; class: string };
  previousSequence: { text: string; class: string };
  optionsSequence: { text: string; class: string };
  programDirector: { text: string; class: string };
}

interface Sequence {
  title: string;
  rows: SequenceRow[];
}

// mirror backend enum
enum FormType {
  FeeRefund = "FeeRefund",
  MajorTransfer = "MajorTransfer",
  ReEntry = "ReEntry",
  ReplacementExamDeclaration = "ReplacementExamDeclaration",
  MidTermExamReplacement = "MidTermExamReplacement",
  FinalExamReplacement = "FinalExamReplacement",
  StudentAppeal = "StudentAppeal",
  SemesterWithdrawal = "SemesterWithdrawal",
  SemesterPostponement = "SemesterPostponement",
  UniversityWithdrawal = "UniversityWithdrawal",
  MedicalExamination = "MedicalExamination",
  CourseAddingDropping = "CourseAddingDropping",
}

@Component({
  selector: "app-view-sequence",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: "./view-sequence.component.html",
  styleUrls: ["./view-sequence.component.scss"],
})
export class ViewSequenceComponent implements OnInit {
  currentUser: User | null = null;
  selectedYear: string = "All Years";

  // ✅ keep hardcoded fallback
  sequences: Sequence[] = [
    {
      title: "Student Leave",
      rows: [
        {
          sequenceStatus: { text: "NEW", class: "badge-gray" },
          nextSequence: { text: "REQUEST APPROVED", class: "badge-green" },
          previousSequence: {
            text: "INCOMPLETE REQUIREMENTS",
            class: "badge-orange",
          },
          optionsSequence: { text: "REJECTED", class: "badge-red" },
          programDirector: { text: "No", class: "badge-red" },
        },
        {
          sequenceStatus: { text: "REQUEST APPROVED", class: "badge-gray" },
          nextSequence: { text: "NOTIFICATIONS", class: "badge-blue" },
          previousSequence: { text: "", class: "" },
          optionsSequence: { text: "", class: "" }, 
          programDirector: { text: "No", class: "badge-red" },
        },
      ],
    },
    {
      title: "Recommendation Letter",
      rows: [
        {
          sequenceStatus: { text: "NEW", class: "badge-gray" },
          nextSequence: { text: "REQUEST APPROVED", class: "badge-green" },
          previousSequence: {
            text: "INCOMPLETE REQUIREMENTS",
            class: "badge-orange",
          },
          optionsSequence: { text: "REJECTED", class: "badge-red" },
          programDirector: { text: "No", class: "badge-red" },
        },
        {
          sequenceStatus: { text: "REQUEST APPROVED", class: "badge-gray" },
          nextSequence: { text: "NOTIFICATIONS", class: "badge-blue" },
          previousSequence: { text: "", class: "" },
          optionsSequence: { text: "", class: "" },
          programDirector: { text: "No", class: "badge-red" },
        },
      ],
    },
    {
      title: "Reference Certificate",
      rows: [
        {
          sequenceStatus: { text: "NEW", class: "badge-gray" },
          nextSequence: {
            text: "PROGRAM DIRECTOR APPROVAL",
            class: "badge-green",
          },
          previousSequence: {
            text: "INCOMPLETE REQUIREMENTS",
            class: "badge-orange",
          },
          optionsSequence: { text: "REJECTED", class: "badge-red" },
          programDirector: { text: "No", class: "badge-red" },
        },
        {
          sequenceStatus: {
            text: "PROGRAM DIRECTOR APPROVAL",
            class: "badge-gray",
          },
          nextSequence: {
            text: "DEPARTMENT CHAIRMAN APPROVAL",
            class: "badge-green",
          },
          previousSequence: {
            text: "INCOMPLETE REQUIREMENTS",
            class: "badge-orange",
          },
          optionsSequence: { text: "REJECTED", class: "badge-red" },
           programDirector: { text: "No", class: "badge-red" },
        },
        {
          sequenceStatus: {
            text: "DEPARTMENT CHAIRMAN APPROVAL",
            class: "badge-gray",
          },
          nextSequence: {
            text: "POSTGRADUATE OFFICE APPROVAL",
            class: "badge-green",
          },
          previousSequence: {
            text: "INCOMPLETE REQUIREMENTS",
            class: "badge-orange",
          },
          optionsSequence: { text: "REJECTED", class: "badge-red" },
           programDirector: { text: "No", class: "badge-red" },
        },
        {
          sequenceStatus: {
            text: "POSTGRADUATE OFFICE APPROVAL",
            class: "badge-gray",
          },
          nextSequence: { text: "DEAN APPROVAL", class: "badge-green" },
          previousSequence: {
            text: "INCOMPLETE REQUIREMENTS",
            class: "badge-orange",
          },
          optionsSequence: { text: "REJECTED", class: "badge-red" },
           programDirector: { text: "No", class: "badge-red" },
        },
      ],
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService
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
    const formTypes = Object.values(FormType);

    const apiSequences: Sequence[] = [];

    formTypes.forEach((formType) => {
      this.apiService.getSequenceListForms(formType).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const mapped: Sequence = {
              title: formType,
              rows: response.data.map((item: any) => ({
                sequenceStatus: {
                  text: item.sequenceStatus,
                  class: `badge-${item.sequenceStatusColor?.toLowerCase() || "gray"}`,
                },
                nextSequence: {
                  text: item.nextSequence,
                  class: `badge-${item.nextSequenceColor?.toLowerCase() || "gray"}`,
                },
                previousSequence: {
                  text: item.previousSequence,
                  class: `badge-${item.previousSequenceColor?.toLowerCase() || "gray"}`,
                },
                optionsSequence: {
                  text: item.optionSequence,
                  class: `badge-${item.optionSequenceColor?.toLowerCase() || "gray"}`,
                },
                programDirector: { 
                  text: item.programDirectorApproval,
                  class: item.programDirectorApproval === "Yes" ? "badge-green" : "badge-red", },
              })),
            };
            apiSequences.push(mapped);
          }
        },
        error: (err) => {
          console.error(`Error fetching ${formType} sequences:`, err);
          // fallback: keep hardcoded sequences
        },
        complete: () => {
          // replace hardcoded with API only if we got something
          if (apiSequences.length > 0) {
            this.sequences = apiSequences;
          }
        },
      });
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
