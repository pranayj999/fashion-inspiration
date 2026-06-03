"use client";

import { useMemo } from "react";
import type { DynamicFilters, FilterState } from "@/lib/types";

const FILTER_FIELDS: Array<{ key: keyof FilterState; label: string }> = [
  { key: "garmentType", label: "Garment type" },
  { key: "style", label: "Style" },
  { key: "material", label: "Material" },
  { key: "colorPalette", label: "Color palette" },
  { key: "pattern", label: "Pattern" },
  { key: "occasion", label: "Occasion" },
  { key: "consumerProfile", label: "Consumer profile" },
  { key: "trendNotes", label: "Trend notes" },
  { key: "continent", label: "Continent" },
  { key: "country", label: "Country" },
  { key: "city", label: "City" },
  { key: "year", label: "Year" },
  { key: "month", label: "Month" },
  { key: "season", label: "Season" },
  { key: "designer", label: "Designer" },
];

type Props = {
  filters: FilterState;
  options: DynamicFilters;
  onChange: (next: FilterState) => void;
};

export function FilterPanel({ filters, options, onChange }: Props) {
  const activeCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );

  return (
    <aside className="panel">
      <h2>Search &amp; filters</h2>
      <div className="filter-group">
        <label htmlFor="search">Full-text search</label>
        <input
          id="search"
          placeholder='e.g. "embroidered neckline"'
          value={filters.q ?? ""}
          onChange={(event) => onChange({ ...filters, q: event.target.value || undefined })}
        />
      </div>

      {FILTER_FIELDS.map(({ key, label }) => {
        const values = options[key as keyof DynamicFilters] ?? [];
        if (values.length === 0) return null;
        const fieldId = `filter-${key}`;
        return (
          <div className="filter-group" key={key}>
            <label htmlFor={fieldId}>{label}</label>
            <select
              id={fieldId}
              value={filters[key] ?? ""}
              onChange={(event) =>
                onChange({ ...filters, [key]: event.target.value || undefined })
              }
            >
              <option value="">Any</option>
              {values.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        );
      })}

      {activeCount > 0 && (
        <button type="button" onClick={() => onChange({})}>
          Clear filters ({activeCount})
        </button>
      )}
    </aside>
  );
}
