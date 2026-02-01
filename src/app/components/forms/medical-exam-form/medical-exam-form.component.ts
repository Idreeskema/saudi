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
    formId: 0,
    studentId: "",
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
    physicianSignature: "",
    medicalDirectorSignature: "",
    officialStamp: "",
  };

  medicalExamId: number | null = null;
  isFormSubmitted: boolean = false;
  isLoading: boolean = false;

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
    this.isLoading = true;
    this.apiService.get(`medical-exams/${this.formId}`).subscribe({
      next: (response: any) => {
        // Handle wrapper response structure
        const data = response.data || response;
        
        console.log("Loaded Form Data:", data);

        this.medicalExamId = data.id;
        this.isFormSubmitted = data.isCompleted || false; // Note: Payload says isCompleted, checked against isFormSubmitted
        
        const pe = data.physicalExam || {};
        const lab = data.laboratory || {};
        
        this.formData = {
          formId: data.formId || this.formId || 0,
          studentId: data.studentId || data.id || "",
          studentName: data.studentName || "",
          idNumber: data.idNumber || "",
          gender: data.gender || "",
          medicineTaken: data.medicineTaken || "",
          allergy: data.allergy || "",
          diseases: data.diseases || "",
          
          // Section II - Physical Examination
          // Handle flattened structure from API response
          generalCondition: data.generalCondition || pe.generalCondition || "",
          bloodPressure: data.bloodPressure || pe.bloodPressure || "",
          pulse: data.pulse || pe.pulse || "",
          diseaseSign: data.diseaseSign || pe.diseaseSign || "",
          diseaseSignDetails: data.diseaseSignDetails || pe.diseaseSignDetails || "",
          previousTreatment: data.previousTreatment || pe.previousTreatment || "",
          previousTreatmentDetails: data.previousTreatmentDetails || pe.previousTreatmentDetails || "",

          // Section IV - X-ray
          xrayResult: data.xrayResult || data.xray?.xrayResult || "",
          xrayDetails: data.xrayDetails || data.xray?.xrayDetails || "",

          // Result Section
          applicantName: data.applicantName || data.result?.applicantName || "",
          fitStatus: data.fitStatus || data.result?.fitStatus || "",
          physicianName: data.physicianName || data.result?.physicianName || "",
          signatureDate: data.signatureDate || data.result?.signatureDate || "",
          hospitalName: data.hospitalName || data.result?.hospitalName || "",
          medicalDirector: data.medicalDirector || data.result?.medicalDirector || "",
          physicianSignature: data.physicianSignature || data.result?.physicianSignature || "",
          medicalDirectorSignature: data.medicalDirectorSignature || data.result?.medicalDirectorSignature || "",
          officialStamp: data.officialStamp || data.result?.officialStamp || "",
        };

        // Handle regional examinations mapping from flat object if available
        if (data.physicalExam) {
          const pe = data.physicalExam;
          this.regionalExaminations = this.regionalExaminations.map(exam => {
            switch(exam.id) {
              case "1": return { ...exam, status: pe.eyeResult || "", details: pe.eyeDetails || "" };
              case "2": return { ...exam, status: pe.entResult || "", details: pe.entDetails || "" };
              case "3": return { ...exam, status: pe.muscularResult || "", details: pe.muscularDetails || "" };
              case "4": return { ...exam, status: pe.cardioResult || "", details: pe.cardioDetails || "" };
              case "5": return { ...exam, status: pe.abdomenResult || "", details: pe.abdomenDetails || "" };
              case "6": return { ...exam, status: pe.neurologicalResult || "", details: pe.neurologicalDetails || "" };
              case "7": return { ...exam, status: pe.skinResult || "", details: pe.skinDetails || "" };
              default: return exam;
            }
          });
        }

        // Handle laboratory tests - mapping from flat object if available
        if (data.laboratory) {
          const lab = data.laboratory;
          this.labTests = this.labTests.map(test => {
            switch(test.id) {
              case "1": 
                return { ...test, status: lab.urinalysisResult || "", notes: lab.urinalysisNotes || "" };
              case "2": 
                return { ...test, status: lab.hepatitisBCResult || "", notes: lab.hepatitisBCNotes || "" };
              case "3": 
                return { ...test, status: lab.hivResult || "", notes: lab.hivNotes || "" };
              case "4": 
                return { ...test, status: lab.bloodTypeResult || "", notes: lab.bloodTypeNotes || "" };
              default: return test;
            }
          });
        }


        
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading form data:", error);
        this.isLoading = false;
      },
    });
  }

  // POST API - Create initial medical exam form with student data
  saveStudentSection(): void {
    if (!this.formData.studentName || !this.formData.idNumber) {
      this.toastr.error(
        "Please fill in required fields (Student Name and ID Number)",
      );
      return;
    }

    const payload = {
      formId: this.formId,
      studentId: this.formData.studentId || this.currentUser?.username || "",
      studentName: this.formData.studentName,
      idNumber: this.formData.idNumber,
      gender: this.formData.gender,
      medicineTaken: this.formData.medicineTaken,
      allergy: this.formData.allergy,
      diseases: this.formData.diseases,
    };

    this.isLoading = true;
    this.apiService.post<{ id: number; data?: { id: number } }>("medical-exams", payload).subscribe({
      next: (response: any) => {
        this.medicalExamId = response.data?.id || response.id;
        this.toastr.success("Student information saved successfully!");
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error saving student section:", error);
        this.toastr.error(
          "Failed to save student information. Please try again.",
        );
        this.isLoading = false;
      },
    });
  }

  // PATCH API - Update physical exam data
  savePhysicalExamSection(): void {
    if (!this.medicalExamId) {
      this.toastr.error("Please save student information first");
      return;
    }

    const eye = this.regionalExaminations.find(e => e.id === "1");
    const ent = this.regionalExaminations.find(e => e.id === "2");
    const muscular = this.regionalExaminations.find(e => e.id === "3");
    const cardio = this.regionalExaminations.find(e => e.id === "4");
    const abdomen = this.regionalExaminations.find(e => e.id === "5");
    const neurological = this.regionalExaminations.find(e => e.id === "6");
    const skin = this.regionalExaminations.find(e => e.id === "7");

    const payload = {
      id: this.medicalExamId,
      physicalExam: {
        generalCondition: this.formData.generalCondition,
        bloodPressure: this.formData.bloodPressure,
        pulse: this.formData.pulse,
        diseaseSign: this.formData.diseaseSign,
        diseaseSignDetails: this.formData.diseaseSignDetails,
        previousTreatment: this.formData.previousTreatment,
        previousTreatmentDetails: this.formData.previousTreatmentDetails,
        // Regional exams mapping to hardcoded keys
        eyeExam: "Eye examination",
        eyeResult: eye?.status,
        eyeDetails: eye?.details,
        entExam: "Examination of ears, nose & throat",
        entResult: ent?.status,
        entDetails: ent?.details,
        muscularExam: "Muscular/ skeletal",
        muscularResult: muscular?.status,
        muscularDetails: muscular?.details,
        cardioExam: "Examination of the cardio-respiratory system",
        cardioResult: cardio?.status,
        cardioDetails: cardio?.details,
        abdomenExam: "Examination of the abdomen",
        abdomenResult: abdomen?.status,
        abdomenDetails: abdomen?.details,
        neurologicalExam: "Neurological Examination",
        neurologicalResult: neurological?.status,
        neurologicalDetails: neurological?.details,
        skinExam: "Skin Examination",
        skinResult: skin?.status,
        skinDetails: skin?.details
      },
    };

    this.isLoading = true;
    this.apiService.patch("medical-exams", payload).subscribe({
      next: (response) => {
        this.toastr.success("Physical examination saved successfully!");
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error saving physical exam section:", error);
        this.toastr.error(
          "Failed to save physical examination. Please try again.",
        );
        this.isLoading = false;
      },
    });
  }

  // PATCH API - Update x-ray data
  saveXraySection(): void {
    if (!this.medicalExamId) {
      this.toastr.error("Please save student information first");
      return;
    }

    const payload = {
      id: this.medicalExamId,
      xray: {
        xrayResult: this.formData.xrayResult,
        xrayDetails: this.formData.xrayDetails,
      },
    };

    console.log("Saving X-Ray Payload:", payload);

    this.isLoading = true;
    this.apiService.patch("medical-exams", payload).subscribe({
      next: (response) => {
        this.toastr.success("X-ray examination saved successfully!");
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error saving x-ray section:", error);
        this.toastr.error(
          "Failed to save x-ray examination. Please try again.",
        );
        this.isLoading = false;
      },
    });
  }

  // PATCH API - Update lab test data
  saveLabSection(): void {
    if (!this.medicalExamId) {
      this.toastr.error("Please save student information first");
      return;
    }

    // Map lab test array to specific fields requested by user
    const urinalysis = this.labTests.find(t => t.id === "1");
    const hepatitis = this.labTests.find(t => t.id === "2");
    const hiv = this.labTests.find(t => t.id === "3");
    const bloodType = this.labTests.find(t => t.id === "4");

    const payload = {
      id: this.medicalExamId,
      laboratory: {
        urinalysis: "Urinalysis",
        urinalysisResult: urinalysis?.status || "",
        urinalysisNotes: urinalysis?.notes || "",
        hepatitisBC: "Hepatitis B&C",
        hepatitisBCResult: hepatitis?.status || "",
        hepatitisBCNotes: hepatitis?.notes || "",
        hiv: "HIV",
        hivResult: hiv?.status || "",
        hivNotes: hiv?.notes || "",
        bloodType: "Blood type",
        bloodTypeResult: bloodType?.status || "",
        bloodTypeNotes: bloodType?.notes || ""
      }
    };

    console.log("Saving Laboratory Payload:", payload);

    this.isLoading = true;
    this.apiService.patch("medical-exams", payload).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message || "Laboratory tests saved successfully!");
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error saving lab section:", error);
        this.toastr.error("Failed to save laboratory tests. Please try again.");
        this.isLoading = false;
      },
    });
  }

  // PATCH API - Update result data
  saveResultSection(): void {
    if (!this.medicalExamId) {
      this.toastr.error("Please save student information first");
      return;
    }

    const payload = {
      id: this.medicalExamId,
      result: {
        applicantName: this.formData.applicantName || this.formData.studentName,
        fitStatus: this.formData.fitStatus,
        physicianName: this.formData.physicianName,
        signatureDate: this.formData.signatureDate,
        hospitalName: this.formData.hospitalName,
        medicalDirector: this.formData.medicalDirector,
        physicianSignature: this.formData.physicianSignature,
        medicalDirectorSignature: this.formData.medicalDirectorSignature,
        officialStamp: this.formData.officialStamp,
      },
    };

    this.isLoading = true;
    this.apiService.patch("medical-exams", payload).subscribe({
      next: (response) => {
        this.toastr.success("Medical examination result saved successfully!");
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error saving result section:", error);
        this.toastr.error("Failed to save result. Please try again.");
        this.isLoading = false;
      },
    });
  }

  // Check if form is already submitted
  checkFormSubmissionStatus(): void {
    if (!this.formId) return;

    this.apiService.get(`medical-exams/${this.formId}`).subscribe({
      next: (data: any) => {
        this.isFormSubmitted = data.isSubmitted || false;
        if (this.isFormSubmitted) {
          this.toastr.info("This form has already been submitted.");
        }
      },
      error: (error) => {
        console.error("Error checking form status:", error);
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
        return ["physician", "admin", "medical-director", "medicalExamination"].includes(role);
      case "lab":
        return [
          "lab-technician",
          "physician",
          "admin",
          "medical-director",
          "medicalExamination",
        ].includes(role);
      case "xray":
        return [
          "xray",
          "physician",
          "admin",
          "medical-director",
          "medicalExamination",
        ].includes(role);
      case "result":
        return ["physician", "medical-director", "admin", "medicalExamination"].includes(role);
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
      case "xray":
        return role === "xray" || role === "admin";
      case "result":
        return (
          role === "physician" ||
          role === "medical-director" ||
          role === "admin" ||
          role === "medicalExamination"
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
      this.canEditSection("xray") ||
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
