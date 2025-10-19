'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

interface PDFExportButtonProps {
  scanId: string;
  disabled?: boolean;
  className?: string;
}

export function PDFExportButton({ scanId, disabled = false, className = '' }: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch(`/api/pdf?scanId=${scanId}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate PDF');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `accessibility-report-${scanId}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message);
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={disabled || isExporting}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
          disabled || isExporting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
        } ${className}`}
      >
        <Download className={`h-4 w-4 ${isExporting ? 'animate-bounce' : ''}`} />
        {isExporting ? 'Generating PDF...' : 'Export PDF Report'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error === 'PDF export requires Pro plan or higher' ? (
            <>
              {error}.{' '}
              <a href="/pricing" className="underline font-semibold">
                Upgrade now
              </a>
            </>
          ) : (
            error
          )}
        </p>
      )}
    </div>
  );
}
