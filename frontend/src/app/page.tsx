"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NDAForm } from "@/components/nda-form";
import { NDAPreview } from "@/components/nda-preview";
import { defaultFormData } from "@/lib/nda-template";
import { downloadPDF } from "@/lib/generate-pdf";

export default function Home() {
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (!formData.effectiveDate) {
      setFormData((prev) => ({
        ...prev,
        effectiveDate: new Date().toISOString().split("T")[0],
      }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Prelegal</h1>
          <p className="text-sm text-gray-500">Mutual NDA Creator</p>
        </div>
        <Button onClick={() => downloadPDF(formData)}>
          Download PDF
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-0 h-[calc(100vh-73px)]">
        {/* Form */}
        <div className="border-r bg-white overflow-auto p-6">
          <NDAForm data={formData} onChange={setFormData} />
        </div>

        {/* Preview */}
        <div className="p-6 overflow-auto bg-gray-100">
          <NDAPreview data={formData} />
        </div>
      </div>
    </div>
  );
}
