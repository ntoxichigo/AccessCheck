'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ScanAgreementCheckboxProps {
  onAgreementChange: (agreed: boolean) => void;
  required?: boolean;
}

export function ScanAgreementCheckbox({ onAgreementChange, required = true }: ScanAgreementCheckboxProps) {
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAgreed(checked);
    onAgreementChange(checked);
  };

  return (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-1" />
        <label className="flex items-start gap-3 cursor-pointer flex-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={handleChange}
            required={required}
            className="mt-1 h-5 w-5 rounded border-yellow-400 text-yellow-600 focus:ring-yellow-500 cursor-pointer flex-shrink-0"
          />
          <span className="text-sm text-yellow-900 leading-relaxed">
            <strong>I understand</strong> this tool does not guarantee legal compliance and that{' '}
            <strong>manual review is required</strong>. I am responsible for my own accessibility compliance.
            This is not legal advice or a certification service.
          </span>
        </label>
      </div>
    </div>
  );
}
