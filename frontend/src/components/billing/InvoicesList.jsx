import { useState, useMemo } from "react";
import { InvoiceForm } from "./InvoiceForm";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit, Search } from "lucide-react";

export function InvoicesList({
  invoices,
  services,
  vehicles,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = (invoice) => {
    const existing = invoices.find((i) => i.id === invoice.id);
    existing ? onUpdate(invoice) : onAdd(invoice);
  };

  const filteredInvoices = useMemo(
    () =>
      invoices.filter(
        (i) =>
          i.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [invoices, searchQuery],
  );

  const getCustomerEmailByVehicleName = (vehicleName) => {
    const vehicle = (vehicles || []).find((v) => {
      const displayName = `${v.year} ${v.make} ${v.model} (${v.licensePlate})`;
      return displayName === vehicleName;
    });
    return vehicle?.ownerEmail || "";
  };

  const getInvoiceEmailData = (invoice) => {
    const customerEmail = getCustomerEmailByVehicleName(invoice.vehicleName);
    if (!customerEmail) return null;

    const subject = `Invoice ${invoice.id} - Car Service`;
    const issueDate = invoice.issueDate
      ? new Date(invoice.issueDate).toLocaleDateString()
      : "-";
    const body = [
      `Hello ${invoice.customerName || "Customer"},`,
      "",
      "Please find your service invoice details below:",
      `Invoice ID: ${invoice.id}`,
      `Vehicle: ${invoice.vehicleName || "-"}`,
      `Description: ${invoice.description || "-"}`,
      `Amount: $${(invoice.amount || 0).toFixed(2)}`,
      `Tax: $${(invoice.tax || 0).toFixed(2)}`,
      `Total: $${(invoice.total || 0).toFixed(2)}`,
      `Status: ${invoice.status || "-"}`,
      `Issue Date: ${issueDate}`,
      "",
      "Thank you.",
    ].join("\n");

    return { customerEmail, subject, body };
  };

  const buildGmailComposeLink = (invoice) => {
    const emailData = getInvoiceEmailData(invoice);
    if (!emailData) return "";
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailData.customerEmail)}&su=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{ fontFamily: "Phudu, sans-serif", fontWeight: 700 }}
            className="text-4xl text-gray-900"
          >
            Billing
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Manage invoices and payments
          </p>
        </div>
        <InvoiceForm
          services={services}
          vehicles={vehicles}
          onSave={onAdd}
          trigger={
            <Button className="bg-gray-800 text-md text-white hover:bg-gray-900 rounded-4xl px-8 py-5">
              + Create Invoice
            </Button>
          }
        />
      </div>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by customer or vehicle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-0 focus:border-gray-500"
        />
      </div>
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-minimal">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Amount</th>
                <th>Total</th>
                <th>Issue Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <span className="font-medium text-gray-900">
                      {invoice.customerName}
                    </span>
                  </td>
                  <td className="text-gray-700">{invoice.vehicleName}</td>
                  <td className="text-gray-700">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="font-semibold text-gray-900">
                    ${invoice.total.toFixed(2)}
                  </td>
                  <td className="text-gray-700">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : invoice.status === "overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {getInvoiceEmailData(invoice) ? (
                        <a
                          href={buildGmailComposeLink(invoice)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                          title="Compose in Gmail"
                        >
                          Send Email
                        </a>
                      ) : (
                        <span
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-400"
                          title="Customer email not available"
                        >
                          Send Email
                        </span>
                      )}
                      <InvoiceForm
                        invoice={invoice}
                        services={services}
                        vehicles={vehicles}
                        onSave={handleSave}
                        trigger={
                          <button className="p-2 text-gray-600 hover:text-gray-900">
                            <Edit size={16} />
                          </button>
                        }
                      />
                      <button
                        onClick={() => setDeleteId(invoice.id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) onDelete(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
