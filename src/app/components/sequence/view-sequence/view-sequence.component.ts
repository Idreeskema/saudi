import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { User } from "src/app/models/form.model";
import { SidebarComponent } from "src/app/components/sidebar/sidebar.component";

interface SequenceRow {
  sequenceStatus: { text: string; class: string };
  nextSequence: { text: string; class: string };
  previousSequence: { text: string; class: string };
  optionsSequence: { text: string; class: string };
}

interface Sequence {
  title: string;
  rows: SequenceRow[];
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
        },
        {
          sequenceStatus: { text: "REQUEST APPROVED", class: "badge-gray" },
          nextSequence: { text: "NOTIFICATIONS", class: "badge-blue" },
          previousSequence: { text: "", class: "" },
          optionsSequence: { text: "", class: "" },
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
        },
        {
          sequenceStatus: { text: "REQUEST APPROVED", class: "badge-gray" },
          nextSequence: { text: "NOTIFICATIONS", class: "badge-blue" },
          previousSequence: { text: "", class: "" },
          optionsSequence: { text: "", class: "" },
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
        },
      ],
    },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
