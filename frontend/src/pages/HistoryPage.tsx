import { DashboardLayout } from "@/components/DashboardLayout";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

const runs = [
  { id: 1, dataset: "sales_data.csv", algorithm: "Random Forest", accuracy: "94.2%", date: "2026-03-25" },
  { id: 2, dataset: "customer_churn.csv", algorithm: "XGBoost", accuracy: "91.8%", date: "2026-03-24" },
  { id: 3, dataset: "housing_prices.csv", algorithm: "Linear Regression", accuracy: "88.5%", date: "2026-03-23" },
  { id: 4, dataset: "fraud_detection.csv", algorithm: "SVM", accuracy: "90.1%", date: "2026-03-22" },
  { id: 5, dataset: "sentiment_data.json", algorithm: "Naive Bayes", accuracy: "85.3%", date: "2026-03-21" },
  { id: 6, dataset: "stock_prices.csv", algorithm: "LSTM", accuracy: "87.6%", date: "2026-03-20" },
];

const HistoryPage = () => {
  return (
    <DashboardLayout title="History">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Run History</h2>
          <p className="text-muted-foreground text-sm">View all previous analysis runs</p>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Dataset", "Algorithm", "Accuracy", "Date", "Action"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr key={run.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{run.dataset}</td>
                    <td className="py-3 px-4 text-muted-foreground">{run.algorithm}</td>
                    <td className="py-3 px-4">
                      <span className="bg-success/15 text-success px-2.5 py-0.5 rounded-md text-xs font-semibold">
                        {run.accuracy}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{run.date}</td>
                    <td className="py-3 px-4">
                      <Link to="/results">
                        <button className="flex items-center gap-1.5 text-primary hover:underline text-xs font-medium">
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
