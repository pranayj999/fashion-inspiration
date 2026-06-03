"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FilterPanel } from "@/components/FilterPanel";
import { ImageDetail } from "@/components/ImageDetail";
import { ImageGrid } from "@/components/ImageGrid";
import { useLibraryNav } from "@/components/LibraryNav";
import { UploadForm } from "@/components/UploadForm";
import type { DynamicFilters, FilterState, ImageRecord } from "@/lib/types";

const EMPTY_FILTERS: DynamicFilters = {
  garmentType: [],
  style: [],
  material: [],
  colorPalette: [],
  pattern: [],
  occasion: [],
  consumerProfile: [],
  trendNotes: [],
  continent: [],
  country: [],
  city: [],
  year: [],
  month: [],
  season: [],
  designer: [],
};

export default function HomePage() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [dynamicFilters, setDynamicFilters] = useState<DynamicFilters>(EMPTY_FILTERS);
  const [filters, setFilters] = useState<FilterState>({});
  const [selected, setSelected] = useState<ImageRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const { registerReset } = useLibraryNav();

  useEffect(() => {
    registerReset(() => {
      setFilters({});
      setSelected(null);
    });
  }, [registerReset]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  const loadImages = useCallback(async () => {
    setLoading(true);
    const response = await fetch(`/api/images${queryString ? `?${queryString}` : ""}`);
    const payload = await response.json();
    setImages(payload.images ?? []);
    setDynamicFilters(payload.filters ?? EMPTY_FILTERS);
    setLoading(false);
  }, [queryString]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  return (
    <>
      <UploadForm onUploaded={loadImages} />
      <div className="grid-layout">
        <FilterPanel filters={filters} options={dynamicFilters} onChange={setFilters} />
        <section>
          <div className="status-bar">
            {loading ? "Loading library..." : `${images.length} inspiration image(s)`}
          </div>
          <ImageGrid images={images} onSelect={setSelected} />
        </section>
      </div>
      {selected && (
        <ImageDetail
          key={selected.id}
          image={selected}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setSelected(updated);
            loadImages();
          }}
        />
      )}
    </>
  );
}
