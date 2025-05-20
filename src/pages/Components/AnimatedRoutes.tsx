import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register';
import PlayerList from '../Player/PlayerList/PlayerList';
import PlayerDetailPage from '../Player/PlayerDetailPage';
import TeamList from '../Teams/TeamList/TeamList';
import TeamDetailPage from '../Teams/TeamDetail/TeamDetailPage';
import MatchList from '../Matches/MatchList/MatchList';
import MatchDetailPage from '../Matches/MatchDetailPage';
import PlayerProfile from '../Profile/PlayerProfile';
import ChangePasswordPage from '../Profile/ChangePassword/ChangePasswordPage';
import CreateMatch from '../Matches/CreateMatch/CreateMatch';
import Dashboard from '../Dashboard/Dashboard';
import Home from '../Home/Home';



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
            <Route path="/matches/:id" element={motionWrap(<MatchDetailPage />)} />
            <Route path="/matches/create" element={motionWrap(<CreateMatch />)} />
            <Route path="/profile" element={motionWrap(<PlayerProfile />)} />
            <Route path="/change-password" element={motionWrap(<ChangePasswordPage />)} />
           
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
