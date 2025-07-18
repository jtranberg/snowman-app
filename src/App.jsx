import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import LearnPage from './pages/LearnPage';
import Header from './components/Header';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/learn" element={<LearnPage />} />
      </Routes>
    </Router>
  );
}
