import { jsPDF } from 'jspdf';

interface Violation {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{ html: string; target: string[] }>;
}

interface ScanResult {
  url: string;
  issuesFound: number;
  violations: Violation[];
  passes: number;
  timestamp: Date;
  risk?: {
    standards: string[];
    fines: {
      usUSD: number;
      euEUR: { min: number; max: number };
      note?: string;
    };
  };
}

export async function generatePDFReport(scanResult: ScanResult): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  let yPos = 20;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Professional color palette
  const colors = {
    brandBlue: [37, 99, 235] as [number, number, number],
    brandPurple: [109, 40, 217] as [number, number, number],
    darkGray: [17, 24, 39] as [number, number, number],
    mediumGray: [75, 85, 99] as [number, number, number],
    lightGray: [243, 244, 246] as [number, number, number],
    critical: [220, 38, 38] as [number, number, number],
    serious: [245, 158, 11] as [number, number, number],
    moderate: [251, 191, 36] as [number, number, number],
    minor: [59, 130, 246] as [number, number, number],
  };

  const checkPageBreak = (space: number = 20) => {
    if (yPos + space > pageHeight - 25) {
      doc.addPage();
      yPos = 20;
      addPageHeader();
      return true;
    }
    return false;
  };

  const addPageHeader = () => {
    doc.setFillColor(...colors.brandBlue);
    doc.rect(0, 0, pageWidth, 3, 'F');
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 3, pageWidth, 12, 'F');
    doc.setTextColor(...colors.brandBlue);
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text('AccessCheck', margin, 11);
    doc.setTextColor(...colors.mediumGray);
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'normal');
    doc.text('WCAG Compliance Report', pageWidth - margin, 11, { align: 'right' });
  };

  // === COVER PAGE ===
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top gradient bar
  for (let i = 0; i < 15; i++) {
    const alpha = i / 15;
    const r = colors.brandBlue[0] + (colors.brandPurple[0] - colors.brandBlue[0]) * alpha;
    const g = colors.brandBlue[1] + (colors.brandPurple[1] - colors.brandBlue[1]) * alpha;
    const b = colors.brandBlue[2] + (colors.brandPurple[2] - colors.brandBlue[2]) * alpha;
    doc.setFillColor(r, g, b);
    doc.rect(0, i * 0.8, pageWidth, 1, 'F');
  }

  // Logo
  doc.setTextColor(...colors.brandBlue);
  doc.setFontSize(42);
  doc.setFont('Helvetica', 'bold');
  doc.text('AccessCheck', pageWidth / 2, 50, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(...colors.mediumGray);
  doc.text('Web Accessibility Compliance Analysis', pageWidth / 2, 60, { align: 'center' });

  // Divider
  doc.setDrawColor(...colors.lightGray);
  doc.setLineWidth(0.5);
  doc.line(margin + 20, 70, pageWidth - margin - 20, 70);

  // Title
  doc.setTextColor(...colors.darkGray);
  doc.setFontSize(24);
  doc.setFont('Helvetica', 'bold');
  doc.text('WCAG 2.1 Compliance Report', pageWidth / 2, 90, { align: 'center' });

  // Website card
  const cardY = 105;
  doc.setFillColor(...colors.lightGray);
  doc.roundedRect(margin, cardY, pageWidth - 2 * margin, 35, 3, 3, 'F');
  doc.setTextColor(...colors.darkGray);
  doc.setFontSize(9);
  doc.setFont('Helvetica', 'bold');
  doc.text('ANALYZED WEBSITE', margin + 8, cardY + 10);
  doc.setFontSize(12);
  doc.setFont('Helvetica', 'normal');
  const urlLines = doc.splitTextToSize(scanResult.url, pageWidth - 2 * margin - 16);
  doc.text(urlLines, margin + 8, cardY + 18);
  doc.setFontSize(8);
  doc.setTextColor(...colors.mediumGray);
  const scanDate = new Date(scanResult.timestamp).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  doc.text(`Report Generated: ${scanDate}`, margin + 8, cardY + 30);

  // Stats
  const statsY = 155;
  const criticalCount = scanResult.violations.filter(v => v.impact === 'critical').length;
  const seriousCount = scanResult.violations.filter(v => v.impact === 'serious').length;
  const moderateCount = scanResult.violations.filter(v => v.impact === 'moderate').length;
  const minorCount = scanResult.violations.filter(v => v.impact === 'minor').length;

  // Total card
  doc.setFillColor(...colors.brandBlue);
  doc.roundedRect(margin, statsY, pageWidth - 2 * margin, 25, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('Helvetica', 'bold');
  doc.text('TOTAL ISSUES IDENTIFIED', pageWidth / 2, statsY + 10, { align: 'center' });
  doc.setFontSize(22);
  doc.text(scanResult.issuesFound.toString(), pageWidth / 2, statsY + 20, { align: 'center' });

  // Severity grid
  const gridY = statsY + 35;
  const colWidth = (pageWidth - 2 * margin - 15) / 4;
  [
    { label: 'Critical', count: criticalCount, color: colors.critical },
    { label: 'Serious', count: seriousCount, color: colors.serious },
    { label: 'Moderate', count: moderateCount, color: colors.moderate },
    { label: 'Minor', count: minorCount, color: colors.minor }
  ].forEach((sev, i) => {
    const x = margin + i * (colWidth + 5);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...sev.color);
    doc.setLineWidth(1.5);
    doc.roundedRect(x, gridY, colWidth, 25, 2, 2, 'FD');
    doc.setTextColor(...sev.color);
    doc.setFontSize(20);
    doc.setFont('Helvetica', 'bold');
    doc.text(sev.count.toString(), x + colWidth / 2, gridY + 12, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(...colors.mediumGray);
    doc.text(sev.label, x + colWidth / 2, gridY + 20, { align: 'center' });
  });

  doc.setFontSize(8);
  doc.setTextColor(...colors.mediumGray);
  doc.setFont('Helvetica', 'italic');
  doc.text('Powered by axe-core™ — Industry Standard for Accessibility Testing', pageWidth / 2, pageHeight - 20, { align: 'center' });

  // === PAGE 2: EXECUTIVE SUMMARY ===
  doc.addPage();
  addPageHeader();
  yPos = 25;

  doc.setTextColor(...colors.darkGray);
  doc.setFontSize(20);
  doc.setFont('Helvetica', 'bold');
  doc.text('Executive Summary', margin, yPos);
  yPos += 12;

  // Summary grid
  const summaryCards = [
    { label: 'Total Issues', value: scanResult.issuesFound.toString() },
    { label: 'Critical', value: criticalCount.toString() },
    { label: 'Serious', value: seriousCount.toString() },
    { label: 'Moderate', value: moderateCount.toString() },
    { label: 'Minor', value: minorCount.toString() },
    { label: 'Tests Passed', value: scanResult.passes.toString() }
  ];

  const cardGridW = (pageWidth - 2 * margin - 20) / 3;
  summaryCards.forEach((card, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = margin + col * (cardGridW + 10);
    const y = yPos + row * 30;

    doc.setFillColor(...colors.lightGray);
    doc.roundedRect(x, y, cardGridW, 22, 2, 2, 'F');
    doc.setTextColor(...colors.darkGray);
    doc.setFontSize(18);
    doc.setFont('Helvetica', 'bold');
    doc.text(card.value, x + cardGridW / 2, y + 11, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(...colors.mediumGray);
    doc.text(card.label, x + cardGridW / 2, y + 18, { align: 'center' });
  });

  yPos += 70;

  // Severity distribution
  checkPageBreak(50);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 45, 3, 3, 'F');
  doc.setTextColor(...colors.darkGray);
  doc.setFontSize(11);
  doc.setFont('Helvetica', 'bold');
  doc.text('Severity Distribution', margin + 5, yPos + 8);
  yPos += 15;

  const total = scanResult.issuesFound || 1;
  [
    { label: 'Critical', count: criticalCount, color: colors.critical },
    { label: 'Serious', count: seriousCount, color: colors.serious },
    { label: 'Moderate', count: moderateCount, color: colors.moderate },
    { label: 'Minor', count: minorCount, color: colors.minor }
  ].forEach((sev) => {
    if (sev.count > 0) {
      const pct = ((sev.count / total) * 100).toFixed(1);
      const barW = (sev.count / total) * 110;

      doc.setFontSize(9);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(...colors.darkGray);
      doc.text(sev.label, margin + 5, yPos);
      doc.setFont('Helvetica', 'normal');
      doc.text(`${sev.count} (${pct}%)`, margin + 30, yPos);
      
      doc.setFillColor(229, 231, 235);
      doc.roundedRect(margin + 65, yPos - 3, 110, 5, 1, 1, 'F');
      doc.setFillColor(...sev.color);
      doc.roundedRect(margin + 65, yPos - 3, barW, 5, 1, 1, 'F');
      
      yPos += 7;
    }
  });

  yPos += 15;

  // Risk assessment
  if (scanResult.risk) {
    checkPageBreak(60);
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 60, 3, 3, 'F');
    doc.setFillColor(...colors.critical);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 7, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'bold');
    doc.text('Compliance Risk Assessment', margin + 5, yPos + 5);
    yPos += 13;

    doc.setTextColor(...colors.darkGray);
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'bold');
    doc.text('Standards at Risk:', margin + 5, yPos);
    yPos += 5;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7);
    scanResult.risk.standards.forEach(std => {
      doc.text(`• ${std}`, margin + 5, yPos);
      yPos += 4;
    });
    yPos += 3;

    doc.setFontSize(8);
    doc.setFont('Helvetica', 'bold');
    doc.text('Potential Financial Impact:', margin + 5, yPos);
    yPos += 5;

    doc.setFontSize(7);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(185, 28, 28);
    doc.text(`• US (ADA): Up to $${scanResult.risk.fines.usUSD.toLocaleString()} USD`, margin + 5, yPos);
    yPos += 4;
    doc.text(`• EU: €${scanResult.risk.fines.euEUR.min.toLocaleString()} - €${scanResult.risk.fines.euEUR.max.toLocaleString()} EUR`, margin + 5, yPos);
    yPos += 6;

    doc.setTextColor(...colors.mediumGray);
    doc.setFontSize(6);
    doc.setFont('Helvetica', 'italic');
    const noteLines = doc.splitTextToSize(scanResult.risk.fines.note || '', pageWidth - 2 * margin - 10);
    doc.text(noteLines, margin + 5, yPos);
    yPos += noteLines.length * 3;
  }

  // === DETAILED ISSUES ===
  doc.addPage();
  addPageHeader();
  yPos = 25;

  doc.setTextColor(...colors.darkGray);
  doc.setFontSize(20);
  doc.setFont('Helvetica', 'bold');
  doc.text('Detailed Issue Report', margin, yPos);
  yPos += 15;

  scanResult.violations.forEach((violation, index) => {
    checkPageBreak(50);

    const impactColor = {
      critical: colors.critical,
      serious: colors.serious,
      moderate: colors.moderate,
      minor: colors.minor,
    }[violation.impact] || colors.mediumGray;

    // Issue card
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 42, 2, 2, 'FD');

    // Header bar
    doc.setFillColor(...impactColor);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 6, 2, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('Helvetica', 'bold');
    doc.text(`Issue #${index + 1}`, margin + 3, yPos + 4.5);

    // Impact badge
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - margin - 22, yPos + 1, 18, 4, 1, 1, 'F');
    doc.setTextColor(...impactColor);
    doc.setFontSize(6);
    doc.text(violation.impact.toUpperCase(), pageWidth - margin - 21, yPos + 4);

    yPos += 10;

    // Title
    doc.setTextColor(...colors.darkGray);
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'bold');
    const titleLines = doc.splitTextToSize(violation.help, pageWidth - 2 * margin - 8);
    doc.text(titleLines, margin + 4, yPos);
    yPos += titleLines.length * 4 + 2;

    // Description
    doc.setFontSize(7);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(...colors.mediumGray);
    const descLines = doc.splitTextToSize(violation.description, pageWidth - 2 * margin - 8);
    doc.text(descLines, margin + 4, yPos);
    yPos += Math.min(descLines.length * 3, 10) + 2;

    // Metadata
    doc.setFontSize(6);
    doc.setTextColor(107, 114, 128);
    doc.text(`Rule: ${violation.id}`, margin + 4, yPos);
    doc.text(`Elements: ${violation.nodes.length}`, margin + 55, yPos);
    yPos += 5;

    // First element
    if (violation.nodes[0]?.target) {
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(margin + 4, yPos - 2, pageWidth - 2 * margin - 8, 6, 1, 1, 'F');
      doc.setFontSize(6);
      doc.setTextColor(...colors.mediumGray);
      const target = violation.nodes[0].target.join(' > ');
      const targetLines = doc.splitTextToSize(target, pageWidth - 2 * margin - 14);
      doc.text(targetLines, margin + 5, yPos + 1);
      yPos += Math.min(targetLines.length * 2.5, 5) + 2;
    }

    yPos += 8;
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(...colors.lightGray);
    doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
    doc.setFontSize(7);
    doc.setTextColor(...colors.mediumGray);
    doc.setFont('Helvetica', 'bold');
    doc.text('AccessCheck', margin, pageHeight - 6);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
    doc.text(new Date().toLocaleDateString(), pageWidth - margin, pageHeight - 6, { align: 'right' });
  }

  return Buffer.from(doc.output('arraybuffer'));
}
