import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function VehicleForm({ vehicle, users, onSave, trigger }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(
    vehicle || {
      vehicleType: "car",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      vin: "",
      imageUrl: "",
      ownerUserId: "",
      mileage: 0,
    },
  );

  const ownerUsers = (users || []).filter(
    (user) => (user.role || "").toLowerCase() === "customer",
  );
  const selectedOwner = ownerUsers.find((u) => u.id === formData.ownerUserId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: vehicle?.id || `vehicle-${Date.now()}`,
      vehicleType: formData.vehicleType || "car",
      ownerUserId: formData.ownerUserId || "",
      make: formData.make || "",
      model: formData.model || "",
      year: formData.year || new Date().getFullYear(),
      licensePlate: formData.licensePlate || "",
      vin: formData.vin || "",
      imageUrl: formData.imageUrl || "",
      ownerName: selectedOwner?.name || "",
      ownerPhone: selectedOwner?.phone || "",
      ownerEmail: selectedOwner?.email || "",
      mileage: formData.mileage || 0,
      lastServiceDate: vehicle?.lastServiceDate,
      createdAt: vehicle?.createdAt || new Date(),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Add Vehicle</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[620px] rounded-3xl p-7">
        <DialogHeader>
          <DialogTitle>
            {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
          </DialogTitle>
          <DialogDescription>
            {vehicle
              ? "Update vehicle information"
              : "Add a new vehicle to the system"}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 [&_input]:h-10 [&_input]:rounded-xl [&_input]:border-gray-300 [&_input]:bg-gray-100 [&_input]:px-4 [&_input]:focus-visible:border-gray-400 [&_input]:focus-visible:ring-0"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type
            </label>
            <Select
              value={formData.vehicleType || "car"}
              onValueChange={(value) =>
                setFormData({ ...formData, vehicleType: value })
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Make
              </label>
              <Input
                value={formData.make || ""}
                onChange={(e) =>
                  setFormData({ ...formData, make: e.target.value })
                }
                placeholder="Toyota"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <Input
                value={formData.model || ""}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                placeholder="Camry"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <Input
                type="number"
                value={formData.year || ""}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
                placeholder="2022"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Plate
              </label>
              <Input
                value={formData.licensePlate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, licensePlate: e.target.value })
                }
                placeholder="ABC-1234"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                VIN
              </label>
              <Input
                value={formData.vin || ""}
                onChange={(e) =>
                  setFormData({ ...formData, vin: e.target.value })
                }
                placeholder="Vehicle Identification Number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <Input
                value={formData.imageUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://example.com/vehicle.jpg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Mileage
              </label>
              <Input
                type="number"
                value={formData.mileage || ""}
                onChange={(e) =>
                  setFormData({ ...formData, mileage: parseInt(e.target.value) })
                }
                placeholder="45000"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner User
            </label>
            <Select
              value={formData.ownerUserId || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, ownerUserId: value })
              }
            >
              <SelectTrigger className="h-10 rounded-xl border-gray-300 bg-gray-100 px-4 text-sm focus:ring-0 focus:border-gray-400">
                <SelectValue placeholder="Select customer owner" />
              </SelectTrigger>
              <SelectContent>
                {ownerUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-gray-300 bg-white px-6 text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 rounded-xl bg-[#E9762B] px-6 text-white hover:bg-[#d86722]"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
