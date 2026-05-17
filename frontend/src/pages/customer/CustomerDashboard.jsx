import { useEffect, useMemo, useState } from "react";
import { appointmentsApi, invoicesApi, vehiclesApi } from "@/lib/api";
import { getCustomerSession } from "@/lib/customerSession";
import { ErrorNotice } from "@/components/ui/error-notice";

export default function CustomerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");
  const session = getCustomerSession();

  useEffect(() => {
    if (!session?.id) return;
    Promise.all([vehiclesApi.getAll(), appointmentsApi.getAll(), invoicesApi.getAll()])
      .then(([vehiclesData, appointmentsData, invoicesData]) => {
        const myVehicles = vehiclesData.filter((v) => v.ownerUserId === session.id);
        const myVehicleIds = new Set(myVehicles.map((v) => v.id));
        const myVehicleNames = new Set(myVehicles.map((v) => `${v.year} ${v.make} ${v.model} (${v.licensePlate})`));

        setVehicles(myVehicles);
        setAppointments(appointmentsData.filter((a) => myVehicleIds.has(a.vehicleId)));
        setInvoices(invoicesData.filter((i) => myVehicleNames.has(i.vehicleName)));
      })
      .catch((err) => setError(err.message));
  }, [session?.id]);

  const pendingInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.status !== "paid"),
    [invoices],
  );

  return (
    <div className="space-y-6">
      <ErrorNotice message={error} />
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">My Vehicles</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{vehicles.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Appointments</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{appointments.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Pending Invoices</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{pendingInvoices.length}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
        <div className="mt-4 space-y-3">
          {appointments.slice(0, 5).map((appointment) => (
            <div key={appointment.id} className="rounded-xl bg-gray-100 p-3">
              <p className="font-medium text-gray-900">{appointment.serviceType}</p>
              <p className="text-sm text-gray-600">{appointment.vehicleName}</p>
            </div>
          ))}
          {appointments.length === 0 && (
            <p className="text-sm text-slate-500">No appointments yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
