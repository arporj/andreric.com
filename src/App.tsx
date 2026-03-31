import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Portfolio } from './pages/Portfolio';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { SiteDataProvider } from './contexts/SiteContext';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <SiteDataProvider>
            <Portfolio />
          </SiteDataProvider>
        } />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
