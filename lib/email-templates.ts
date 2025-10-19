export interface ScanCompletionEmailData {
  url: string;
  scanId: string;
  violationsCount: number;
  criticalCount: number;
  seriousCount: number;
  moderateCount: number;
  minorCount: number;
  userName?: string;
  reportUrl: string;
}

export function generateScanCompletionEmail(data: ScanCompletionEmailData): string {
  const {
    url,
    scanId,
    violationsCount,
    criticalCount,
    seriousCount,
    moderateCount,
    minorCount,
    userName,
    reportUrl,
  } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scan Complete - AccessCheck</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ✅ Scan Complete
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
                Your accessibility report is ready${userName ? `, ${userName}` : ''}!
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Scanned URL -->
              <div style="margin-bottom: 30px;">
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Scanned URL
                </p>
                <p style="margin: 0; color: #1f2937; font-size: 16px; word-break: break-all;">
                  ${url}
                </p>
              </div>

              <!-- Summary Stats -->
              <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px; font-weight: 600;">
                  Summary
                </h2>

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 12px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="vertical-align: middle;">
                            <span style="display: inline-block; width: 12px; height: 12px; background-color: #ef4444; border-radius: 50%; margin-right: 10px;"></span>
                            <span style="color: #1f2937; font-weight: 600;">Critical</span>
                          </td>
                          <td align="right" style="color: #6b7280; font-size: 18px; font-weight: bold;">
                            ${criticalCount}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="vertical-align: middle;">
                            <span style="display: inline-block; width: 12px; height: 12px; background-color: #f97316; border-radius: 50%; margin-right: 10px;"></span>
                            <span style="color: #1f2937; font-weight: 600;">Serious</span>
                          </td>
                          <td align="right" style="color: #6b7280; font-size: 18px; font-weight: bold;">
                            ${seriousCount}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="vertical-align: middle;">
                            <span style="display: inline-block; width: 12px; height: 12px; background-color: #eab308; border-radius: 50%; margin-right: 10px;"></span>
                            <span style="color: #1f2937; font-weight: 600;">Moderate</span>
                          </td>
                          <td align="right" style="color: #6b7280; font-size: 18px; font-weight: bold;">
                            ${moderateCount}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 2px solid #e5e7eb;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="vertical-align: middle;">
                            <span style="display: inline-block; width: 12px; height: 12px; background-color: #3b82f6; border-radius: 50%; margin-right: 10px;"></span>
                            <span style="color: #1f2937; font-weight: 600;">Minor</span>
                          </td>
                          <td align="right" style="color: #6b7280; font-size: 18px; font-weight: bold;">
                            ${minorCount}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 0 0 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="vertical-align: middle;">
                            <span style="color: #1f2937; font-weight: bold; font-size: 16px;">Total Issues</span>
                          </td>
                          <td align="right" style="color: #1f2937; font-size: 24px; font-weight: bold;">
                            ${violationsCount}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                      View Full Report
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              ${violationsCount > 0 ? `
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: 600;">
                  Next Steps
                </h3>
                <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">
                  Review the detailed report to understand each violation and get remediation guidance.
                  ${criticalCount > 0 ? 'Focus on critical issues first to ensure WCAG compliance.' : ''}
                </p>
              </div>
              ` : `
              <div style="background-color: #d1fae5; border-left: 4px solid: #10b981; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 16px; font-weight: 600;">
                  Great Job!
                </h3>
                <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.6;">
                  No accessibility violations found. Your website is performing well!
                </p>
              </div>
              `}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                <strong>AccessCheck</strong> - Professional Web Accessibility Scanner
              </p>
              <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;">
                Scan ID: ${scanId}
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                This email was sent because you initiated an accessibility scan.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export interface BatchScanCompletionEmailData {
  batchName: string;
  batchId: string;
  totalUrls: number;
  completedUrls: number;
  failedUrls: number;
  totalIssues: number;
  avgIssuesPerUrl: number;
  userName?: string;
  reportUrl: string;
  topIssues?: Array<{
    url: string;
    issuesFound: number;
  }>;
}

export function generateBatchScanCompletionEmail(data: BatchScanCompletionEmailData): string {
  const {
    batchName,
    batchId,
    totalUrls,
    completedUrls,
    failedUrls,
    totalIssues,
    avgIssuesPerUrl,
    userName,
    reportUrl,
    topIssues = [],
  } = data;

  const successRate = Math.round((completedUrls / totalUrls) * 100);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Batch Scan Complete - AccessCheck</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🎉 Batch Scan Complete
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
                Your bulk accessibility scan is ready${userName ? `, ${userName}` : ''}!
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Batch Name -->
              <div style="margin-bottom: 30px; text-align: center;">
                <h2 style="margin: 0 0 8px 0; color: #1f2937; font-size: 24px; font-weight: 700;">
                  ${batchName}
                </h2>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  Batch ID: ${batchId}
                </p>
              </div>

              <!-- Summary Stats Grid -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td style="width: 50%; padding: 8px;">
                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 12px; padding: 20px; text-align: center;">
                      <p style="margin: 0 0 5px 0; color: rgba(255, 255, 255, 0.9); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Total URLs
                      </p>
                      <p style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                        ${totalUrls}
                      </p>
                    </div>
                  </td>
                  <td style="width: 50%; padding: 8px;">
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; padding: 20px; text-align: center;">
                      <p style="margin: 0 0 5px 0; color: rgba(255, 255, 255, 0.9); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Completed
                      </p>
                      <p style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                        ${completedUrls}
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="width: 50%; padding: 8px;">
                    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 12px; padding: 20px; text-align: center;">
                      <p style="margin: 0 0 5px 0; color: rgba(255, 255, 255, 0.9); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Total Issues
                      </p>
                      <p style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                        ${totalIssues}
                      </p>
                    </div>
                  </td>
                  <td style="width: 50%; padding: 8px;">
                    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; padding: 20px; text-align: center;">
                      <p style="margin: 0 0 5px 0; color: rgba(255, 255, 255, 0.9); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Avg/URL
                      </p>
                      <p style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                        ${avgIssuesPerUrl}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Success Rate -->
              <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <div style="margin-bottom: 12px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td>
                        <span style="color: #1f2937; font-weight: 600; font-size: 16px;">Success Rate</span>
                      </td>
                      <td align="right">
                        <span style="color: ${successRate >= 90 ? '#10b981' : successRate >= 70 ? '#f59e0b' : '#ef4444'}; font-weight: bold; font-size: 18px;">
                          ${successRate}%
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
                <div style="background-color: #e5e7eb; border-radius: 8px; height: 12px; overflow: hidden;">
                  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); height: 100%; width: ${successRate}%; transition: width 0.3s;"></div>
                </div>
                ${failedUrls > 0 ? `
                <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 14px;">
                  ${failedUrls} URL${failedUrls !== 1 ? 's' : ''} failed to scan. View the full report for details.
                </p>
                ` : ''}
              </div>

              <!-- Top Issues (if any) -->
              ${topIssues.length > 0 ? `
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 16px; font-weight: 600;">
                  Top URLs with Issues
                </h3>
                ${topIssues.map(issue => `
                <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #fde68a;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="color: #78350f; font-size: 14px; word-break: break-all;">
                        ${issue.url}
                      </td>
                      <td align="right" style="color: #92400e; font-weight: bold; white-space: nowrap; padding-left: 10px;">
                        ${issue.issuesFound} issues
                      </td>
                    </tr>
                  </table>
                </div>
                `).join('')}
              </div>
              ` : ''}

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                      View Full Batch Report
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              ${totalIssues > 0 ? `
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px;">
                <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                  Next Steps
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #1e3a8a; font-size: 14px; line-height: 1.8;">
                  <li>Review the detailed batch report</li>
                  <li>Prioritize URLs with the most issues</li>
                  <li>Export results as CSV for your team</li>
                  <li>Schedule follow-up scans to track improvements</li>
                </ul>
              </div>
              ` : `
              <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px;">
                <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 16px; font-weight: 600;">
                  Excellent Work!
                </h3>
                <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.6;">
                  Your websites are performing well with no accessibility violations detected. Keep up the great work!
                </p>
              </div>
              `}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                <strong>AccessCheck</strong> - Professional Web Accessibility Scanner
              </p>
              <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;">
                Scanned ${totalUrls} URL${totalUrls !== 1 ? 's' : ''} in this batch
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                This email was sent because your batch scan has completed.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
