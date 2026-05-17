import { useState, useCallback, useEffect } from "react";
import { MaintenanceList } from "@/components/maintenance/MaintenanceList";
import { maintenanceApi, servicesApi, vehiclesApi } from "@/lib/api";
import { ErrorNotice } from "@/components/ui/error-notice";

export default function MaintenancePage() {
  const [maintenances, setMaintenances] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([maintenanceApi.getAll(), vehiclesApi.getAll(), servicesApi.getAll()])
      .then(([maintenancesData, vehiclesData, servicesData]) => {
        setMaintenances(maintenancesData);
        setVehicles(vehiclesData);
        setServices(servicesData);
      })
      .catch((error) => setError(error.message));
  }, []);

  const handleAdd = useCallback(async (m) => {
    try {
      const created = await maintenanceApi.create(m);
      setMaintenances((prev) => [...prev, created]);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }, []);
  const handleUpdate = useCallback(async (m) => {
    try {
      const updated = await maintenanceApi.update(m.id, m);
      setMaintenances((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }, []);
  const handleDelete = useCallback(async (id) => {
    try {
      await maintenanceApi.remove(id);
      setMaintenances((prev) => prev.filter((x) => x.id !== id));
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }, []);

  return (
    <div className="space-y-6">
      <ErrorNotice message={error} />
      <MaintenanceList
        maintenances={maintenances}
        vehicles={vehicles}
        services={services}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
