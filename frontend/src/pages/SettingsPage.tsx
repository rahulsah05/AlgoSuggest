import { DashboardLayout } from "@/components/DashboardLayout";

const SettingsPage = () => {
  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Settings</h2>
          <p className="text-muted-foreground text-sm">Manage your account preferences</p>
        </div>

        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Display Name</label>
            <input type="text" defaultValue="John Doe"
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input type="email" defaultValue="john@example.com"
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Default Priority</label>
            <select className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option>Accuracy</option>
              <option>Speed</option>
            </select>
          </div>
          <button className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
