import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { Link } from "react-router-dom";

const IterationPage = () => {
  const [outputCol, setOutputCol] = useState("price");
  const [priority, setPriority] = useState("accuracy");
  const [algoType, setAlgoType] = useState("auto");

  const columns = ["price", "category", "sales", "revenue", "quantity", "rating"];
  const algoTypes = [
    { value: "auto", label: "Auto Select" },
    { value: "tree", label: "Tree-Based" },
    { value: "linear", label: "Linear Models" },
    { value: "ensemble", label: "Ensemble Methods" },
    { value: "neural", label: "Neural Networks" },
  ];

  return (
    <DashboardLayout title="Iteration">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">New Iteration</h2>
          <p className="text-muted-foreground text-sm">Configure and re-run your analysis</p>
        </div>

        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Output Column</label>
            <select value={outputCol} onChange={(e) => setOutputCol(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              {columns.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
            <div className="grid grid-cols-2 gap-3">
              {["accuracy", "speed"].map((p) => (
                <button key={p} onClick={() => setPriority(p)}
                  className={`rounded-lg py-2.5 text-sm font-medium border transition-colors capitalize ${
                    priority === p
                      ? "bg-primary/15 border-primary text-primary"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  }`}>
                  {p === "accuracy" ? "🎯 Accuracy" : "⚡ Speed"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Algorithm Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {algoTypes.map((a) => (
                <button key={a.value} onClick={() => setAlgoType(a.value)}
                  className={`rounded-lg py-2.5 text-sm font-medium border transition-colors ${
                    algoType === a.value
                      ? "bg-primary/15 border-primary text-primary"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  }`}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <Link to="/results">
            <button className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors mt-2">
              Run Analysis
            </button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IterationPage;
