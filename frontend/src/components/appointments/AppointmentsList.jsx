import { useState, useMemo } from "react";
import { AppointmentForm } from "./AppointmentForm";
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

export function AppointmentsList({
  appointments,
  vehicles,
  users,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = (appointment) => {
    const existing = appointments.find((a) => a.id === appointment.id);
    existing ? onUpdate(appointment) : onAdd(appointment);
  };

  const formatDateTime = (date) => {
    const d = new Date(date);
    return (
      d.toLocaleDateString() +
      " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getTechnicianName = (id) => {
    if (!id) return "-";
    return users.find((u) => u.id === id)?.name || "-";
  };

  const filteredAppointments = useMemo(
    () =>
      appointments.filter(
        (a) =>
          a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.serviceType.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [appointments, searchQuery],
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{ fontFamily: "Phudu, sans-serif", fontWeight: 700 }}
            className="text-4xl text-gray-900"
          >
            Appointments
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Schedule and manage appointments
          </p>
        </div>
        <AppointmentForm
          vehicles={vehicles}
          users={users}
          onSave={onAdd}
          trigger={
            <Button className="bg-gray-800 text-md text-white hover:bg-gray-900 rounded-4xl px-8 py-5">
              + Schedule
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
          placeholder="Search by customer, vehicle, or service..."
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
                <th>Date & Time</th>
                <th>Service Type</th>
                <th>Technician</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>
                    <span className="font-medium text-gray-900">
                      {appointment.customerName}
                    </span>
                  </td>
                  <td className="text-gray-700">{appointment.vehicleName}</td>
                  <td className="text-gray-700 text-sm">
                    {formatDateTime(appointment.appointmentDate)}
                  </td>
                  <td className="text-gray-700">{appointment.serviceType}</td>
                  <td className="text-gray-700">
                    {getTechnicianName(appointment.assignedTechnicianId)}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : appointment.status === "requested"
                              ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <AppointmentForm
                        appointment={appointment}
                        vehicles={vehicles}
                        users={users}
                        onSave={handleSave}
                        trigger={
                          <button className="p-2 text-gray-600 hover:text-gray-900">
                            <Edit size={16} />
                          </button>
                        }
                      />
                      <button
                        onClick={() => setDeleteId(appointment.id)}
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
            <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
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
