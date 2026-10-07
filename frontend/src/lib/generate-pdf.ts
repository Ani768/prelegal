import { NDAFormData, generateCoverPageHTML, generateStandardTermsHTML } from "./nda-template";

export async function downloadPDF(data: NDAFormData) {
  const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; font-size: 12px; line-height: 1.6; color: #1a1a1a; max-width: 700px; margin: 0 auto; padding: 40px; }
    h1 { font-size: 20px; text-align: center; margin-bottom: 24px; }
    h3 { font-size: 14px; margin-top: 20px; margin-bottom: 8px; }
    p { margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
    th { background: #f5f5f5; }
    hr { margin: 32px 0; border: none; border-top: 1px solid #ccc; }
    em { color: #666; }
  </style>
</head>
<body>
  ${generateCoverPageHTML(data)}
  <hr />
  ${generateStandardTermsHTML()}
</body>
</html>`;

  // Use the browser's print-to-PDF via a hidden iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(fullHTML);
  doc.close();

  // Wait for content to render
  await new Promise((resolve) => setTimeout(resolve, 500));

  iframe.contentWindow?.print();

  // Clean up after print dialog closes
  setTimeout(() => document.body.removeChild(iframe), 1000);
}
