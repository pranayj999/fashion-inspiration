"use client";

import { useState } from "react";

type Props = {
  onUploaded: () => void;
};

export function UploadForm({ onUploaded }: Props) {
  const [designer, setDesigner] = useState("");
  const [locationHint, setLocationHint] = useState("");
  const [capturedAt, setCapturedAt] = useState("");
  const [classifier, setClassifier] = useState<"mock" | "openai" | "claude">("mock");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) {
      setMessage("Choose an image to upload.");
      return;
    }

    setLoading(true);
    setMessage("");
    const body = new FormData();
    body.append("file", file);
    body.append("designer", designer);
    body.append("locationHint", locationHint);
    body.append("capturedAt", capturedAt);
    body.append("provider", classifier);
    body.append("useMock", String(classifier === "mock"));

    try {
      const response = await fetch("/api/images", { method: "POST", body });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Upload failed");
      setMessage("Uploaded and classified.");
      fileInput.value = "";
      onUploaded();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel" style={{ marginBottom: "1.25rem" }}>
      <h2>Upload inspiration</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="filter-group">
          <label htmlFor="file">Photo</label>
          <input id="file" name="file" type="file" accept="image/*" required />
        </div>
        <div className="filter-group">
          <label htmlFor="designer">Designer</label>
          <input
            id="designer"
            value={designer}
            onChange={(event) => setDesigner(event.target.value)}
            placeholder="e.g. Alex Chen"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="locationHint">Location hint (continent, country, city)</label>
          <input
            id="locationHint"
            value={locationHint}
            onChange={(event) => setLocationHint(event.target.value)}
            placeholder="Europe, France, Paris"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="capturedAt">Captured at</label>
          <input
            id="capturedAt"
            type="datetime-local"
            value={capturedAt}
            onChange={(event) => setCapturedAt(event.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="classifier">Classifier</label>
          <select
            id="classifier"
            value={classifier}
            onChange={(event) =>
              setClassifier(event.target.value as "mock" | "openai" | "claude")
            }
          >
            <option value="mock">Mock (no API key)</option>
            <option value="openai">OpenAI (GPT-4o vision)</option>
            <option value="claude">Claude (Anthropic vision)</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Classifying..." : "Upload & classify"}
        </button>
        {message && <p className="status-bar">{message}</p>}
      </form>
    </section>
  );
}
