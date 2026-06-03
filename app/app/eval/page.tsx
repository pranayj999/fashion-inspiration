import { EvalGallery } from "@/components/EvalGallery";
import { evalImageExists, isCompleteEvalRow, loadEvalResults } from "@/lib/eval-data";

export default function EvalPage() {
  const results = loadEvalResults();

  if (!results) {
    return (
      <div className="panel empty-state">
        <p>No evaluation results found.</p>
        <p>
          Run <code>npm run eval:download</code> then <code>CLASSIFIER_PROVIDER=claude npm run eval</code>{" "}
          from the project root.
        </p>
      </div>
    );
  }

  const rows = results.rows.filter(isCompleteEvalRow);
  const imagesReady = rows.length > 0 && rows.every((row) => evalImageExists(row.id));

  return (
    <EvalGallery
      rows={rows}
      mode={results.mode}
      model={results.model}
      generatedAt={results.generatedAt}
      summary={results.summary}
      notes={results.notes}
      failures={results.failures}
      imagesReady={imagesReady}
    />
  );
}
