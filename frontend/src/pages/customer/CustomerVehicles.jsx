import { useEffect, useState } from "react";
import { vehiclesApi } from "@/lib/api";
import { getCustomerSession } from "@/lib/customerSession";
import { ErrorNotice } from "@/components/ui/error-notice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CustomerVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: "car",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    vin: "",
    mileage: 0,
  });
  const [error, setError] = useState("");
  const session = getCustomerSession();

  useEffect(() => {
    if (!session?.id) return;
    vehiclesApi
      .getAll()
      .then((data) => setVehicles(data.filter((v) => v.ownerUserId === session.id)))
      .catch((err) => setError(err.message));
  }, [session?.id]);

  const handleCreateVehicle = async (event) => {
    event.preventDefault();
    if (!session?.id) {
      setError("Customer session not found");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const created = await vehiclesApi.create({
        ownerUserId: session.id,
        vehicleType: formData.vehicleType || "car",
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        licensePlate: formData.licensePlate,
        vin: formData.vin,
        mileage: Number(formData.mileage),
      });
      setVehicles((prev) => [created, ...prev]);
      setFormData({
        vehicleType: "car",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        licensePlate: "",
        vin: "",
        mileage: 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <ErrorNotice message={error} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-gray-900">Add Vehicle</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add your vehicle details. Owner is automatically linked to your account.
        </p>

        <form
          onSubmit={handleCreateVehicle}
          className="mt-4 grid gap-3 sm:grid-cols-2 [&_input]:h-10 [&_input]:rounded-xl [&_input]:border-gray-300 [&_input]:bg-gray-100 [&_input]:px-4 [&_input]:focus-visible:border-gray-400 [&_input]:focus-visible:ring-0"
        >
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Vehicle Type</label>
            <Select
              value={formData.vehicleType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, vehicleType: value }))
              }
            >
              <SelectTrigger className="h-10 rounded-xl border-gray-300 bg-gray-100 px-4 text-sm focus:ring-0 focus:border-gray-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="bike">Bike</SelectItem>
                <SelectItem value="van">Van</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Make</label>
            <Input
              value={formData.make}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, make: event.target.value }))
              }
              placeholder="Toyota"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Model</label>
            <Input
              value={formData.model}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, model: event.target.value }))
              }
              placeholder="Corolla"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Year</label>
            <Input
              type="number"
              value={formData.year}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, year: event.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">License Plate</label>
            <Input
              value={formData.licensePlate}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, licensePlate: event.target.value }))
              }
              placeholder="ABC-1234"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">VIN</label>
            <Input
              value={formData.vin}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, vin: event.target.value }))
              }
              placeholder="Vehicle Identification Number"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Current Mileage</label>
            <Input
              type="number"
              value={formData.mileage}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, mileage: event.target.value }))
              }
              placeholder="45000"
              required
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#E9762B] px-6 text-white hover:bg-[#d86722]"
            >
              {isSubmitting ? "Adding..." : "Add Vehicle"}
            </Button>
          </div>
        </form>
      </div>

      <h2 className="text-xl font-semibold text-gray-900">My Vehicles</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-lg font-semibold text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase text-gray-600">
              Type: {vehicle.vehicleType || "car"}
            </p>
            <p className="mt-1 text-sm text-gray-600">Plate: {vehicle.licensePlate}</p>
            <p className="text-sm text-gray-600">VIN: {vehicle.vin}</p>
            <p className="mt-2 text-sm font-medium text-gray-700">
              Mileage: {(vehicle.mileage || 0).toLocaleString()}
            </p>
          </div>
        ))}
        {vehicles.length === 0 && (
          <p className="text-sm text-slate-500">No vehicles linked to this account.</p>
        )}
      </div>
    </div>
  );
}
