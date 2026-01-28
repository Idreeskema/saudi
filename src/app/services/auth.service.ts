import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User, UserRole } from "../models/form.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    const storedUser = localStorage.getItem("currentUser");
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, role: UserRole): boolean {
    // Hardcoded authentication for demo
    const users: { [key: string]: User } = {
      "student@riyadh.edu.sa": {
        username: "student@riyadh.edu.sa",
        role: "student",
        name: "Idrees Kema - Test",
      },
      "registration@riyadh.edu.sa": {
        username: "registration@riyadh.edu.sa",
        role: "registration",
        name: "Registration Officer",
      },
      "accounting@riyadh.edu.sa": {
        username: "accounting@riyadh.edu.sa",
        role: "accounting",
        name: "Chief Accountant",
      },
      "authorized@riyadh.edu.sa": {
        username: "authorized@riyadh.edu.sa",
        role: "authorized",
        name: "Authorized Person",
      },
      "admin@riyadh.edu.sa": {
        username: "admin@riyadh.edu.sa",
        role: "admin",
        name: "System Administrator",
      },
      "physician@riyadh.edu.sa": {
        username: "physician@riyadh.edu.sa",
        role: "physician",
        name: "Dr. Ahmed Al-Saud",
      },
      "lab-technician@riyadh.edu.sa": {
        username: "lab-technician@riyadh.edu.sa",
        role: "lab-technician",
        name: "Lab Technician Sara",
      },
      "radiologist@riyadh.edu.sa": {
        username: "radiologist@riyadh.edu.sa",
        role: "radiologist",
        name: "Dr. Fatima Al-Zahra",
      },
      "medical-director@riyadh.edu.sa": {
        username: "medical-director@riyadh.edu.sa",
        role: "medical-director",
        name: "Dr. Khalid Al-Rashid",
      },
    };

    const user = users[username];
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  getUserRole(): UserRole | null {
    return this.currentUserValue?.role || null;
  }
}
