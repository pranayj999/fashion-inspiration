"use client";

import { useState } from "react";
import type { EvalRowComplete } from "@/lib/eval-data";

type Props = {
  rows: EvalRowComplete[];
  mode: string;
  model: string;
  generatedAt: string;
  summary: Record<string, { accuracy: number; correct: number; total: number }>;
  notes: { strengths: string; weaknesses: string; nextSteps: string };
  failures: string[];
  imagesReady: boolean;
};

function matchLabel(ok: boolean) {
  return ok ? "match" : "miss";
}

export function EvalGallery({
  rows,
  mode,
  model,
  generatedAt,
  summary,
  notes,
  failures,
  imagesReady,
}: Props) {
  const [selected, setSelected] = useState<EvalRowComplete | null>(null);

  if (!imagesReady) {
    return (
      <div className="panel empty-state">
        <p>Eval images are not synced to the app yet.</p>
        <p>
          From the project root run: <code>npm run eval:sync</code> (after{" "}
          <code>npm run eval:download</code>).
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="panel eval-summary">
        <h2>Model evaluation ({mode})</h2>
        <p className="muted">
          {model} · {rows.length} images · {new Date(generatedAt).toLocaleString()}
        </p>
        <div className="eval-metrics">
          {Object.entries(summary).map(([key, value]) => (
            <div key={key} className="eval-metric">
              <span className="eval-metric-label">{key}</span>
              <strong>{(value.accuracy * 100).toFixed(1)}%</strong>
              <span className="muted">
                {value.correct}/{value.total}
              </span>
            </div>
          ))}
        </div>
        <p>{notes.strengths}</p>
        <p>{notes.weaknesses}</p>
        {failures.length > 0 && (
          <p className="eval-failures">
            Failures: {failures.join("; ")}
          </p>
        )}
        <p className="muted">
          These images live in the evaluation set, not your upload library. Use{" "}
          <code>npm run eval:import</code> to copy them into the main Library with AI tags.
        </p>
      </section>

      <div className="image-grid eval-grid">
        {rows.map((row) => (
          <article
            key={row.id}
            className="image-card eval-card"
            onClick={() => setSelected(row)}
            onKeyDown={(event) => {
              if (event.key === "Enter") setSelected(row);
            }}
            role="button"
            tabIndex={0}
          >
            <img src={`/eval/${row.id}.jpg`} alt={row.predicted.description} />
            <div className="image-card-body">
              <h3>{row.predicted.garmentType}</h3>
              <p>Expected: {row.expected.garmentType}</p>
              <div className="meta-row eval-tags">
                <span className={`chip ${matchLabel(!!row.garmentTypeMatch)}`}>garment</span>
                <span className={`chip ${matchLabel(!!row.styleMatch)}`}>style</span>
                <span className={`chip ${matchLabel(!!row.materialMatch)}`}>material</span>
                <span className={`chip ${matchLabel(!!row.occasionMatch)}`}>occasion</span>
                <span className={`chip ${matchLabel(!!row.locationMatch)}`}>location</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal panel eval-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setSelected(null)}>
              Close
            </button>
            <img src={`/eval/${selected.id}.jpg`} alt={selected.predicted.description} />
            <h3>{selected.id}</h3>
            <p>{selected.predicted.description}</p>
            <div className="eval-compare">
              <div>
                <h4>Predicted</h4>
                <ul>
                  <li>Garment: {selected.predicted.garmentType}</li>
                  <li>Style: {selected.predicted.style}</li>
                  <li>Material: {selected.predicted.material}</li>
                  <li>Occasion: {selected.predicted.occasion}</li>
                </ul>
              </div>
              <div>
                <h4>Expected (curator)</h4>
                <ul>
                  <li>Garment: {selected.expected.garmentType}</li>
                  <li>Style: {selected.expected.style}</li>
                  <li>Material: {selected.expected.material}</li>
                  <li>Occasion: {selected.expected.occasion}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
