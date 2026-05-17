import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { TopNav } from "./components/TopNav";
import { CustomerLayout } from "./components/customer/CustomerLayout";
import Dashboard from "./pages/Dashboard";
import AppointmentsPage from "./pages/Appointments";
import UsersPage from "./pages/Users";
import VehiclesPage from "./pages/Vehicles";
import ServicesPage from "./pages/Services";
import MaintenancePage from "./pages/Maintenance";
import BillingPage from "./pages/Billing";
import LoginPage from "./pages/Login";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerVehicles from "./pages/customer/CustomerVehicles";
import CustomerAppointments from "./pages/customer/CustomerAppointments";
import CustomerInvoices from "./pages/customer/CustomerInvoices";
import { getAdminSession } from "./lib/adminSession";

export default function App() {
  const { pathname } = useLocation();
  const isLoginPage = pathname === "/login";
  const isCustomerPage = pathname.startsWith("/customer");
  const isAdminAuthenticated = Boolean(getAdminSession());

  return (
    <>
      {!isLoginPage && !isCustomerPage && <TopNav />}
      <main
        className={
          isLoginPage || isCustomerPage
            ? "min-h-screen bg-white"
            : "pt-20 min-h-screen bg-white"
        }
      >
        <div className={isLoginPage || isCustomerPage ? "" : "max-w-[1400px] mx-auto px-8 py-12"}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={isAdminAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/appointments" element={isAdminAuthenticated ? <AppointmentsPage /> : <Navigate to="/login" replace />} />
            <Route path="/users" element={isAdminAuthenticated ? <UsersPage /> : <Navigate to="/login" replace />} />
            <Route path="/vehicles" element={isAdminAuthenticated ? <VehiclesPage /> : <Navigate to="/login" replace />} />
            <Route path="/services" element={isAdminAuthenticated ? <ServicesPage /> : <Navigate to="/login" replace />} />
            <Route path="/maintenance" element={isAdminAuthenticated ? <MaintenancePage /> : <Navigate to="/login" replace />} />
            <Route path="/billing" element={isAdminAuthenticated ? <BillingPage /> : <Navigate to="/login" replace />} />
            <Route path="/customer" element={<CustomerLayout />}>
              <Route index element={<CustomerDashboard />} />
              <Route path="vehicles" element={<CustomerVehicles />} />
              <Route path="appointments" element={<CustomerAppointments />} />
              <Route path="invoices" element={<CustomerInvoices />} />
            </Route>
          </Routes>
        </div>
      </main>
    </>
  );
}
