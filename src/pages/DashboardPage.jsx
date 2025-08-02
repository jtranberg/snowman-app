import Dashboard from '../components/Dashboard';
import WiFiSetupPanel from '../components/WifiSetupPanel';

export default function DashboardPage() {
  return (
    <div>
      <h2>System Dashboard</h2>
      <Dashboard />
      <WiFiSetupPanel />
    </div>
  );
}
