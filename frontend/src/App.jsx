import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Profile from "./pages/Profile/Profile";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword"; // ✅ add this

const routes = (
  <Router>
    <Routes>
      <Route path="/dashboard" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/user/:userId/edit" element={<Profile />} />

      <Route path="/forgot-password" element={<ForgotPassword />} /> {/* also add this */}
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  </Router>
);

const App = () => {
  return <div>{routes}</div>;
};

export default App;
