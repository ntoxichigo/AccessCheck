'use client';

interface ResultsDisplayProps {
  results: any;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results) return null;

  // If results is an object with violations (axe-core style)
  const violations = results.violations || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Accessibility Report</h2>
      {violations.length === 0 ? (
        <p className="text-green-600">✅ No accessibility issues found!</p>
      ) : (
        <ul className="space-y-4">
          {violations.map((v: any, i: number) => (
            <li key={i} className="border p-4 rounded bg-gray-50">
              <h3 className="font-semibold text-lg">{v.help}</h3>
              <p className="text-sm text-gray-700 mb-2">{v.description}</p>
              <p className="text-sm">
                <strong>Impact:</strong> {v.impact}
              </p>
              <a
                href={v.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                Learn more
              </a>
              {v.nodes && v.nodes.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                  {v.nodes.map((node: any, j: number) => (
                    <li key={j}>{node.html}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
