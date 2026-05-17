import { useState, useMemo } from "react";
import { ServiceForm } from "./ServiceForm";
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

export function ServicesList({
  services,
  vehicles,
  appointments,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = (s) => {
    const existing = services.find((x) => x.id === s.id);
    existing ? onUpdate(s) : onAdd(s);
  };

  const filteredServices = useMemo(
    () =>
      services.filter(
        (s) =>
          s.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [services, searchQuery],
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{ fontFamily: "Phudu, sans-serif", fontWeight: 700 }}
            className="text-4xl text-gray-900"
          >
            Services
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Track all service records
          </p>
        </div>
        <ServiceForm
          vehicles={vehicles}
          appointments={appointments}
          onSave={onAdd}
          trigger={
            <Button className="bg-gray-800 text-md text-white hover:bg-gray-900 rounded-4xl px-8 py-5">
              + Add Service
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
          placeholder="Search by service, vehicle, or description..."
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
                <th>Service Type</th>
                <th>Vehicle</th>
                <th>Description</th>
                <th>Cost</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((s) => (
                <tr key={s.id}>
                  <td>
                    <span className="font-medium text-gray-900">
                      {s.serviceType}
                    </span>
                  </td>
                  <td className="text-gray-700">{s.vehicleName}</td>
                  <td className="text-gray-700 text-sm">{s.description}</td>
                  <td className="font-semibold text-gray-900">
                    ${s.cost.toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        s.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : s.status === "in-progress"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ServiceForm
                        service={s}
                        vehicles={vehicles}
                        appointments={appointments}
                        onSave={handleSave}
                        trigger={
                          <button className="p-2 text-gray-600 hover:text-gray-900">
                            <Edit size={16} />
                          </button>
                        }
                      />
                      <button
                        onClick={() => setDeleteId(s.id)}
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
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
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
