import { useState, useMemo } from "react";
import { MaintenanceForm } from "./MaintenanceForm";
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

export function MaintenanceList({
  maintenances,
  vehicles,
  services,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = (m) => {
    const existing = maintenances.find((x) => x.id === m.id);
    existing ? onUpdate(m) : onAdd(m);
  };

  const filteredMaintenances = useMemo(
    () =>
      maintenances.filter(
        (m) =>
          m.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [maintenances, searchQuery],
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{ fontFamily: "Phudu, sans-serif", fontWeight: 700 }}
            className="text-4xl text-gray-900"
          >
            Maintenance
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Manage maintenance schedule
          </p>
        </div>
        <MaintenanceForm
          vehicles={vehicles}
          services={services}
          onSave={onAdd}
          trigger={
            <Button className="bg-gray-800 text-md text-white hover:bg-gray-900 rounded-4xl px-8 py-5">
              + Add Reminder
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
          placeholder="Search by service or vehicle..."
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
                <th>Due Date</th>
                <th>Due Mileage</th>
                <th>Priority</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaintenances.map((m) => (
                <tr key={m.id}>
                  <td>
                    <span className="font-medium text-gray-900">
                      {m.serviceType}
                    </span>
                  </td>
                  <td className="text-gray-700">{m.vehicleName}</td>
                  <td className="text-gray-700">
                    {new Date(m.dueDate).toLocaleDateString()}
                  </td>
                  <td className="text-gray-700">
                    {m.dueMileage ? `${m.dueMileage.toLocaleString()} mi` : "-"}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        m.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : m.priority === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {m.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        m.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : m.status === "overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <MaintenanceForm
                        maintenance={m}
                        vehicles={vehicles}
                        services={services}
                        onSave={handleSave}
                        trigger={
                          <button className="p-2 text-gray-600 hover:text-gray-900">
                            <Edit size={16} />
                          </button>
                        }
                      />
                      <button
                        onClick={() => setDeleteId(m.id)}
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
            <AlertDialogTitle>Delete Reminder</AlertDialogTitle>
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
