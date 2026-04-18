import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import {
  Database,
  BarChart3,
  Clock,
  CheckCircle,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Overview
          </h2>
          <p className="text-muted-foreground text-sm">
            Your ML pipeline at a glance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Datasets Uploaded" value={12} icon={<Database className="h-5 w-5" />} color="text-primary" />
          <StatCard label="Models Trained" value={34} icon={<BarChart3 className="h-5 w-5" />} color="text-accent" />
          <StatCard label="Avg Accuracy" value="92.4%" icon={<TrendingUp className="h-5 w-5" />} color="text-success" />
          <StatCard label="Recent Runs" value={8} icon={<Clock className="h-5 w-5" />} color="text-teal" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">
              Recent Activity
            </h3>

            <div className="space-y-3">
              {[
                { name: "sales_data.csv", algo: "Random Forest", acc: "94.2%", time: "2h ago" },
                { name: "customer_churn.csv", algo: "XGBoost", acc: "91.8%", time: "5h ago" },
                { name: "housing_prices.csv", algo: "Linear Regression", acc: "88.5%", time: "1d ago" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.algo}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{item.acc}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-3">

              <button
                onClick={() => navigate("/upload")}
                className="bg-secondary hover:bg-secondary/80 border border-border rounded-lg p-4 text-center transition-colors"
              >
                <Database className="h-6 w-6 text-primary mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">
                  Upload Dataset
                </span>
              </button>

              <button
                onClick={() => navigate("/result")}
                className="bg-secondary hover:bg-secondary/80 border border-border rounded-lg p-4 text-center transition-colors"
              >
                <BarChart3 className="h-6 w-6 text-accent mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">
                  View Results
                </span>
              </button>

              <button
                onClick={() => navigate("/history")}
                className="bg-secondary hover:bg-secondary/80 border border-border rounded-lg p-4 text-center transition-colors"
              >
                <Clock className="h-6 w-6 text-teal mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">
                  Run History
                </span>
              </button>

              <button
                onClick={() => navigate("/iteration")}
                className="bg-secondary hover:bg-secondary/80 border border-border rounded-lg p-4 text-center transition-colors"
              >
                <Activity className="h-6 w-6 text-warning mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">
                  New Iteration
                </span>
              </button>

            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;