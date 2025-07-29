import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import LearnPage from './pages/LearnPage';
import Header from './components/Header';
import About from './pages/About';
import Contact from './pages/Contact';
import MyScore from './pages/MyScore';


export default function App() {
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
      </Routes>
    </Router>
  );
}
