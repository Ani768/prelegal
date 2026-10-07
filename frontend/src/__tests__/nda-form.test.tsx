import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NDAForm } from "@/components/nda-form";
import { defaultFormData, NDAFormData } from "@/lib/nda-template";

describe("NDAForm", () => {
  let formData: NDAFormData;
  let onChange: jest.Mock;

  beforeEach(() => {
    formData = { ...defaultFormData };
    onChange = jest.fn();
  });

  it("renders all section headers", () => {
    render(<NDAForm data={formData} onChange={onChange} />);
    expect(screen.getByText("Agreement Terms")).toBeInTheDocument();
    expect(screen.getByText("Party 1")).toBeInTheDocument();
    expect(screen.getByText("Party 2")).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    render(<NDAForm data={formData} onChange={onChange} />);
    expect(screen.getByPlaceholderText("How Confidential Information may be used")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. Delaware")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. courts located in New Castle, DE")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Widget Inc")).toBeInTheDocument();
  });

  it("calls onChange when a text field is updated", async () => {
    render(<NDAForm data={formData} onChange={onChange} />);
    const input = screen.getByPlaceholderText("e.g. Delaware");
    await userEvent.type(input, "C");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ governingLaw: "C" })
    );
  });

  it("calls onChange when party name is updated", async () => {
    render(<NDAForm data={formData} onChange={onChange} />);
    const input = screen.getByPlaceholderText("John Doe");
    await userEvent.type(input, "A");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ party1Name: "A" })
    );
  });

  it("displays pre-filled data correctly", () => {
    const filledData: NDAFormData = {
      ...defaultFormData,
      governingLaw: "California",
      party1Name: "Alice",
      party2Company: "BetaCo",
    };
    render(<NDAForm data={filledData} onChange={onChange} />);
    expect(screen.getByDisplayValue("California")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    expect(screen.getByDisplayValue("BetaCo")).toBeInTheDocument();
  });

  it("renders the effective date input", () => {
    const dataWithDate = { ...formData, effectiveDate: "2026-01-15" };
    render(<NDAForm data={dataWithDate} onChange={onChange} />);
    const dateInput = screen.getByDisplayValue("2026-01-15");
    expect(dateInput).toBeInTheDocument();
  });
});
