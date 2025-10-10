/**
 * PDF Export Utility
 * Professional PDF generation for scan results with branding
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { analytics } from '@/lib/analytics';

// Extend jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

interface Violation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  wcagTags?: string[];
  nodes?: Array<{
    html: string;
    target: string[];
  }>;
}

interface ScanData {
  id: string;
  url: string;
  violations: Violation[];
  passes: number;
  violations_count: number;
  incomplete: number;
  createdAt: string;
}

/**
 * Generate professional PDF report for scan results
 */
export const generatePDF = (scanData: ScanData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = 20;

  // Header with branding
  doc.setFillColor(99, 102, 241); // Indigo-500
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('AccessCheck', 14, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Accessibility Scan Report', 14, 30);

  yPosition = 50;

  // Scan metadata
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  doc.text(`URL: ${scanData.url}`, 14, yPosition);
  yPosition += 7;
  
  const date = new Date(scanData.createdAt).toLocaleString();
  doc.text(`Scan Date: ${date}`, 14, yPosition);
  yPosition += 7;
  
  doc.text(`Scan ID: ${scanData.id}`, 14, yPosition);
  yPosition += 15;

  // Summary section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 14, yPosition);
  yPosition += 10;

  // Summary table
  autoTable(doc, {
    startY: yPosition,
    head: [['Metric', 'Count']],
    body: [
      ['Violations', scanData.violations_count.toString()],
      ['Passes', scanData.passes.toString()],
      ['Incomplete', scanData.incomplete.toString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
    margin: { left: 14, right: 14 },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;

  // Violations by severity
  const violationsBySeverity = scanData.violations.reduce((acc, v) => {
    acc[v.impact] = (acc[v.impact] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Violations by Severity', 14, yPosition);
  yPosition += 10;

  autoTable(doc, {
    startY: yPosition,
    head: [['Severity', 'Count']],
    body: Object.entries(violationsBySeverity).map(([severity, count]) => [
      severity.charAt(0).toUpperCase() + severity.slice(1),
      count.toString(),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
    margin: { left: 14, right: 14 },
  });

  yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;

  // Add new page for detailed violations
  doc.addPage();
  yPosition = 20;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Violations', 14, yPosition);
  yPosition += 10;

  // Group violations by impact
  const criticalViolations = scanData.violations.filter((v) => v.impact === 'critical');
  const seriousViolations = scanData.violations.filter((v) => v.impact === 'serious');
  const moderateViolations = scanData.violations.filter((v) => v.impact === 'moderate');
  const minorViolations = scanData.violations.filter((v) => v.impact === 'minor');

  const renderViolationSection = (title: string, violations: Violation[], color: [number, number, number]) => {
    if (violations.length === 0) return;

    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(title, 14, yPosition);
    yPosition += 8;

    violations.forEach((violation, index) => {
      // Check if we need a new page for each violation
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${violation.id}`, 14, yPosition);
      yPosition += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      // Description
      const descLines = doc.splitTextToSize(violation.description, pageWidth - 28);
      doc.text(descLines, 14, yPosition);
      yPosition += descLines.length * 5;

      // Help text
      const helpLines = doc.splitTextToSize(`Fix: ${violation.help}`, pageWidth - 28);
      doc.text(helpLines, 14, yPosition);
      yPosition += helpLines.length * 5;

      // WCAG tags
      if (violation.wcagTags && violation.wcagTags.length > 0) {
        doc.text(`WCAG: ${violation.wcagTags.join(', ')}`, 14, yPosition);
        yPosition += 5;
      }

      // Affected elements count
      if (violation.nodes && violation.nodes.length > 0) {
        doc.text(`Affected Elements: ${violation.nodes.length}`, 14, yPosition);
        yPosition += 8;
      } else {
        yPosition += 8;
      }
    });

    yPosition += 5;
  };

  renderViolationSection('Critical Issues', criticalViolations, [220, 38, 38]);
  renderViolationSection('Serious Issues', seriousViolations, [234, 88, 12]);
  renderViolationSection('Moderate Issues', moderateViolations, [251, 191, 36]);
  renderViolationSection('Minor Issues', minorViolations, [59, 130, 246]);

  // Footer on last page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${totalPages} | Generated by AccessCheck | accesscheck.com`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Track export
  analytics.trackExport('pdf', scanData.id);

  // Save PDF
  const filename = `accesscheck-${scanData.url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.pdf`;
  doc.save(filename);
};
