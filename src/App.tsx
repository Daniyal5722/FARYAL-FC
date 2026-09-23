import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { ThemeSettingsProvider } from './contexts/ThemeSettingsContext';
import { ToastProvider } from './contexts/ToastContext';
import { Layout } from './components/Layout';

// Public Pages
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
import { NewsPage } from './pages/News';
import { NewsArticle } from './pages/NewsArticle';
import { NotFound } from './pages/NotFound';

// Admin Pages & Guards
import { AdminGuard } from './components/admin/AdminGuard';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageSEO } from './pages/admin/ManageSEO';
import { ManageTeams } from './pages/admin/ManageTeams';
import { ManagePlayers } from './pages/admin/ManagePlayers';
import { ManageMatches } from './pages/admin/ManageMatches';
import { ManageCompetitions } from './pages/admin/ManageCompetitions';
import { ManageNews } from './pages/admin/ManageNews';
import { ManageGallery } from './pages/admin/ManageGallery';
import { ManageTrophies } from './pages/admin/ManageTrophies';
import { ManageBranding } from './pages/admin/ManageBranding';
import { ManageTheme } from './pages/admin/ManageTheme';
import { ManageHomepage } from './pages/admin/ManageHomepage';
import { ManageNavigation } from './pages/admin/ManageNavigation';
import { ManageMedia } from './pages/admin/ManageMedia';
import { ManageActivity } from './pages/admin/ManageActivity';
import { ManageBackup } from './pages/admin/ManageBackup';
import { ManageLocation } from './pages/admin/ManageLocation';
import { ManageContact } from './pages/admin/ManageContact';
import { ClubSettings } from './pages/admin/ClubSettings';

export default function App() {
  return (
    <FirebaseProvider>
      <ThemeSettingsProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="team" element={<Team />} />
                <Route path="players" element={<Team />} />
                <Route path="standings" element={<Standings />} />
                <Route path="player/:id" element={<PlayerProfile />} />
                <Route path="matches" element={<Matches />} />
                <Route path="formation" element={<Formation />} />
                <Route path="goals" element={<Goals />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="ground" element={<Ground />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="news/:id" element={<NewsArticle />} />
                <Route path="login" element={<Login />} />
                <Route path="registration" element={<Registration />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Protected Admin Console Routes */}
              <Route
                path="admin"
                element={
                  <AdminGuard>
                    <AdminLayout />
                  </AdminGuard>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="seo" element={<ManageSEO />} />
                <Route path="teams" element={<ManageTeams />} />
                <Route path="players" element={<ManagePlayers />} />
                <Route path="matches" element={<ManageMatches />} />
                <Route path="competitions" element={<ManageCompetitions />} />
                <Route path="news" element={<ManageNews />} />
                <Route path="gallery" element={<ManageGallery />} />
                <Route path="trophies" element={<ManageTrophies />} />
                <Route path="branding" element={<ManageBranding />} />
                <Route path="theme" element={<ManageTheme />} />
                <Route path="homepage" element={<ManageHomepage />} />
                <Route path="navigation" element={<ManageNavigation />} />
                <Route path="media" element={<ManageMedia />} />
                <Route path="activity" element={<ManageActivity />} />
                <Route path="backup" element={<ManageBackup />} />
                <Route path="location" element={<ManageLocation />} />
                <Route path="contact" element={<ManageContact />} />
                <Route path="settings" element={<ClubSettings />} />
              </Route>
            </Routes>
          </Router>
        </ToastProvider>
      </ThemeSettingsProvider>
    </FirebaseProvider>
  );
}
