"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NDAFormData } from "@/lib/nda-template";

interface NDAFormProps {
  data: NDAFormData;
  onChange: (data: NDAFormData) => void;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {children}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-2 pt-4 first:pt-0">
      {title}
    </h3>
  );
}

export function NDAForm({ data, onChange }: NDAFormProps) {
  const update = (field: keyof NDAFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="Agreement Terms" />

      <Field label="Purpose">
        <Textarea
          value={data.purpose}
          onChange={(e) => update("purpose", e.target.value)}
          rows={2}
          placeholder="How Confidential Information may be used"
        />
      </Field>

      <Field label="Effective Date">
        <Input
          type="date"
          value={data.effectiveDate}
          onChange={(e) => update("effectiveDate", e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="MNDA Term">
          <Select
            value={data.mndaTermType}
            onValueChange={(v) =>
              v && update("mndaTermType", v)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expires">Expires after</SelectItem>
              <SelectItem value="until_terminated">
                Until terminated
              </SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {data.mndaTermType === "expires" && (
          <Field label="Term (years)">
            <Input
              type="number"
              min="1"
              value={data.mndaTermYears}
              onChange={(e) => update("mndaTermYears", e.target.value)}
            />
          </Field>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Confidentiality Term">
          <Select
            value={data.confidentialityTermType}
            onValueChange={(v) =>
              v && update("confidentialityTermType", v)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="years">Fixed term</SelectItem>
              <SelectItem value="perpetuity">In perpetuity</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {data.confidentialityTermType === "years" && (
          <Field label="Term (years)">
            <Input
              type="number"
              min="1"
              value={data.confidentialityTermYears}
              onChange={(e) =>
                update("confidentialityTermYears", e.target.value)
              }
            />
          </Field>
        )}
      </div>

      <Field label="Governing Law (State)">
        <Input
          value={data.governingLaw}
          onChange={(e) => update("governingLaw", e.target.value)}
          placeholder="e.g. Delaware"
        />
      </Field>

      <Field label="Jurisdiction">
        <Input
          value={data.jurisdiction}
          onChange={(e) => update("jurisdiction", e.target.value)}
          placeholder="e.g. courts located in New Castle, DE"
        />
      </Field>

      <Field label="MNDA Modifications (optional)">
        <Textarea
          value={data.modifications}
          onChange={(e) => update("modifications", e.target.value)}
          rows={2}
          placeholder="Any modifications to the standard terms"
        />
      </Field>

      <SectionHeader title="Party 1" />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Full Name">
          <Input
            value={data.party1Name}
            onChange={(e) => update("party1Name", e.target.value)}
            placeholder="John Doe"
          />
        </Field>
        <Field label="Title">
          <Input
            value={data.party1Title}
            onChange={(e) => update("party1Title", e.target.value)}
            placeholder="CEO"
          />
        </Field>
      </div>

      <Field label="Company">
        <Input
          value={data.party1Company}
          onChange={(e) => update("party1Company", e.target.value)}
          placeholder="Acme Corp"
        />
      </Field>

      <Field label="Notice Address">
        <Input
          value={data.party1Address}
          onChange={(e) => update("party1Address", e.target.value)}
          placeholder="Email or postal address"
        />
      </Field>

      <SectionHeader title="Party 2" />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Full Name">
          <Input
            value={data.party2Name}
            onChange={(e) => update("party2Name", e.target.value)}
            placeholder="Jane Smith"
          />
        </Field>
        <Field label="Title">
          <Input
            value={data.party2Title}
            onChange={(e) => update("party2Title", e.target.value)}
            placeholder="CTO"
          />
        </Field>
      </div>

      <Field label="Company">
        <Input
          value={data.party2Company}
          onChange={(e) => update("party2Company", e.target.value)}
          placeholder="Widget Inc"
        />
      </Field>

      <Field label="Notice Address">
        <Input
          value={data.party2Address}
          onChange={(e) => update("party2Address", e.target.value)}
          placeholder="Email or postal address"
        />
      </Field>
    </div>
  );
}
