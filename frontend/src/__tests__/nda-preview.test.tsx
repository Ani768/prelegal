import { render, screen } from "@testing-library/react";
import { NDAPreview } from "@/components/nda-preview";
import { defaultFormData, NDAFormData } from "@/lib/nda-template";

describe("NDAPreview", () => {
  it("renders the cover page heading", () => {
    render(<NDAPreview data={defaultFormData} />);
    expect(
      screen.getByText("Mutual Non-Disclosure Agreement")
    ).toBeInTheDocument();
  });

  it("renders the standard terms heading", () => {
    render(<NDAPreview data={defaultFormData} />);
    expect(screen.getByText("Standard Terms")).toBeInTheDocument();
  });

  it("displays party names when provided", () => {
    const data: NDAFormData = {
      ...defaultFormData,
      party1Name: "Alice Johnson",
      party2Name: "Bob Williams",
    };
    render(<NDAPreview data={data} />);
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Williams")).toBeInTheDocument();
  });

  it("displays governing law when provided", () => {
    const data: NDAFormData = {
      ...defaultFormData,
      governingLaw: "New York",
    };
    render(<NDAPreview data={data} />);
    expect(
      screen.getByText(/Governing Law:.*New York/)
    ).toBeInTheDocument();
  });

  it("updates preview when data changes", () => {
    const { rerender } = render(<NDAPreview data={defaultFormData} />);
    expect(screen.queryByText("TestCorp")).not.toBeInTheDocument();

    const updatedData: NDAFormData = {
      ...defaultFormData,
      party1Company: "TestCorp",
    };
    rerender(<NDAPreview data={updatedData} />);
    expect(screen.getByText("TestCorp")).toBeInTheDocument();
  });
});
