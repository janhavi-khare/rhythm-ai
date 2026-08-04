import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import Signup from './Signup';
import Onboarding from './Onboarding';
import Dashboard from './pages/Dashboard';
import DailyCheckIn from "./pages/DailyCheckIn";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:userId" element={<Dashboard />} />
          <Route path="/workout-session" element={<Dashboard initialTab="workout-session" />} />
          <Route path="/workout-session/:userId" element={<Dashboard initialTab="workout-session" />} />
          <Route
            path="/checkin/:userId"
            element={<DailyCheckIn />}
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App