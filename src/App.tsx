import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Team } from './pages/Team';
import { Matches } from './pages/Matches';
import { Formation } from './pages/Formation';
import { Goals } from './pages/Goals';
import { Gallery } from './pages/Gallery';
import { Ground } from './pages/Ground';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Standings } from './pages/Standings';
import { PlayerProfile } from './pages/PlayerProfile';
import { Registration } from './pages/Registration';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageTeams } from './pages/admin/ManageTeams';
import { ManagePlayers } from './pages/admin/ManagePlayers';
import { ManageMatches } from './pages/admin/ManageMatches';
import { ManageCompetitions } from './pages/admin/ManageCompetitions';
import { ManageNews } from './pages/admin/ManageNews';
import { ManageGallery } from './pages/admin/ManageGallery';
import { ManageTrophies } from './pages/admin/ManageTrophies';
import { ClubSettings } from './pages/admin/ClubSettings';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="team" element={<Team />} />
          <Route path="standings" element={<Standings />} />
          <Route path="player/:id" element={<PlayerProfile />} />
          <Route path="matches" element={<Matches />} />
          <Route path="formation" element={<Formation />} />
          <Route path="goals" element={<Goals />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="ground" element={<Ground />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />
          
          {/* Admin Routes */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/teams" element={<ManageTeams />} />
          <Route path="admin/players" element={<ManagePlayers />} />
          <Route path="admin/matches" element={<ManageMatches />} />
          <Route path="admin/competitions" element={<ManageCompetitions />} />
          <Route path="admin/news" element={<ManageNews />} />
          <Route path="admin/gallery" element={<ManageGallery />} />
          <Route path="admin/trophies" element={<ManageTrophies />} />
          <Route path="admin/settings" element={<ClubSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}
