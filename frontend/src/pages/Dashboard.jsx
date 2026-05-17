import { useMemo, useEffect, useState } from "react";
import {
  usersApi,
  vehiclesApi,
  servicesApi,
  maintenanceApi,
  invoicesApi,
  appointmentsApi,
} from "@/lib/api";
import { Users, Car, Wrench, Calendar, Clock } from "lucide-react";
import { ErrorNotice } from "@/components/ui/error-notice";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      usersApi.getAll(),
      vehiclesApi.getAll(),
      servicesApi.getAll(),
      maintenanceApi.getAll(),
      invoicesApi.getAll(),
      appointmentsApi.getAll(),
    ])
      .then(
        ([
          usersData,
          vehiclesData,
          servicesData,
          maintenancesData,
          invoicesData,
          appointmentsData,
        ]) => {
          setUsers(usersData);
          setVehicles(vehiclesData);
          setServices(servicesData);
          setMaintenances(maintenancesData);
          setInvoices(invoicesData);
          setAppointments(appointmentsData);
        },
      )
      .catch((error) => setError(error.message));
  }, []);

  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      totalVehicles: vehicles.length,
      pendingServices: services.filter((s) => s.status !== "completed").length,
      overdueMaintenances: maintenances.filter((m) => m.status === "overdue")
        .length,
      unpaidInvoices: invoices.filter((i) => i.status !== "paid").length,
      upcomingAppointments: appointments.filter((a) => a.status === "scheduled")
        .length,
    }),
    [appointments, invoices, maintenances, services, users, vehicles],
  );

  const statCards = [
    {
      title: "Employee",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-[#E9762B]/80",
      cardBg: "bg-[#E9762B]/10 border-[#E9762B]/30",
    },
    {
      title: "Hirings",
      value: stats.totalVehicles,
      icon: Car,
      color: "bg-[#E9762B]/80",
      cardBg: "bg-[#E9762B]/10 border-[#E9762B]/30",
    },
    {
      title: "Projects",
      value: stats.pendingServices,
      icon: Wrench,
      color: "bg-[#E9762B]/80",
      cardBg: "bg-[#E9762B]/10 border-[#E9762B]/30",
    },
  ];

  return (
    <div className="space-y-8">
      <ErrorNotice message={error} />
      <div className="flex items-end justify-between">
        <div>
          <h1
            style={{ fontFamily: "Phudu, sans-serif", fontWeight: 700 }}
            className="text-4xl text-gray-900"
          >
            Welcome in, AutoServe
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your service management overview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`stat-card ${stat.cardBg}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="stat-label text-sm font-semibold text-gray-700">
                    {stat.title}
                  </p>
                  <p className="stat-number mt-1 text-3xl font-extrabold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon
                    size={20}
                    className="text-gray-800"
                    strokeWidth={1.75}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card border-indigo-200 bg-indigo-50/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Recent Services
              </h3>
              <p className="mt-1 text-xs font-medium text-gray-600">
                Latest work completed
              </p>
            </div>
            <Wrench size={20} className="text-indigo-500" strokeWidth={1.75} />
          </div>
          <div className="space-y-3">
            {services.slice(0, 4).map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between border-b border-indigo-100 py-2 last:border-b-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {service.serviceType}
                  </p>
                  <p className="text-xs font-medium text-gray-600">
                    {service.vehicleName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    ${service.cost}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full mt-1 inline-block ${
                      service.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : service.status === "in-progress"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card border-sky-200 bg-sky-50/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Upcoming Appointments
              </h3>
              <p className="mt-1 text-xs font-medium text-gray-600">
                Next scheduled services
              </p>
            </div>
            <Calendar size={20} className="text-sky-500" strokeWidth={1.75} />
          </div>
          <div className="space-y-3">
            {appointments
              .filter((a) => a.status === "scheduled")
              .slice(0, 4)
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between border-b border-sky-100 py-2 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {appointment.customerName}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                      <Clock size={12} />
                      {new Date(
                        appointment.appointmentDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                    {appointment.serviceType}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
