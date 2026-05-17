import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { clearCustomerSession, getCustomerSession } from "@/lib/customerSession";

const links = [
  { to: "/customer", label: "Overview", end: true },
  { to: "/customer/vehicles", label: "My Vehicles" },
  { to: "/customer/appointments", label: "My Appointments" },
  { to: "/customer/invoices", label: "My Invoices" },
];

export function CustomerLayout() {
  const navigate = useNavigate();
  const session = getCustomerSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-[1450px] mx-auto px-8 py-4 flex items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-5">
            <Link to="/customer" className="shrink-0 flex items-center">
              <span
                style={{ fontFamily: "Phudu, sans-serif", fontWeight: 700 }}
                className="text-3xl"
              >
                <span className="text-gray-900">Auto</span>
                <span className="text-[#E9762B]">Serve</span>
              </span>
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-gray-900">Customer Portal</h1>
              <p className="text-sm text-gray-600">{session.name} ({session.phone})</p>
            </div>
          </div>
          <button
            onClick={() => {
              clearCustomerSession();
              navigate("/login");
            }}
            className="shrink-0 rounded-2xl bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-[1450px] mx-auto px-8 py-8">
        <nav className="mb-7 flex flex-wrap gap-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Outlet />
      </div>
    </main>
  );
}
