import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import LearnPage from './pages/LearnPage';
import Header from './components/Header';
import About from './pages/About';
import Contact from './pages/Contact';
import MyScore from './pages/MyScore';
import SecurityModal from './components/SecurityModal';
import IntroModal from './components/IntroModal';
import MissionLog from './pages/MissionLog';

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const access = sessionStorage.getItem("accessGranted");
    const intro = sessionStorage.getItem("introDismissed");

    if (access === "true") {
      setUnlocked(true);
      if (!intro) {
        setShowIntro(true);
      }
    }
  }, []);

  const handleUnlock = () => {
    sessionStorage.setItem("accessGranted", "true");
    setUnlocked(true);

    if (!sessionStorage.getItem("introDismissed")) {
      setShowIntro(true);
    }
  };

  const handleIntroDismiss = () => {
    sessionStorage.setItem("introDismissed", "true");
    setShowIntro(false);
  };

  if (!unlocked) {
    return <SecurityModal onUnlock={handleUnlock} />;
  }

  if (showIntro) {
    return <IntroModal onDismiss={handleIntroDismiss} />;
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/score" element={<MyScore />} />
        <Route path="/mission-log" element={<MissionLog />} />

      </Routes>
    </Router>
  );
}
