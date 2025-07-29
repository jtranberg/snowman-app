import ScorePanel from './ScorePanel';
import MaintenancePanel from './MaintenancePanel';
import WelcomeBanner from '../components/WelcomeBanner';
import SimulationPanel from './SimulationPanel';
import LatestSensorReading from '../components/LatestSensorReading'; 

// const mockSimulationData = {
//   ambient_temp: 25,
//   oxygen_before: 21,
//   oxygen_added: 9,
//   oxygen_after: 30,
//   temp_after_manifold: 10,
//   cooled_temp: -15,
//   condensate_L: 4.25,
//   co2_removed_tons: 0.124,
//   minerals_captured_kg: 0.36,
// };

export default function Dashboard() {
  return (
    <div className='container'>
      <WelcomeBanner name="Jay" level={3} />
      <ScorePanel />
      <LatestSensorReading /> 
      <MaintenancePanel />
      {/* <SimulationPanel data={mockSimulationData} /> */}
      
    </div>
  );
}
