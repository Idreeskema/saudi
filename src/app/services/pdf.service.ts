import { Injectable } from '@angular/core';
import { RefundForm } from '../models/form.model';

declare const jspdf: any;
declare const html2canvas: any;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  async generatePDF(form: RefundForm, elementId: string): Promise<void> {
    // This is a simple implementation
    // In production, you would use jsPDF with better formatting
    
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found');
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`refund-form-${form.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  }

  // Alternative: Generate PDF from data directly
  generatePDFFromData(form: RefundForm): void {
    const doc = new jspdf.jsPDF();
    let yPos = 20;
    
    // Header
    doc.setFontSize(18);
    doc.text('Refund Request Form', 105, yPos, { align: 'center' });
    yPos += 15;
    
    doc.setFontSize(12);
    doc.text(`Form ID: ${form.id}`, 20, yPos);
    yPos += 10;
    
    // Student Section
    doc.setFontSize(14);
    doc.text('Student Information', 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    const studentData = [
      ['Student ID', form.studentSection.studentId],
      ['Name', form.studentSection.name],
      ['Nationality', form.studentSection.nationality],
      ['Major', form.studentSection.major],
      ['Level', form.studentSection.level],
      ['Refund Amount', form.studentSection.refundAmount?.toString() || ''],
      ['Reason', form.studentSection.refundReason]
    ];
    
    studentData.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, 20, yPos);
      yPos += 6;
    });
    
    // Add more sections...
    yPos += 10;
    doc.setFontSize(14);
    doc.text('Registration Department', 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.text(`Withdrawal Type: ${form.registrationSection.withdrawalType}`, 20, yPos);
    yPos += 6;
    doc.text(`Semester Timing: ${form.registrationSection.semesterTiming}`, 20, yPos);
    yPos += 6;
    doc.text(`Department Head: ${form.registrationSection.departmentHead}`, 20, yPos);
    
    doc.save(`refund-form-${form.id}.pdf`);
  }
}
