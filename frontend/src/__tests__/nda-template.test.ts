import {
  defaultFormData,
  generateCoverPageHTML,
  generateStandardTermsHTML,
  NDAFormData,
} from "@/lib/nda-template";

describe("defaultFormData", () => {
  it("has all required fields", () => {
    expect(defaultFormData.purpose).toBeTruthy();
    expect(defaultFormData.effectiveDate).toBe("");
    expect(defaultFormData.mndaTermType).toBe("expires");
    expect(defaultFormData.mndaTermYears).toBe("1");
    expect(defaultFormData.confidentialityTermType).toBe("years");
    expect(defaultFormData.confidentialityTermYears).toBe("1");
  });

  it("has empty party fields by default", () => {
    expect(defaultFormData.party1Name).toBe("");
    expect(defaultFormData.party1Title).toBe("");
    expect(defaultFormData.party1Company).toBe("");
    expect(defaultFormData.party1Address).toBe("");
    expect(defaultFormData.party2Name).toBe("");
    expect(defaultFormData.party2Title).toBe("");
    expect(defaultFormData.party2Company).toBe("");
    expect(defaultFormData.party2Address).toBe("");
  });
});

describe("generateCoverPageHTML", () => {
  const filledData: NDAFormData = {
    purpose: "Evaluating a partnership",
    effectiveDate: "2026-01-15",
    mndaTermType: "expires",
    mndaTermYears: "2",
    confidentialityTermType: "years",
    confidentialityTermYears: "3",
    governingLaw: "Delaware",
    jurisdiction: "courts located in New Castle, DE",
    modifications: "None",
    party1Name: "John Doe",
    party1Title: "CEO",
    party1Company: "Acme Corp",
    party1Address: "john@acme.com",
    party2Name: "Jane Smith",
    party2Title: "CTO",
    party2Company: "Widget Inc",
    party2Address: "jane@widget.com",
  };

  it("renders party names in the table", () => {
    const html = generateCoverPageHTML(filledData);
    expect(html).toContain("John Doe");
    expect(html).toContain("Jane Smith");
  });

  it("renders company names", () => {
    const html = generateCoverPageHTML(filledData);
    expect(html).toContain("Acme Corp");
    expect(html).toContain("Widget Inc");
  });

  it("renders titles", () => {
    const html = generateCoverPageHTML(filledData);
    expect(html).toContain("CEO");
    expect(html).toContain("CTO");
  });

  it("renders notice addresses", () => {
    const html = generateCoverPageHTML(filledData);
    expect(html).toContain("john@acme.com");
    expect(html).toContain("jane@widget.com");
  });

  it("renders the purpose", () => {
    const html = generateCoverPageHTML(filledData);
    expect(html).toContain("Evaluating a partnership");
  });

  it("renders the effective date", () => {
    const html = generateCoverPageHTML(filledData);
    expect(html).toContain("2026-01-15");
  });

  it("renders expires term type correctly", () => {
    const html = generateCoverPageHTML(filledData);
    expect(html).toContain("Expires 2 year(s) from Effective Date");
  });

  it("renders until_terminated term type correctly", () => {
    const data = { ...filledData, mndaTermType: "until_terminated" as const };
    const html = generateCoverPageHTML(data);
    expect(html).toContain("Continues until terminated");
  });

  it("renders fixed confidentiality term correctly", () => {
    const html = generateCoverPageHTML(filledData);
    expect(html).toContain("3 year(s) from Effective Date");
  });

  it("renders perpetuity confidentiality term correctly", () => {
    const data = {
      ...filledData,
      confidentialityTermType: "perpetuity" as const,
    };
    const html = generateCoverPageHTML(data);
    expect(html).toContain("In perpetuity");
  });

  it("renders governing law and jurisdiction", () => {
    const html = generateCoverPageHTML(filledData);
    expect(html).toContain("Delaware");
    expect(html).toContain("courts located in New Castle, DE");
  });

  it("renders modifications when provided", () => {
    const html = generateCoverPageHTML(filledData);
    expect(html).toContain("MNDA Modifications");
    expect(html).toContain("None");
  });

  it("omits modifications section when empty", () => {
    const data = { ...filledData, modifications: "" };
    const html = generateCoverPageHTML(data);
    expect(html).not.toContain("MNDA Modifications");
  });

  it("shows [Not specified] for empty required fields", () => {
    const emptyData = { ...defaultFormData };
    emptyData.governingLaw = "";
    emptyData.jurisdiction = "";
    const html = generateCoverPageHTML(emptyData);
    expect(html).toContain("[Not specified]");
  });

  it("includes CC BY 4.0 attribution", () => {
    const html = generateCoverPageHTML(filledData);
    expect(html).toContain("CC BY 4.0");
  });
});

describe("generateStandardTermsHTML", () => {
  it("contains all 11 sections", () => {
    const html = generateStandardTermsHTML();
    expect(html).toContain("1. Introduction");
    expect(html).toContain("2. Use and Protection");
    expect(html).toContain("3. Exceptions");
    expect(html).toContain("4. Disclosures Required by Law");
    expect(html).toContain("5. Term and Termination");
    expect(html).toContain("6. Return or Destruction");
    expect(html).toContain("7. Proprietary Rights");
    expect(html).toContain("8. Disclaimer");
    expect(html).toContain("9. Governing Law and Jurisdiction");
    expect(html).toContain("10. Equitable Relief");
    expect(html).toContain("11. General");
  });

  it("includes CC BY 4.0 attribution", () => {
    const html = generateStandardTermsHTML();
    expect(html).toContain("CC BY 4.0");
  });
});

describe("XSS safety", () => {
  it("escapes HTML in user input to prevent XSS", () => {
    const maliciousData: NDAFormData = {
      ...defaultFormData,
      party1Name: '<script>alert("xss")</script>',
      purpose: '<img src=x onerror=alert(1)>',
      governingLaw: '"><script>alert(1)</script>',
    };
    const html = generateCoverPageHTML(maliciousData);
    // Script tags are escaped — no raw HTML injection possible
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;img");
  });

  it("escapes all party fields", () => {
    const data: NDAFormData = {
      ...defaultFormData,
      party1Name: "<b>bold</b>",
      party1Title: "<i>italic</i>",
      party1Company: "A&B",
      party1Address: 'a"b',
      party2Name: "<b>bold</b>",
      party2Title: "<i>italic</i>",
      party2Company: "C&D",
      party2Address: "c'd",
    };
    const html = generateCoverPageHTML(data);
    expect(html).not.toContain("<b>bold</b>");
    expect(html).toContain("&lt;b&gt;bold&lt;/b&gt;");
    expect(html).toContain("A&amp;B");
    expect(html).toContain("a&quot;b");
    expect(html).toContain("c&#x27;d");
  });
});
