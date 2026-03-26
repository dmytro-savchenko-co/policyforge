import { NextRequest, NextResponse } from "next/server";

// Serves an embeddable DSAR (Data Subject Access Request) form
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { formId } = await params;

  // In production, fetch form config from Supabase
  // For now, generate a standard DSAR form
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Data Subject Access Request</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; max-width: 600px; margin: 0 auto; color: #1a1a1a; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    p.desc { color: #64748b; margin-bottom: 24px; font-size: 14px; line-height: 1.5; }
    label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; margin-top: 16px; }
    input, select, textarea { width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; font-size: 14px; }
    input:focus, select:focus, textarea:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    textarea { resize: vertical; min-height: 80px; }
    button { margin-top: 24px; width: 100%; background: #2563eb; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
    button:hover { background: #1d4ed8; }
    .success { text-align: center; padding: 40px; }
    .success h2 { color: #16a34a; margin-bottom: 8px; }
    .footer { margin-top: 24px; text-align: center; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div id="dsar-form">
    <h1>Data Subject Access Request</h1>
    <p class="desc">Under data protection laws (GDPR, CCPA), you have the right to access, correct, delete, or port your personal data. Submit this form to exercise your rights.</p>
    <form id="form" onsubmit="handleSubmit(event)">
      <label for="name">Full Name *</label>
      <input type="text" id="name" name="name" required placeholder="Your full name">

      <label for="email">Email Address *</label>
      <input type="email" id="email" name="email" required placeholder="your@email.com">

      <label for="request_type">Request Type *</label>
      <select id="request_type" name="request_type" required>
        <option value="">Select a request type</option>
        <option value="access">Access my data</option>
        <option value="rectification">Correct my data</option>
        <option value="erasure">Delete my data</option>
        <option value="portability">Export my data</option>
        <option value="restriction">Restrict processing</option>
        <option value="objection">Object to processing</option>
        <option value="opt-out">Opt out of data sale</option>
      </select>

      <label for="details">Additional Details</label>
      <textarea id="details" name="details" placeholder="Provide any additional context for your request..."></textarea>

      <button type="submit">Submit Request</button>
    </form>
    <div class="footer">Powered by PolicyForge &middot; Form ID: ${formId}</div>
  </div>
  <script>
    function handleSubmit(e) {
      e.preventDefault();
      var form = document.getElementById('form');
      var container = document.getElementById('dsar-form');
      container.innerHTML = '<div class="success"><h2>Request Submitted</h2><p>Your data subject access request has been received. You will receive a confirmation email and a response within 30 days as required by law.</p></div><div class="footer">Powered by PolicyForge</div>';
    }
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
