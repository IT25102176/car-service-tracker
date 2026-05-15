package com._9.AutoServe.repository;

import com._9.AutoServe.model.Vehicle;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import tools.jackson.databind.json.JsonMapper;

@Repository
public class VehicleRepository extends JsonFileRepository<Vehicle> {
    public VehicleRepository(JsonMapper objectMapper, @Value("${app.storage.dir:data}") String storageDir) {
        super(objectMapper, storageDir, "vehicles.json", Vehicle.class, Vehicle::getId);
    }
}
