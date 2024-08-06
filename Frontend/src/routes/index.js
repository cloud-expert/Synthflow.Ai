import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SignUp from '../pages/auth/signup';
import Signin from '../pages/auth/signin';
import ForgotPassword from "../pages/auth/forgot-password"
import Dashboard from '../pages/dashboard';
import Loader from "../components/common/Loader"
import { ProtectedRoute, PublicRoute } from "./custom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const RootRouter = () => {
  const isAuthLoading = useSelector(state => state.auth.isAuthLoading);
  
  return (
    isAuthLoading ? <Loader /> :
     <Router>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Routes>
        <Route index element={<Navigate to="auth/signin" />} />
          <Route path="auth">    
            <Route path="signin" element={<PublicRoute element={<Signin />} />} />
            <Route path="signup" element={<PublicRoute element={<SignUp />} />} />
            <Route path="forgot-password" element={<PublicRoute element={<ForgotPassword />} />} />
          </Route>
        <Route path="dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="*" element={<Navigate to="auth/signin" />} />
      </Routes>
      </GoogleOAuthProvider>
    </Router>
  );
}

export default RootRouter;
