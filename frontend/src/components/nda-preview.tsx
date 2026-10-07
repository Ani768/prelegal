"use client";

import { NDAFormData, generateCoverPageHTML, generateStandardTermsHTML } from "@/lib/nda-template";

interface NDAPreviewProps {
  data: NDAFormData;
}

export function NDAPreview({ data }: NDAPreviewProps) {
  const coverPageHTML = generateCoverPageHTML(data);
  const standardTermsHTML = generateStandardTermsHTML();

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-auto max-h-[calc(100vh-140px)]">
      <div
        className="p-8 prose prose-sm max-w-none
          [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-4
          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
          [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-gray-800
          [&_table]:text-sm [&_table]:mt-4
          [&_th]:bg-gray-50 [&_th]:text-left [&_th]:p-2
          [&_td]:p-2 [&_td]:border [&_td]:border-gray-200"
        dangerouslySetInnerHTML={{ __html: coverPageHTML }}
      />
      <hr className="mx-8 border-gray-300" />
      <div
        className="p-8 prose prose-sm max-w-none
          [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-4
          [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-gray-800 [&_p]:mb-3"
        dangerouslySetInnerHTML={{ __html: standardTermsHTML }}
      />
    </div>
  );
}
