import { useEffect, useMemo, useState } from "react";
import { invoicesApi, vehiclesApi } from "@/lib/api";
import { getCustomerSession } from "@/lib/customerSession";
import { ErrorNotice } from "@/components/ui/error-notice";

export default function CustomerInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");
  const session = getCustomerSession();

  useEffect(() => {
    if (!session?.id) return;
    Promise.all([invoicesApi.getAll(), vehiclesApi.getAll()])
      .then(([invoicesData, vehiclesData]) => {
        const myVehicleNames = new Set(
          vehiclesData
            .filter((vehicle) => vehicle.ownerUserId === session.id)
            .map((vehicle) => `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`),
        );
        setInvoices(invoicesData.filter((invoice) => myVehicleNames.has(invoice.vehicleName)));
      })
      .catch((err) => setError(err.message));
  }, [session?.id]);

  const totalDue = useMemo(
    () =>
      invoices
        .filter((invoice) => invoice.status !== "paid")
        .reduce((sum, invoice) => sum + (invoice.total || 0), 0),
    [invoices],
  );

  return (
    <div className="space-y-5">
      <ErrorNotice message={error} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">My Invoices</h2>
        <p className="text-sm font-medium text-gray-700">Total due: ${totalDue.toFixed(2)}</p>
      </div>
      <div className="space-y-3">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-gray-900">{invoice.vehicleName}</p>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                {invoice.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {invoice.description || "Service invoice"}
            </p>
            <p className="mt-1 text-sm font-medium text-gray-800">
              Total: ${(invoice.total || 0).toFixed(2)}
            </p>
          </div>
        ))}
        {invoices.length === 0 && <p className="text-sm text-slate-500">No invoices found.</p>}
      </div>
    </div>
  );
}
