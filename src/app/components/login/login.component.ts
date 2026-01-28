import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { UserRole } from "../../models/form.model";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  username: string = "";
  password: string = "";
  rememberMe: boolean = false;
  errorMessage: string = "";
  selectedAccount: string = "";

  // Demo credentials
  demoAccounts = [
    {
      email: "student@riyadh.edu.sa",
      role: "student" as UserRole,
      label: "Student",
    },
    {
      email: "registration@riyadh.edu.sa",
      role: "registration" as UserRole,
      label: "Registration",
    },
    {
      email: "accounting@riyadh.edu.sa",
      role: "accounting" as UserRole,
      label: "Accounting",
    },
    {
      email: "authorized@riyadh.edu.sa",
      role: "authorized" as UserRole,
      label: "Authorized Person",
    },
    { email: "admin@riyadh.edu.sa", role: "admin" as UserRole, label: "Admin" },
    {
      email: "physician@riyadh.edu.sa",
      role: "physician" as UserRole,
      label: "Physician",
    },
    {
      email: "lab-technician@riyadh.edu.sa",
      role: "lab-technician" as UserRole,
      label: "Lab Technician",
    },
    {
      email: "radiologist@riyadh.edu.sa",
      role: "radiologist" as UserRole,
      label: "Radiologist",
    },
    {
      email: "medical-director@riyadh.edu.sa",
      role: "medical-director" as UserRole,
      label: "Medical Director",
    },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = "";

    if (!this.username || !this.password) {
      this.errorMessage = "Please enter username and password";
      return;
    }

    const account = this.demoAccounts.find(
      (acc) => acc.email === this.username
    );

    if (account && this.password === "password123") {
      const success = this.authService.login(this.username, account.role);
      if (success) {
        this.router.navigate(["/dashboard"]);
      } else {
        this.errorMessage = "Login failed";
      }
    } else {
      this.errorMessage = "Invalid credentials";
    }
  }

  loginWithGmail(): void {
    alert("Gmail authentication not implemented in this demo");
  }

  quickLogin(): void {
    if (this.selectedAccount) {
      this.username = this.selectedAccount;
      this.password = "password123";
      this.onSubmit();
    }
  }
}
