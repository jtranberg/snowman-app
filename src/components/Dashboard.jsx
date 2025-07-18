import ScorePanel from './ScorePanel';
import MaintenancePanel from './MaintenancePanel';

export default function Dashboard() {
  return (
    <div className='container'>
      <ScorePanel />
      <MaintenancePanel />
    </div>
  );
}
