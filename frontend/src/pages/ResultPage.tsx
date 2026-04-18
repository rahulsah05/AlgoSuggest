import { DashboardLayout } from "@/components/DashboardLayout";
import { Trophy, RefreshCw, AlertTriangle, Info, Bug } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type DebugInfo = {
  n_rows_after_cleaning?: number;
  n_features?: number;
  problem_type?: string;
  target_column?: string;
  y_unique_classes?: number;
  model_errors?: Record<string, string>;
};

type ResultState = {
  type?: "classification" | "regression";
  best_algorithm?: string;
  score?: number;
  results?: Record<string, number>;
  features_used?: string[];
  n_features?: number;
  n_rows?: number;
  target_column?: string;
  warning?: string;
  error?: string;
  debug?: DebugInfo;
};

const formatScore = (score: number, type?: string): string => {
  if (type === "regression") return score.toFixed(4);
  return `${(score * 100).toFixed(2)}%`;
};

const scoreLabel = (type?: string) =>
  type === "regression" ? "R² Score" : "Accuracy";

const ResultPage = () => {
  const location = useLocation();
  const state = location.state as ResultState | null;

  if (!state) {
    return (
      <DashboardLayout title="Results">
        <div className="p-10 text-white">
          <p>No result data available. Please upload a dataset first.</p>
        </div>
      </DashboardLayout>
    );
  }

  if (state.error) {
    const debug = state.debug;
    return (
      <DashboardLayout title="Results">
        <div className="p-10 space-y-4">

          {/* Main error */}
          <div className="glass-card p-6 border-destructive/30 flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-destructive mt-0.5 shrink-0" />
            <div>
              <h2 className="text-lg font-bold mb-1 text-foreground">Pipeline Error</h2>
              {/* Strip the "Reasons →" prefix for display; show them separately below */}
              <p className="text-muted-foreground text-sm">
                {state.error.split("Reasons →")[0].trim()}
              </p>
            </div>
          </div>

          {/* Debug panel — shown only when backend sends debug info */}
          {debug && (
            <div className="glass-card p-5 border-yellow-500/20 space-y-4">
              <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold">
                <Bug className="h-4 w-4" />
                Debug Info
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ["Rows after cleaning", debug.n_rows_after_cleaning ?? "—"],
                  ["Features found",      debug.n_features ?? "—"],
                  ["Task type",           debug.problem_type ?? "—"],
                  ["Target column",       debug.target_column ?? "—"],
                  ["Unique target values",debug.y_unique_classes ?? "—"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-foreground">{value}</p>
                  </div>
                ))}
              </div>

              {/* Per-model errors */}
              {debug.model_errors && Object.keys(debug.model_errors).length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">
                    What each model reported
                  </p>
                  <div className="space-y-2">
                    {Object.entries(debug.model_errors).map(([model, msg]) => (
                      <div key={model} className="bg-secondary rounded-lg px-3 py-2 text-xs">
                        <span className="text-foreground font-semibold mr-2">{model}:</span>
                        <span className="text-muted-foreground font-mono">{msg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Common fixes: make sure your CSV has more than 10 clean rows, the target
                column has at least 2 distinct values, and at least one feature column
                contains numeric or categorical data.
              </p>
            </div>
          )}

          <Link to="/iteration" className="inline-block">
            <button className="bg-secondary border border-border rounded-lg px-6 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-secondary/80">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const {
    best_algorithm,
    score,
    results,
    type: problemType,
    warning,
    target_column,
    n_rows,
    n_features,
  } = state;

  const sortedEntries = results
    ? Object.entries(results).sort(([, a], [, b]) => b - a)
    : [];

  const bestAlgoName = sortedEntries[0]?.[0];

  return (
    <DashboardLayout title="Results">
      <div className="space-y-6">

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Model Results</h2>
          <p className="text-muted-foreground text-sm">
            {problemType === "regression"
              ? "Regression task — scored with R²"
              : "Classification task — scored with accuracy"}
          </p>
        </div>

        {/* Dataset metadata */}
        {(n_rows || n_features || target_column) && (
          <div className="flex flex-wrap gap-3">
            {target_column && (
              <span className="bg-secondary text-xs px-3 py-1.5 rounded-full text-muted-foreground">
                Target: <span className="text-foreground font-medium">{target_column}</span>
              </span>
            )}
            {n_rows && (
              <span className="bg-secondary text-xs px-3 py-1.5 rounded-full text-muted-foreground">
                Rows: <span className="text-foreground font-medium">{n_rows.toLocaleString()}</span>
              </span>
            )}
            {n_features && (
              <span className="bg-secondary text-xs px-3 py-1.5 rounded-full text-muted-foreground">
                Features: <span className="text-foreground font-medium">{n_features}</span>
              </span>
            )}
          </div>
        )}

        {/* Warning banner */}
        {warning && (
          <div className="glass-card p-4 border-yellow-500/30 flex items-start gap-3">
            <Info className="h-5 w-5 text-yellow-400 mt-0.5 shrink-0" />
            <p className="text-sm text-yellow-200">{warning}</p>
          </div>
        )}

        {/* Best algorithm card */}
        {best_algorithm && score !== undefined && (
          <div className="glass-card p-6 border-primary/30">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/15">
                <Trophy className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-primary font-semibold uppercase mb-1">
                  Recommended Algorithm
                </p>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {best_algorithm}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Selected based on highest performance on your dataset.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{scoreLabel(problemType)}</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatScore(score, problemType)}
                    </p>
                  </div>
                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Task Type</p>
                    <p className="text-sm font-semibold text-foreground capitalize">
                      {problemType ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison table */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-base font-semibold text-foreground">Algorithm Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left">Algorithm</th>
                  <th className="py-3 px-4 text-left">{scoreLabel(problemType)}</th>
                  <th className="py-3 px-4 text-left">Bar</th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.length > 0 ? (
                  sortedEntries.map(([algo, score_val]) => {
                    const isBest  = algo === bestAlgoName;
                    const barPct  = problemType === "regression"
                      ? Math.max(0, Math.min(100, score_val * 100))
                      : Math.min(100, score_val * 100);

                    return (
                      <tr key={algo} className={`border-b border-border ${isBest ? "bg-primary/5" : ""}`}>
                        <td className="py-3 px-4 flex items-center gap-2">
                          {isBest && <Trophy className="h-4 w-4 text-primary shrink-0" />}
                          <span className={isBest ? "font-semibold text-foreground" : ""}>{algo}</span>
                        </td>
                        <td className="py-3 px-4 font-semibold tabular-nums">
                          {formatScore(score_val, problemType)}
                        </td>
                        <td className="py-3 px-4 w-40">
                          <div className="bg-secondary rounded-full h-1.5 w-full overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full transition-all"
                              style={{ width: `${barPct}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="py-4 px-4 text-muted-foreground" colSpan={3}>
                      No results available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Link to="/iteration">
          <button className="bg-secondary border border-border rounded-lg px-6 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-secondary/80">
            <RefreshCw className="h-4 w-4" />
            Run Again
          </button>
        </Link>

      </div>
    </DashboardLayout>
  );
};

export default ResultPage;
