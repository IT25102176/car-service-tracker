import { useEffect, useMemo, useState } from "react";
import { appointmentsApi, vehiclesApi } from "@/lib/api";
import { getCustomerSession } from "@/lib/customerSession";
import { ErrorNotice } from "@/components/ui/error-notice";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function CustomerAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: "",
    serviceType: "",
    appointmentDate: "",
    appointmentTime: "09:00",
    notes: "",
  });
  const [error, setError] = useState("");
  const session = getCustomerSession();

  useEffect(() => {
    if (!session?.id) return;
    Promise.all([appointmentsApi.getAll(), vehiclesApi.getAll()])
      .then(([appointmentsData, vehiclesData]) => {
        const myVehicles = vehiclesData.filter((vehicle) => vehicle.ownerUserId === session.id);
        const myVehicleIds = new Set(myVehicles.map((vehicle) => vehicle.id));
        setVehicles(myVehicles);
        setAppointments(
          appointmentsData.filter((appointment) => myVehicleIds.has(appointment.vehicleId)),
        );
      })
      .catch((err) => setError(err.message));
  }, [session?.id]);

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort(
        (a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime(),
      ),
    [appointments],
  );

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === formData.vehicleId);

  const handleCreateAppointment = async (event) => {
    event.preventDefault();
    if (!selectedVehicle) {
      setError("Please select your vehicle");
      return;
    }

    const dateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
    if (Number.isNaN(dateTime.getTime())) {
      setError("Please select valid appointment date and time");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const created = await appointmentsApi.create({
        vehicleId: selectedVehicle.id,
        customerName: selectedVehicle.ownerName,
        appointmentDate: dateTime,
        serviceType: formData.serviceType,
        notes: formData.notes,
        status: "requested",
        assignedTechnicianId: "",
      });
      setAppointments((prev) => [created, ...prev]);
      setFormData({
        vehicleId: "",
        serviceType: "",
        appointmentDate: "",
        appointmentTime: "09:00",
        notes: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = async (appointment) => {
    if (appointment.status !== "scheduled") return;
    setError("");
    try {
      const updated = await appointmentsApi.update(appointment.id, {
        ...appointment,
        status: "cancelled",
      });
      setAppointments((prev) =>
        prev.map((item) => (item.id === appointment.id ? updated : item)),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-5">
      <ErrorNotice message={error} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-gray-900">Book Appointment</h2>
        <p className="mt-1 text-sm text-gray-600">
          Submit a request. Admin team will review and change status to scheduled.
        </p>
        <form
          onSubmit={handleCreateAppointment}
          className="mt-4 grid gap-3 sm:grid-cols-2 [&_input]:h-10 [&_input]:rounded-xl [&_input]:border-gray-300 [&_input]:bg-gray-100 [&_input]:px-4 [&_input]:focus-visible:border-gray-400 [&_input]:focus-visible:ring-0"
        >
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Vehicle</label>
            <Select
              value={formData.vehicleId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, vehicleId: value }))}
            >
              <SelectTrigger className="h-10 rounded-xl border-gray-300 bg-gray-100 px-4 text-sm focus:ring-0 focus:border-gray-400">
                <SelectValue placeholder="Select your vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Service Type</label>
            <Input
              value={formData.serviceType}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, serviceType: event.target.value }))
              }
              placeholder="Oil change, brake inspection, etc."
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
            <Input
              type="date"
              value={formData.appointmentDate}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, appointmentDate: event.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Time</label>
            <Input
              type="time"
              value={formData.appointmentTime}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, appointmentTime: event.target.value }))
              }
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
            <Input
              value={formData.notes}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, notes: event.target.value }))
              }
              placeholder="Optional notes for the workshop"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#E9762B] px-6 text-white hover:bg-[#d86722]"
            >
              {isSubmitting ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </form>
      </div>

      <h2 className="text-xl font-semibold text-gray-900">My Appointments</h2>
      <div className="space-y-3">
        {sortedAppointments.map((appointment) => (
          <div key={appointment.id} className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-gray-900">{appointment.serviceType}</p>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                {appointment.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">{appointment.vehicleName}</p>
            <p className="text-sm text-gray-500">
              {new Date(appointment.appointmentDate).toLocaleString()}
            </p>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                disabled={appointment.status !== "scheduled"}
                onClick={() => handleCancelAppointment(appointment)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  appointment.status === "scheduled"
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
        {sortedAppointments.length === 0 && (
          <p className="text-sm text-slate-500">No appointments available.</p>
        )}
      </div>
    </div>
  );
}
