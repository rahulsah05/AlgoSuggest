import { DashboardLayout } from "@/components/DashboardLayout";
import { Rows3, Columns3, Crosshair, AlertTriangle, Hash, Type, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Number of Rows", value: "10,342", icon: <Rows3 className="h-5 w-5" />, color: "text-primary" },
  { label: "Number of Columns", value: "24", icon: <Columns3 className="h-5 w-5" />, color: "text-accent" },
  { label: "Target Column", value: "price", icon: <Crosshair className="h-5 w-5" />, color: "text-success" },
  { label: "Problem Type", value: "Regression", icon: <Brain className="h-5 w-5" />, color: "text-teal" },
  { label: "Missing Values", value: "127 (1.2%)", icon: <AlertTriangle className="h-5 w-5" />, color: "text-warning" },
  { label: "Numeric Features", value: "18", icon: <Hash className="h-5 w-5" />, color: "text-info" },
  { label: "Categorical Features", value: "6", icon: <Type className="h-5 w-5" />, color: "text-accent" },
];

const AnalysisPage = () => {
  return (
    <DashboardLayout title="Analysis">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Dataset Analysis</h2>
            <p className="text-muted-foreground text-sm">housing_prices.csv</p>
          </div>
          <Link to="/results">
            <button className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
              View Results →
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <span className={`p-2 rounded-lg bg-secondary ${stat.color}`}>{stat.icon}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-0.5">{stat.label}</p>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalysisPage;
