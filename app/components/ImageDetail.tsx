"use client";

import { useEffect, useState } from "react";
import type { ImageRecord } from "@/lib/types";

type Props = {
  image: ImageRecord;
  onClose: () => void;
  onUpdated: (image: ImageRecord) => void;
};

export function ImageDetail({ image, onClose, onUpdated }: Props) {
  const [tagsInput, setTagsInput] = useState(image.annotations.tags.join(", "));
  const [notes, setNotes] = useState(image.annotations.notes);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTagsInput(image.annotations.tags.join(", "));
    setNotes(image.annotations.notes);
    setMessage("");
  }, [image.id, image.annotations.tags, image.annotations.notes]);

  async function saveAnnotations() {
    setSaving(true);
    setMessage("");

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      const response = await fetch(`/api/images/${image.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags, notes }),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.id) {
        throw new Error(payload?.error ?? "Failed to save annotations");
      }

      setTagsInput(payload.annotations.tags.join(", "));
      setNotes(payload.annotations.notes);
      setMessage("Annotations saved.");
      onUpdated(payload as ImageRecord);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save annotations");
    } finally {
      setSaving(false);
    }
  }

  const captured = new Date(image.capturedAt);

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(event) => event.stopPropagation()}>
        <img src={`/uploads/${image.filename}`} alt={image.ai.description} />
        <div className="detail-content">
          <button className="close-button" type="button" onClick={onClose}>
            ×
          </button>
          <h2>{image.ai.garmentType}</h2>
          <p>{image.ai.description}</p>

          <div className="section-title">AI metadata</div>
          <div className="meta-row">
            <span className="chip ai">{image.ai.style}</span>
            <span className="chip ai">{image.ai.material}</span>
            <span className="chip ai">{image.ai.pattern}</span>
            <span className="chip ai">{image.ai.occasion}</span>
            {image.ai.colorPalette.map((color) => (
              <span className="chip ai" key={color}>
                {color}
              </span>
            ))}
          </div>
          <p>
            <strong>Location:</strong> {image.ai.location.continent}, {image.ai.location.country},{" "}
            {image.ai.location.city}
          </p>
          <p>
            <strong>Captured:</strong> {captured.toLocaleString()} · <strong>Designer:</strong>{" "}
            {image.designer}
          </p>
          <p>
            <strong>Trend notes:</strong> {image.ai.trendNotes}
          </p>

          <div className="section-title">Designer annotations</div>
          {image.annotations.tags.length > 0 && (
            <div className="meta-row" style={{ marginBottom: "0.5rem" }}>
              {image.annotations.tags.map((tag) => (
                <span className="chip designer" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="filter-group">
            <label htmlFor="detail-tags">Tags (comma separated)</label>
            <input
              id="detail-tags"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              placeholder="artisan market, neckline detail"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="detail-notes">Notes</label>
            <textarea
              id="detail-notes"
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Your observations..."
            />
          </div>
          <div className="detail-actions">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                void saveAnnotations();
              }}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save annotations"}
            </button>
          </div>
          {message && (
            <p className="status-bar" style={{ color: message.includes("saved") ? "#2f5d50" : "#8b4f3a" }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
