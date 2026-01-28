import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-letter-document',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './letter-document.component.html',
  styleUrls: ['./letter-document.component.scss']
})
export class LetterDocumentComponent implements OnInit {
  currentDate: string = '25/06/2025 م';
  studentName: string = 'احمد امين علي';
  studentNameEn: string = 'تجريبي';
  civilId: string = '2453629996';
  program: string = 'برنامج تجريبي';
  university: string = 'رياض العلم';
  lastDate: string = '5/12/1446';
  lastDateHijri: string = '01/06/2025م';
  deanName: string = 'سلطان علي الاشهري';
  refundAmount: string = '15,000';
processingDays: string = '7-10';
approvalDate: string = '25/06/2025';
approvalDateHijri: string = '28/12/1446';
contactNumber: string = '920000000';
  // Placeholder for QR code and signature
  qrCodeUrl: string = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIxMzAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=';
  signatureUrl: string = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMCA0MCBRIDYwIDEwLCAxMDAgNDAgVCAxODAgNDAiIHN0cm9rZT0iIzAwMDBlZSIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+PC9zdmc+';

  constructor() {}

  ngOnInit(): void {
    // Generate current date
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    this.currentDate = `${day}/${month}/${year} م`;
  }

  downloadPDF(): void {
    // Implement PDF download functionality
    console.log('Downloading PDF...');
    
    // For now, just print
    window.print();
  }
}