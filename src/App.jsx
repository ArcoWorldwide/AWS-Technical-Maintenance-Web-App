import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import Login from "./pages/auth/Login";
//import Login from "./pages/auth/Login";
import CreatePassword from "./pages/auth/CreatePassword";

import SuperAdminLayout from "./layouts/SuperAdminLayout";
import ProtectedRoute from "./components/reusables/ProtectedRoute";
import Dashboard from "./pages/superadmin/Dashboard";
import Maintenance from "./pages/superadmin/Maintenance";
import Fleet from "./pages/superadmin/Fleet";
import Battery from "./pages/superadmin/Battery";
import Reports from "./pages/superadmin/Reports";
import Users from "./pages/superadmin/Users";
import Activities from "./pages/superadmin/Activities";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createpassword" element={<CreatePassword />} />
        {/* <Route path="/signup" element={<Signup />} /> */}

        {/* PROTECTED DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="fleet" element={<Fleet />} />
          <Route path="battery" element={<Battery />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
          <Route path="activities" element={<Activities/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
