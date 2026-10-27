export interface RefundForm {
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

export type UserRole =
  | "student"
  | "faculty"
  | "dean"
  | "lecturer"
  | "courseDirector"
  | "board"
  | "registration"
  | "accounting"
  | "authorized"
  | "admin"
  | "physician"
  | "lab-technician"
  | "radiologist"
  | "medical-director"
  | "medicalExamination"
  | "program-director"
  | "xray";

export interface FormStatus {
  overall: "draft" | "in-progress" | "completed";
  studentCompleted: boolean;
  registrationCompleted: boolean;
  accountingVerificationCompleted: boolean;
  authorizedCompleted: boolean;
  accountingDisbursementCompleted: boolean;
}

export interface User {
  username: string;
  role: UserRole;
  name: string;
  studentId?: number;
}
