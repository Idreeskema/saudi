import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/form.model';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  showUserMenu: boolean = false;

  stats = {
    total: 128,
    totalNote: '+12 this month',
    pending: 23,
    pendingNote: 'Awaiting review',
    approved: 94,
    approvedNote: 'Completed successfully',
    rejected: 7,
    rejectedNote: 'Requires attention'
  };

  profile = {
    studentId: '20240125',
    degree: 'Doctor of Philosophy',
    major: 'Medical Sciences',
    academicYear: '2025/2026',
    status: 'Active',
    activeCount: 2,
    completedCount: 12,
    pendingCount: 1
  };

  recentRequests = [
    { id: 'REQ-1001', type: 'Transcript Request', date: '01 Jun 2026', status: 'approved' },
    { id: 'REQ-1001', type: 'Transcript Request', date: '01 Jun 2026', status: 'approved' },
    { id: 'REQ-1001', type: 'Transcript Request', date: '01 Jun 2026', status: 'approved' },
    { id: 'REQ-1001', type: 'Transcript Request', date: '01 Jun 2026', status: 'approved' },
    { id: 'REQ-1001', type: 'Transcript Request', date: '01 Jun 2026', status: 'approved' }
  ];

  recentActivity = [
    {
      type: 'approved',
      title: 'Transcript Request Approved',
      description: 'Your transcript request has been successfully approved.',
      time: 'Today at 10:32 AM'
    },
    {
      type: 'pending',
      title: 'Medical Request Under Review',
      description: 'Medical Examination Scheduled',
      time: 'Yesterday at 12:07 PM'
    },
    {
      type: 'submitted',
      title: 'Recommendation Request Submitted',
      description: 'Recommendation Letter Submitted',
      time: 'May 25, 2026'
    },
    {
      type: 'approved',
      title: 'Fee Refund Approved',
      description: 'Fee Refund Request Approved',
      time: 'May 25, 2026'
    },
    {
      type: 'rejected',
      title: 'Missing Attachment Detected',
      description: 'Leave of Absence Request Received',
      time: 'May 23, 2026'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
  }

  get firstName(): string {
    return (this.currentUser?.name || '').split(' ')[0];
  }

  get initials(): string {
    return (this.currentUser?.name || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  navigateToAllRequests(): void {
    this.router.navigate(['/request-list']);
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
