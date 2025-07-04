import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Home from '../pages/Home/Home';
import Dashboard from '../pages/Dashboard/Dashboard';
import PlayerList from '../pages/Player/PlayerList/PlayerList';
import PlayerDetailPage from '../pages/Player/PlayerDetailPage';
import TeamList from '../pages/Teams/TeamList/TeamList';
import TeamDetailPage from '../pages/Teams/TeamDetail/TeamDetailPage';
import MatchList from '../pages/Matches/MatchList/MatchList';
import MatchDetailPage from '../pages/Matches/MatchDetailPage';
import CreateMatch from '../pages/Matches/CreateMatch/CreateMatch';
import PlayerProfile from '../pages/Profile/PlayerProfile';
import ChangePasswordPage from '../pages/Profile/ChangePassword/ChangePasswordPage';
import Navbar from './Navbar/Navbar';
import TurnuvaPage from '../pages/Turnuva/TurnuvaPage';
import SendOfferPage from '../pages/Sender/SendOfferPage';
import MyOffersPage from '../pages/Sender/MyOffers/MyOffersPage';
import CaptainOffersPage from '../pages/Sender/Offers/CaptainOffersPage';
import MatchStatsPage from '../pages/MatchStat/MatchStatsPage';
import EditProfilePage from '../pages/Profile/EditPlayer/EditProfilePage';
import MatchReviewsPage from '../pages/Reviews/MatchReviewsPage';
import PlayersAdminPage from '../pages/Dashboard/Admin/PlayersAdminPage';
import TeamsAdminPage from '../pages/Dashboard/Admin/TeamsAdminPage';
import MatchesAdminPage from '../pages/Dashboard/Admin/MatchesAdminPage';
import OffersAdminPage from '../pages/Dashboard/Admin/OffersAdminPage';
import ReviewsAdminPage from '../pages/Dashboard/Admin/ReviewsAdminPage';
import MatchStatsAdminPage from '../pages/Dashboard/Admin/MatchStatsAdminPage';
import TeamMembersAdminPage from '../pages/Dashboard/Admin/TeamMembersAdminPage';
import AttendanceAdminPage from '../pages/Dashboard/Admin/AttendanceAdminPage';
import UsersAdminPage from '../pages/Dashboard/Admin/UsersAdminPage';
import TournamentAdminPage from '../pages/Dashboard/Admin/TournamentAdminPage';




const AnimatedRoutes = () => {
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setRole(localStorage.getItem('role'));
  }, []);

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.4,
  };

  const motionWrap = (component: React.ReactNode) => (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {component}
    </motion.div>
  );

  return (
  <>
    {token && <Navbar />} {/* Navbar sadece login olmuş kullanıcılar için */}
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {!token ? (
          <>
            <Route path="/login" element={motionWrap(<Login />)} />
            <Route path="/register" element={motionWrap(<Register />)} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/" element={role === 'Admin' ? <Navigate to="/dashboard" /> : motionWrap(<Home />)} />
            <Route path="/dashboard" element={role === 'Admin' ? motionWrap(<Dashboard />) : <Navigate to="/" />} />
            <Route path="/players" element={motionWrap(<PlayerList />)} />
            <Route path="/players/:id" element={motionWrap(<PlayerDetailPage />)} />
            <Route path="/teams" element={motionWrap(<TeamList />)} />
            <Route path="/teams/:id" element={motionWrap(<TeamDetailPage />)} />
            <Route path="/matches" element={motionWrap(<MatchList />)} />
            <Route path="/matches/:matchId" element={motionWrap(<MatchDetailPage />)} />
            <Route path="/matches/create" element={motionWrap(<CreateMatch />)} />
            <Route path="/profile" element={motionWrap(<PlayerProfile />)} />
            <Route path="/change-password" element={motionWrap(<ChangePasswordPage />)} />
            <Route path="/Turnuva" element={motionWrap(<TurnuvaPage />)} />
            <Route path="/send-offer" element={motionWrap(<SendOfferPage />)} />
            <Route path="/send-offer/:receiverId" element={motionWrap(<SendOfferPage />)} />
            <Route path="/my-offers" element={motionWrap(<MyOffersPage />)} />
            <Route path="/captain-offers" element={motionWrap(<CaptainOffersPage />)} />
            <Route path="/matches/:matchId/stats" element={motionWrap(<MatchStatsPage />)} />
            <Route path="/edit-profile" element={motionWrap(<EditProfilePage />)} />
            <Route path="/match-reviews/:matchId" element={<MatchReviewsPage />} />
            <Route path="/admin/players" element={<PlayersAdminPage />} />
      <Route path="/admin/teams" element={<TeamsAdminPage />} />
      <Route path="/admin/matches" element={<MatchesAdminPage />} />
      <Route path="/admin/offers" element={<OffersAdminPage />} />
      <Route path="/admin/reviews" element={<ReviewsAdminPage />} />
      <Route path="/admin/stats" element={<MatchStatsAdminPage />} />
      <Route path="/admin/members" element={<TeamMembersAdminPage />} />
      <Route path="/admin/attendance" element={<AttendanceAdminPage />} />
      <Route path="/admin/users" element={<UsersAdminPage />} />
      <Route path="/admin/tournament" element={<TournamentAdminPage />} />



            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  </>
);

};

export default AnimatedRoutes;
