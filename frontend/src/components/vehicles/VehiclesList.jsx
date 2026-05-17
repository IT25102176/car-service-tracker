import { useState, useMemo } from "react";
import { VehicleForm } from "./VehicleForm";
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
import {
  Trash2,
  Edit,
  Search,
  UserRound,
  Phone,
  Gauge,
} from "lucide-react";

const VEHICLE_PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270" viewBox="0 0 480 270"><rect width="480" height="270" fill="#f3f4f6"/><g fill="#9ca3af"><rect x="110" y="122" width="260" height="50" rx="12"/><rect x="145" y="96" width="90" height="34" rx="8"/><circle cx="170" cy="182" r="18"/><circle cx="310" cy="182" r="18"/></g><text x="240" y="242" font-size="16" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif">No Image</text></svg>`,
  );

export function VehiclesList({ vehicles, users, onAdd, onUpdate, onDelete }) {
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = (vehicle) => {
    const existing = vehicles.find((v) => v.id === vehicle.id);
    existing ? onUpdate(vehicle) : onAdd(vehicle);
  };

  const filteredVehicles = useMemo(
    () =>
      vehicles.filter(
        (v) =>
          `${v.year} ${v.make} ${v.model}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [vehicles, searchQuery],
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{ fontFamily: "Phudu, sans-serif", fontWeight: 700 }}
            className="text-4xl text-gray-900"
          >
            Manage Vehicles
          </h1>
          <p className="text-gray-600 mt-1 text-sm">Manage your fleet</p>
        </div>
        <VehicleForm
          users={users}
          onSave={onAdd}
          trigger={
            <Button className="bg-gray-800 text-md text-white hover:bg-gray-900 rounded-4xl px-8 py-5">
              + Add Vehicle
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
          placeholder="Search by vehicle, plate, or owner..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-0 focus:border-gray-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white border rounded-2xl p-5 shadow-sm"
            style={{
              borderColor: "rgba(233, 118, 43, 0.30)",
              boxShadow: "0 1px 8px rgba(233, 118, 43, 0.12)",
            }}
          >
            <img
              src={vehicle.imageUrl || VEHICLE_PLACEHOLDER_IMAGE}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="h-40 w-full rounded-xl object-cover mb-4 border border-gray-200 bg-gray-100"
              onError={(e) => {
                e.currentTarget.src = VEHICLE_PLACEHOLDER_IMAGE;
              }}
            />
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base leading-tight">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-xs font-mono tracking-wide text-gray-500">
                    {vehicle.licensePlate}
                  </p>
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[11px] font-semibold uppercase text-gray-700">
                    {(vehicle.vehicleType || "car")}
                  </span>
                </div>
              </div>
            </div>
            <div
              className="space-y-2.5 mb-4 text-sm rounded-xl p-3.5 border"
              style={{
                backgroundColor: "rgba(233, 118, 43, 0.14)",
                borderColor: "rgba(233, 118, 43, 0.30)",
              }}
            >
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-gray-600 inline-flex items-center gap-1.5">
                  <UserRound size={14} />
                  Owner
                </span>
                <span className="font-medium text-gray-900">
                  {vehicle.ownerName}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-gray-600 inline-flex items-center gap-1.5">
                  <Phone size={14} />
                  Phone
                </span>
                <span className="font-medium text-gray-900">
                  {vehicle.ownerPhone}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-gray-600 inline-flex items-center gap-1.5">
                  <Gauge size={14} />
                  Mileage
                </span>
                <span className="font-semibold text-gray-900">
                  {vehicle.mileage.toLocaleString()} mi
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <VehicleForm
                vehicle={vehicle}
                users={users}
                onSave={handleSave}
                trigger={
                  <button className="flex-1 p-2.5 rounded-lg text-xs font-medium border text-gray-700 border-gray-200">
                    <Edit size={14} className="inline mr-1" />
                    Edit
                  </button>
                }
              />
              <button
                onClick={() => setDeleteId(vehicle.id)}
                className="flex-1 p-2.5 text-red-600 rounded-lg text-xs font-medium border border-red-100"
              >
                <Trash2 size={14} className="inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No vehicles found</p>
        </div>
      )}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
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
