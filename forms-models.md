# Form Models for Backend Team

Here is the list of all form models in the postgraduate-portal project, including their data structures. This document outlines the data requirements for each form to help with backend API development.

## 1. Course Add Drop Form

```typescript
formData = {
  // Personal Information
  studentName: string;
  mobile: string;
  studentId: string[]; // 9 elements
  gpa: string;
  major: string;
  academicYear1: string;
  academicYear2: string;
  academicYear3: string;
  academicYear4: string;
  level: string;

  // Semester
  semesterFirst: boolean;
  semesterSecond: boolean;
  semesterSummer: boolean;

  registerCredit: string;

  // Courses
  coursesToDrop: string;
  coursesToAdd: string;
  otherIssues: string;

  // Student Signature
  studentSignDateDay: string;
  studentSignDateMonth: string;
  studentSignDateYear: string;

  // Registration Department
  registrationComments: string;
  registrationName: string;
  registrationDateDay: string;
  registrationDateMonth: string;
  registrationDateYear: string;
  registrationDateYear2: string;
};
```

## 2. Final Exam Replacement Form

```typescript
formData = {
  // Student Information
  studentName: string;
  studentId: string[]; // 9 elements
  major: string;
  email: string;
  mobile: string;
  level: string;
  courseNotAttended: string;

  // Semester Details
  semesterFirst: boolean;
  semesterSecond: boolean;
  semesterSummer: boolean;
  academicYear1: string;
  academicYear2: string;
  academicYear3: string;

  // Reasons
  reason1: string;
  reason2: string;

  // Previous Absence
  previousAbsence: string;

  // Lecturer Information
  continuesAssessmentMark: string;
  missedMidterm: string;
  directorOpinion: string;

  // Board Decision
  approved: boolean;
  denied: boolean;
};
```

## 3. Major Transfer Form

```typescript
formData = {
  // Personal Information
  studentName: string;
  studentId: string[]; // 9 elements
  level: string;
  major: string;
  gpa: string;

  // Transfer Request
  currentMajor: string;
  proposedMajor: string;

  // Student and Guardian
  applicationDateDay: string;
  applicationDateMonth: string;
  applicationDateYear: string;
  mobile: string;

  // Authorized Person
  authorizedName: string;
  authorizedDateDay: string;
  authorizedDateMonth: string;
  authorizedDateYear: string;
  authorizedDateYear2: string;

  // Accounting Department
  hasPreviousFee: boolean;
  noPreviousFee: boolean;
  feeDifferencePaid: string;
  accountingName: string;
  accountingDateDay: string;
  accountingDateMonth: string;
  accountingDateYear: string;
  accountingDateYear2: string;

  // Registration Department
  transferApproved: boolean;
  transferDenied: boolean;
  denialReason: string;
  registrationName: string;
  registrationDateDay: string;
  registrationDateMonth: string;
  registrationDateYear: string;
};
```

## 4. Medical Exam Form

```typescript
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

formData = {
  // Section I - Student
  studentId: number;
  studentName: string;
  idNumber: string;
  gender: string;
  medicineTaken: string;
  allergy: string;
  diseases: string;

  // Section II - Physical Examination
  generalCondition: string;
  bloodPressure: string;
  pulse: string;
  diseaseSign: string;
  diseaseSignDetails: string;
  previousTreatment: string;
  previousTreatmentDetails: string;

  // Section IV - X-ray
  xrayResult: string;
  xrayDetails: string;

  // Result Section
  applicantName: string;
  fitStatus: string;
  physicianName: string;
  signatureDate: string;
  hospitalName: string;
  medicalDirector: string;
};

regionalExaminations: RegionalExamination[]; // Array of 7 predefined examinations
labTests: LabTest[]; // Array of lab tests
```

## 5. Midterm Replacement Form

```typescript
formData = {
  // Student Information
  studentName: string;
  studentId: string[]; // 9 elements
  major: string;
  level: string;
  courseNotAttended: string;
  mobile: string;
  email: string;

  // Exam Details
  semesterFirst: boolean;
  semesterSecond: boolean;
  semesterSummer: boolean;
  academicYear1: string;
  academicYear2: string;
  academicYear3: string;

  midtermFirst: boolean;
  midtermSecond: boolean;
  midtermSummer: boolean;

  // Reasons (6 lines)
  reasonLines: string[]; // 6 elements

  // Decision
  approvalDecision: boolean;
  denialDecision: boolean;
};
```

## 6. Re Entry Form

```typescript
formData = {
  // Personal Information
  studentName: string;
  mobile: string;
  email: string;
  gpa: string;
  major: string;

  // Date of Enrollment
  enrollmentFirstSemester: boolean;
  enrollmentSecondSemester: boolean;
  enrollmentYear1: string;
  enrollmentYear2: string;
  enrollmentYear3: string;
  enrollmentYear4: string;

  // Last Semester Enrolled
  lastSemesterFirst: boolean;
  lastSemesterSecond: boolean;
  lastSemesterYear1: string;
  lastSemesterYear2: string;
  lastSemesterYear3: string;
  lastSemesterYear4: string;

  // Declaration
  declarationName: string;
  declarationNameEn: string;

  // Faculty Council Decision
  facultyName: string;
  sessionNo: string;
  decisionDateDay: string;
  decisionDateMonth: string;
  decisionDateYear: string;
  decision: string;

  // Dean Information
  deanName: string;
  deanDateDay: string;
  deanDateMonth: string;
  deanDateYear: string;
  deanDateYear2: string;
};
```

## 7. Refund Form

```typescript
interface RefundForm {
  id: string;
  status: FormStatus;
  createdAt: Date;
  updatedAt: Date;

  // Student Section
  studentSection: {
    mobileNumber: number | null;
    studentId: string;
    name: string;
    nationality: string;
    major: string;
    level: string;
    refundAmount: number | null;
    refundReason: string;
    bankName: string;
    accountHolderName: string;
    relationship: string;
    ibanArabic: string;
    ibanEnglish: string;
    holderIdIqama: string;
    studentSignature: string;
    studentDate: string;
    completed: boolean;
  };

  // Registration Department Section
  registrationSection: {
    withdrawalType: "complete" | "partial" | "";
    semesterTiming: "before" | "after" | "";
    otherReason: string;
    departmentHead: string;
    signature: string;
    date: string;
    completed: boolean;
  };

  // Accounting Department - Payment Verification
  accountingVerificationSection: {
    paymentAmountNumeric: number | null;
    paymentAmountWords: string;
    accountantName: string;
    accountantSignature: string;
    accountantDate: string;
    chiefAccountant: string;
    chiefSignature: string;
    chiefDate: string;
    completed: boolean;
  };

  // Authorized Person Section
  authorizedSection: {
    decision: boolean | null;
    approvedAmountNumeric: number | null;
    approvedAmountWords: string;
    signature: string;
    date: string;
    completed: boolean;
  };

  // Accounting Department - Final Disbursement
  accountingDisbursementSection: {
    chequeNumber: string;
    issueDate: string;
    finalAmount: number | null;
    accountantSignature: string;
    date: string;
    completed: boolean;
  };
}

interface FormStatus {
  overall: "draft" | "in-progress" | "completed";
  studentCompleted: boolean;
  registrationCompleted: boolean;
  accountingVerificationCompleted: boolean;
  authorizedCompleted: boolean;
  accountingDisbursementCompleted: boolean;
}
```

## 8. Replacement Exam Declaration Form

```typescript
formData = {
  // Declaration Text
  studentName: string;
  courseName: string;
  semester: string;
  year1: string;
  year2: string;

  studentNameEn: string;
  courseNameEn: string;
  semesterEn: string;
  year3: string;

  // Student Information
  studentNameFinal: string;
  studentId: string[]; // 9 elements
  dateDay: string;
  dateMonth: string;
  dateYear: string;
  dateYear2: string;
  dateYear3: string;
};
```

## 9. Semester Postponement Form

```typescript
formData = {
  // Personal Information
  studentName: string;
  studentId: string[]; // 9 elements
  level: string;
  major: string;
  gpa: string;
  creditHours: string;

  // Semester Selection
  semesterFirst: boolean;
  semesterSecond: boolean;
  semesterSummer: boolean;

  // Student and Guardian Signatures
  applicationDateDay: string;
  applicationDateMonth: string;
  applicationDateYear: string;
  applicationDateYear2: string;
  mobile: string;

  // Accounting Department
  tuitionFee: string;
  accountingName: string;
  accountingDateDay: string;
  accountingDateMonth: string;
  accountingDateYear: string;
  accountingDateYear2: string;

  // Registration Department
  registrationName: string;
  registrationDateDay: string;
  registrationDateMonth: string;
  registrationDateYear: string;
  registrationDateYear2: string;
};
```

## 10. Semester Withdrawal Form

```typescript
formData = {
  // Personal Information
  studentName: string;
  studentId: string[]; // 9 elements
  level: string;
  major: string;
  gpa: string;
  creditHours: string;

  // Semester Selection
  semesterFirst: boolean;
  semesterSecond: boolean;
  semesterSummer: boolean;

  // Student and Guardian Signatures
  applicationDateDay: string;
  applicationDateMonth: string;
  applicationDateYear: string;
  applicationDateYear2: string;
  mobile: string;

  // Accounting Department
  tuitionFee: string;
  accountingName: string;
  accountingDateDay: string;
  accountingDateMonth: string;
  accountingDateYear: string;
  accountingDateYear2: string;

  // Registration Department
  registrationName: string;
  registrationDateDay: string;
  registrationDateMonth: string;
  registrationDateYear: string;
  registrationDateYear2: string;
};
```

## 11. Student Appeal Form

```typescript
formData = {
  // Student Information
  studentId: string[]; // 9 elements
  studentName: string;
  program: string;
  courseNameCode: string;
  level: string;
  continuousAssessmentMark: string;
  courseDirectorName: string;

  // Reason
  reason: string;

  // Signature
  dateDay: string;
  dateMonth: string;
  dateYear: string;
  studentSignature: string;
};
```

## 12. Withdrawal Form

```typescript
formData = {
  // Personal Information
  studentName: string;
  studentId: string;
  level: string;
  major: string;
  gpa: string;

  // Withdrawal Reasons (4 lines)
  reasonLines: string[]; // 4 elements

  // Student and Guardian Signatures
  applicationDateDay: string;
  applicationDateMonth: string;
  applicationDateYear: string;
  mobile: string;

  // Accounting Department
  tuitionFee: string;
  accountingName: string;
  accountingDateDay: string;
  accountingDateMonth: string;
  accountingDateYear: string;
  accountingDateYear2: string;

  // Registration Department
  registrationName: string;
  registrationDateDay: string;
  registrationDateMonth: string;
  registrationDateYear: string;
  registrationDateYear2: string;

  // File Receipt
  receiptDateDay: string;
  receiptDateMonth: string;
  receiptDateYear: string;
  receiptDateYear2: string;
};
```

## Additional Types

```typescript
type UserRole =
  | "student"
  | "faculty"
  | "dean"
  | "lecturer"
  | "board"
  | "registration"
  | "accounting"
  | "authorized"
  | "admin"
  | "physician"
  | "lab-technician"
  | "radiologist"
  | "medical-director";

interface User {
  username: string;
  role: UserRole;
  name: string;
}
```
