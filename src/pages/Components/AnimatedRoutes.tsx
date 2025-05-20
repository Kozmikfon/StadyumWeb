import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Dashboard from '../Dashboard/Dashboard';
import PlayerList from '../Player/PlayerList/PlayerList';
import PlayerDetailPage from '../Player/PlayerDetailPage';
import TeamList from '../Teams/TeamList/TeamList';
import TeamDetailPage from '../Teams/TeamDetail/TeamDetailPage';
import MatchList from '../Matches/MatchList/MatchList';
import MatchDetailPage from '../Matches/MatchDetailPage';
import CreateMatch from '../Matches/CreateMatch/CreateMatch';
import PlayerProfile from '../Profile/PlayerProfile';
import ChangePasswordPage from '../Profile/ChangePassword/ChangePasswordPage';
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
    ease: 'anticipate',
    duration: 0.4,
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {!token ? (
          <>
            <Route path="/login" element={
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <Login />
              </motion.div>} />
            <Route path="/register" element={
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <Register />
              </motion.div>} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/" element={
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                {role === 'Admin' ? <Navigate to="/dashboard" /> : <Home />}
              </motion.div>} />

            <Route path="/dashboard" element={
              role === 'Admin' ? (
                <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                  <Dashboard />
                </motion.div>
              ) : <Navigate to="/" />
            } />

            <Route path="/players" element={
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <PlayerList />
              </motion.div>} />
            <Route path="/players/:id" element={
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <PlayerDetailPage />
              </motion.div>} />

            <Route path="/teams" element={
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <TeamList />
              </motion.div>} />
            <Route path="/teams/:id" element={
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <TeamDetailPage />
              </motion.div>} />

            <Route path="/matches" element={
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <MatchList />
              </motion.div>} />
            <Route path="/matches/:id" element={
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <MatchDetailPage />
              </motion.div>} />
            <Route path="/matches/create" element={
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <CreateMatch />
              </motion.div>} />

            <Route path="/profile" element={
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <PlayerProfile />
              </motion.div>} />
            <Route path="/change-password" element={
              <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <ChangePasswordPage />
              </motion.div>} />

            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
