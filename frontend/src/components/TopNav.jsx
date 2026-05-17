import { Link, useLocation, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardCircleRemoveIcon,
  UserGroup03Icon,
  Car04Icon,
  InvoiceIcon,
  CustomerServiceIcon,
  Wrench01Icon,
  Appointment02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { clearAdminSession } from "@/lib/adminSession";

const navItems = [
  { label: "Dashboard", href: "/", icon: DashboardCircleRemoveIcon },
  { label: "People", href: "/users", icon: UserGroup03Icon },
  { label: "Vehicles", href: "/vehicles", icon: Car04Icon },
  { label: "Billing", href: "/billing", icon: InvoiceIcon },
  { label: "Services", href: "/services", icon: CustomerServiceIcon },
  { label: "Maintenance", href: "/maintenance", icon: Wrench01Icon },
  { label: "Appointments", href: "/appointments", icon: Appointment02Icon },
];

export function TopNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="max-w-[1400px] mx-auto px-8 py-3 flex items-center justify-between">
        <Link to="/" className="mr-6 flex items-center gap-2">
          <span
            style={{ fontFamily: "Phudu, sans-serif", fontWeight: 700 }}
            className=" text-4xl"
          >
            <span className="text-gray-900">Auto</span>
            <span className="text-[#E9762B]">Serve</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 rounded-4xl bg-gray-100 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "nav-pill flex items-center gap-2 px-4 py-2.5",
                  isActive ? "nav-pill-active" : "nav-pill-inactive",
                )}
              >
                <HugeiconsIcon icon={Icon} size={18} strokeWidth={1.5} />
                <span className="hidden sm:inline text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="ml-4">
          <button
            onClick={() => {
              clearAdminSession();
              navigate("/login");
            }}
            className="rounded-4xl border cursor-pointer border-gray-900 bg-red-500 px-6 py-2.5 text-sm font-semibold text-white"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
