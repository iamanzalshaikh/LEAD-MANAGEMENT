import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./component/Nav";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./admin/AdminDashboard";
import SalesmanDashboard from "./sales/SalesmanDashboard";
import MyLead from "./sales/MyLead";
import Add from "./admin/Add";
import LeadDetails from "./admin/LeadDetails";
import LeadList from "./admin/LeadList";
import SalespersonPerformance from "./admin/SalespersonPerformance";
import SalesLeadDetails from "./sales/LeadDetails";
import SalesLeadEdit from "./sales/EditLead";
import { userDataContext } from "./context/userContext";


// ✅ Define route wrappers outside App so they don’t recreate on every render
const AdminRoute = ({ userdata, children }) => {
  if (!userdata) return <Navigate to="/login" replace />;
  if (userdata.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

const ProtectedRoute = ({ userdata, role, children }) => {
  if (!userdata) return <Navigate to="/login" replace />;
  if (role && userdata.role !== role) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ userdata, children }) => {
  if (userdata) {
    if (userdata.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (userdata.role === "salesman") return <Navigate to="/sales/dashboard" replace />;
  }
  return children;
};


const App = () => {
  const { userdata } = useContext(userDataContext);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Only show Nav when logged in */}
      {userdata && <Nav />}

      <div className={userdata ? "pt-16" : ""}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<PublicRoute userdata={userdata}><Signup /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute userdata={userdata}><Login /></PublicRoute>} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminRoute userdata={userdata}><AdminDashboard /></AdminRoute>} />
          <Route path="/add" element={<AdminRoute userdata={userdata}><Add /></AdminRoute>} />
          <Route path="/leadlist" element={<AdminRoute userdata={userdata}><LeadList /></AdminRoute>} />
          <Route path="/leaddetails/:id" element={<AdminRoute userdata={userdata}><LeadDetails /></AdminRoute>} />
          <Route path="/salesperson" element={<AdminRoute userdata={userdata}><SalespersonPerformance /></AdminRoute>} />

          {/* Salesman routes */}
          <Route path="/sales/dashboard" element={<ProtectedRoute userdata={userdata} role="salesman"><SalesmanDashboard /></ProtectedRoute>} />
          <Route path="/sales/leads" element={<ProtectedRoute userdata={userdata} role="salesman"><MyLead /></ProtectedRoute>} />
          <Route path="/sales/leads/:id" element={<ProtectedRoute userdata={userdata} role="salesman"><SalesLeadDetails /></ProtectedRoute>} />
          <Route path="/sales/leads/edit/:id" element={<ProtectedRoute userdata={userdata} role="salesman"><SalesLeadEdit /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
