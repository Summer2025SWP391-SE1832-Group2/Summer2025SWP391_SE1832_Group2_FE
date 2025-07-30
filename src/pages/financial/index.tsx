import DashboardOverview from "./DashboardOverview";
import ChartSection from "./ChartSection";

export default function FinancialDashboard() {
  return (
    <div className="p-4 space-y-6">
      <DashboardOverview />
      <ChartSection />
      {/* <TransactionTable /> */}
    </div>
  );
}