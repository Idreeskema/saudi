import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormStorageService } from '../../services/form-storage.service';
import { RefundForm, User } from '../../models/form.model';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  forms: RefundForm[] = [];
  stats = {
    total: 12,
    inProgress: 7,
    rejected: 3,
    approved: 4
  };
  
  selectedYear: string = 'All Years';
  currentDate: Date = new Date();
  showNewRequestsMenu: boolean = false; 
  
  requestTypes = [
    { name: 'Leave Requests', count: 9, color: '#17c1e8', icon: '📋' },
    { name: 'Recommendation Letter', count: 0, color: '#cb0c9f', icon: '📝' },
    { name: 'Reference Letter', count: 2, color: '#a8b8d8', icon: '📄' },
    { name: 'Thesis Defense', count: 0, color: '#82d616', icon: '🎓' },
    { name: 'Degree Granting', count: 2, color: '#fb8c00', icon: '🎖️' },
    { name: 'Thesis Proposal', count: 1, color: '#344767', icon: '📚' }
  ];
  
  calendarEvents = [
    { date: 16, title: '9a Analysis of A...', type: 'defense' },
    { date: 17, title: '9a Evaluation o...', type: 'defense' }
  ];

  constructor(
    private authService: AuthService,
    private formStorageService: FormStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.forms = this.formStorageService.getAllForms();
    this.stats = this.formStorageService.getFormStats();
  }

  navigateToAllRequests(): void {
    this.router.navigate(['/request-list']);
  }

  createNewRequest(): void {
    const newForm = this.formStorageService.createEmptyForm();
    this.formStorageService.saveForm(newForm);
    this.router.navigate(['/form', newForm.id]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getMonthName(): string {
    return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  getDaysInMonth(): number[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }

  getWeekdays(): string[] {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  getFirstDayOfMonth(): number {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    return new Date(year, month, 1).getDay();
  }

  hasEvent(day: number): boolean {
    return this.calendarEvents.some(e => e.date === day);
  }

  getEventForDay(day: number) {
    return this.calendarEvents.find(e => e.date === day);
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
  }

  goToToday(): void {
    this.currentDate = new Date();
  }
  // Toggle submenu
toggleNewRequestsMenu(event: Event): void {
  event.preventDefault();
  this.showNewRequestsMenu = !this.showNewRequestsMenu;
}

// Create refund form
createRefundForm(): void {
  const newForm = this.formStorageService.createEmptyForm();
  this.router.navigate(['/form/1002-0001']);
}

// Placeholder for other forms
createOtherForm(): void {
  alert('Other form types coming soon!');
}
}
