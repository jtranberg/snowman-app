import ScorePanel from './ScorePanel';
import MaintenancePanel from './MaintenancePanel';
import WelcomeBanner from '../components/WelcomeBanner';

export default function Dashboard() {
  return (
    <div className='container'>
      <WelcomeBanner name="Jay" level={3} />
      <ScorePanel />
      <MaintenancePanel />
    </div>
  );
}
