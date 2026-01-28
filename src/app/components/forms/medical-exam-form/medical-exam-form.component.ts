import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from "ngx-toastr";
import { User } from "../../../models/form.model";
import { SidebarComponent } from "../../sidebar/sidebar.component";

interface RegionalExamination {
  id: string;
  nameEn: string;
  nameAr: string;
  status: "normal" | "abnormal" | "";
  details: string;
}

interface LabTest {
  id: string;
  nameEn: string;
  nameAr: string;
  status: "normal" | "abnormal" | "";
  notes: string;
}

@Component({
  selector: "app-medical-exam-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./medical-exam-form.component.html",
  styleUrls: ["./medical-exam-form.component.scss"],
})
export class MedicalExamFormComponent implements OnInit {
  currentUser: User | null = null;
  formId: number = 0;

  formData = {
    // Section I - Student
    studentId: 0,
    studentName: "",
    idNumber: "",
    gender: "",
    medicineTaken: "",
    allergy: "",
    diseases: "",

    // Section II - Physical Examination
    generalCondition: "",
    bloodPressure: "",
    pulse: "",
    diseaseSign: "",
    diseaseSignDetails: "",
    previousTreatment: "",
    previousTreatmentDetails: "",

    // Section IV - X-ray
    xrayResult: "",
    xrayDetails: "",

    // Result Section
    applicantName: "",
    fitStatus: "",
    physicianName: "",
    signatureDate: "",
    hospitalName: "",
    medicalDirector: "",
  };

  regionalExaminations: RegionalExamination[] = [
    {
      id: "1",
      nameEn: "Eye examination (Right eye) & (Left eye)",
      nameAr: "فحص النظر (العين اليمنى) و (العين اليسرى)",
      status: "",
      details: "",
    },
    {
      id: "2",
      nameEn: "Examination of ears, nose & throat",
      nameAr: "فحص الأنف والأذن والحنجرة",
      status: "",
      details: "",
    },
    {
      id: "3",
      nameEn: "Muscular/ skeletal (for any physical disabilities)",
      nameAr: "فحص الهيكل العظمي والعضلات (لأي إعاقة جسدية)",
      status: "",
      details: "",
    },
    {
      id: "4",
      nameEn: "Examination of the cardio-respiratory system",
      nameAr: "فحص الجهاز الدوري والتنفسي",
      status: "",
      details: "",
    },
    {
      id: "5",
      nameEn: "Examination of the abdomen",
      nameAr: "فحص الباطنية",
      status: "",
      details: "",
    },
    {
      id: "6",
      nameEn: "Neurological Examination",
      nameAr: "فحص الجهاز العصبي",
      status: "",
      details: "",
    },
    {
      id: "7",
      nameEn: "Skin Examination",
      nameAr: "فحص حساسية الجلد",
      status: "",
      details: "",
    },
  ];

  labTests: LabTest[] = [
    {
      id: "1",
      nameEn: "Urinalysis",
      nameAr: "فحص البول",
      status: "",
      notes: "",
    },
    {
      id: "2",
      nameEn: "Hepatitis B&C",
      nameAr: "فحص التهاب الكبد الوبائي ب وج",
      status: "",
      notes: "",
    },
    {
      id: "3",
      nameEn: "HIV",
      nameAr: 'فحص متلازمة نقص المناعة المكتسبة "الإيدز"',
      status: "",
      notes: "",
    },
    {
      id: "4",
      nameEn: "Blood type",
      nameAr: "فصيلة الدم",
      status: "",
      notes: "",
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(["/login"]);
      return;
    }

    this.route.paramMap.subscribe((paramMap) => {
      this.formId = parseInt(paramMap.get("id") || "0");
      if (this.formId) {
        this.loadFormData();
      }
    });
  }

  loadFormData(): void {
    this.apiService.get(`medical-exams/${this.formId}`).subscribe({
      next: (data: any) => {
        this.formData = {
          studentId: data.studentId || data.id || 0,
          studentName: data.studentName || "",
          idNumber: data.idNumber || "",
          gender: data.gender || "",
          medicineTaken: data.medicineTaken || "",
          allergy: data.allergy || "",
          diseases: data.diseases || "",
          // Other sections remain empty or can be populated if data exists
          generalCondition:
            data.generalCondition || data.physicalExam?.generalCondition || "",
          bloodPressure:
            data.bloodPressure || data.physicalExam?.bloodPressure || "",
          pulse: data.pulse || data.physicalExam?.pulse || "",
          diseaseSign: data.diseaseSign || data.physicalExam?.diseaseSign || "",
          diseaseSignDetails:
            data.diseaseSignDetails ||
            data.physicalExam?.diseaseSignDetails ||
            "",
          previousTreatment:
            data.previousTreatment ||
            data.physicalExam?.previousTreatment ||
            "",
          previousTreatmentDetails:
            data.previousTreatmentDetails ||
            data.physicalExam?.previousTreatmentDetails ||
            "",
          xrayResult: data.xrayResult || data.xray?.xrayResult || "",
          xrayDetails: data.xrayDetails || data.xray?.xrayDetails || "",
          applicantName: data.applicantName || data.result?.applicantName || "",
          fitStatus: data.fitStatus || data.result?.fitStatus || "",
          physicianName: data.physicianName || data.result?.physicianName || "",
          signatureDate: data.signatureDate || data.result?.signatureDate || "",
          hospitalName: data.hospitalName || data.result?.hospitalName || "",
          medicalDirector:
            data.medicalDirector || data.result?.medicalDirector || "",
        };
        // Populate regionalExaminations and labTests if data exists
        if (data.regionalExaminations) {
          this.regionalExaminations = data.regionalExaminations;
        }
        if (data.labTests) {
          this.labTests = data.labTests;
        }
      },
      error: (error) => {
        console.error("Error loading form data:", error);
        this.toastr.error("Failed to load form data.");
      },
    });
  }

  canViewSection(section: string): boolean {
    if (!this.currentUser) return false;

    const role = this.currentUser.role;

    switch (section) {
      case "student":
        return true; // Everyone can see student info
      case "physician":
        return ["physician", "admin", "medical-director"].includes(role);
      case "lab":
        return [
          "lab-technician",
          "physician",
          "admin",
          "medical-director",
        ].includes(role);
      case "radiology":
        return [
          "radiologist",
          "physician",
          "admin",
          "medical-director",
        ].includes(role);
      case "result":
        return ["physician", "medical-director", "admin"].includes(role);
      default:
        return false;
    }
  }

  canEditSection(section: string): boolean {
    if (!this.currentUser) return false;

    const role = this.currentUser.role;

    switch (section) {
      case "student":
        return role === "student";
      case "physician":
        return role === "physician" || role === "admin";
      case "lab":
        return role === "lab-technician" || role === "admin";
      case "radiology":
        return role === "radiologist" || role === "admin";
      case "result":
        return (
          role === "physician" ||
          role === "medical-director" ||
          role === "admin"
        );
      default:
        return false;
    }
  }

  canEditAnySection(): boolean {
    return (
      this.canEditSection("student") ||
      this.canEditSection("physician") ||
      this.canEditSection("lab") ||
      this.canEditSection("radiology") ||
      this.canEditSection("result")
    );
  }

  canSubmitForm(): boolean {
    return (
      this.currentUser?.role === "medical-director" ||
      this.currentUser?.role === "admin"
    );
  }

  saveForm(): void {
    console.log("Form Data:", this.formData);
    console.log("Regional Examinations:", this.regionalExaminations);
    console.log("Lab Tests:", this.labTests);
    alert("Form saved successfully!");
  }

  submitForm(): void {
    if (
      confirm(
        "Are you sure you want to submit this form? This action cannot be undone.",
      )
    ) {
      const payload = {
        id: this.formData.studentId,
        physicalExam: {
          generalCondition: this.formData.generalCondition,
          bloodPressure: this.formData.bloodPressure,
          pulse: this.formData.pulse,
          diseaseSign: this.formData.diseaseSign,
          diseaseSignDetails: this.formData.diseaseSignDetails,
          previousTreatment: this.formData.previousTreatment,
          previousTreatmentDetails: this.formData.previousTreatmentDetails,
        },
        xray: {
          xrayResult: this.formData.xrayResult,
          xrayDetails: this.formData.xrayDetails,
        },
        result: {
          applicantName: this.formData.applicantName,
          fitStatus: this.formData.fitStatus,
          physicianName: this.formData.physicianName,
          signatureDate: this.formData.signatureDate,
          hospitalName: this.formData.hospitalName,
          medicalDirector: this.formData.medicalDirector,
        },
      };

      this.apiService.patch("medical-exams", payload).subscribe({
        next: (response) => {
          this.toastr.success(
            "Medical examination form submitted successfully!",
          );
          this.router.navigate(["/request-list"]);
        },
        error: (error) => {
          console.error("Error submitting form:", error);
          this.toastr.error("Failed to submit form. Please try again.");
        },
      });
    }
  }

  cancel(): void {
    if (
      confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost.",
      )
    ) {
      this.router.navigate(["/dashboard"]);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
