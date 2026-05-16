package com._9.AutoServe.service;



import com._9.AutoServe.model.MaintenanceReminder;
import com._9.AutoServe.repository.MaintenanceReminderRepository;
import com._9.AutoServe.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class MaintenanceReminderService {
    private final MaintenanceReminderRepository repository;
    private final VehicleRepository vehicleRepository;

    public MaintenanceReminderService(MaintenanceReminderRepository repository, VehicleRepository vehicleRepository) {
        this.repository = repository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<MaintenanceReminder> getAll() {
        return repository.findAll();
    }

    public MaintenanceReminder getById(String id) {
        return repository.findById(id).orElseThrow(() -> new NoSuchElementException("Maintenance reminder not found: " + id));
    }

    public MaintenanceReminder create(MaintenanceReminder maintenanceReminder) {
        if (maintenanceReminder.getId() == null || maintenanceReminder.getId().isBlank()) {
            maintenanceReminder.setId(UUID.randomUUID().toString());
        }
        syncVehicleFields(maintenanceReminder);
        if (maintenanceReminder.getCreatedAt() == null) {
            maintenanceReminder.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(maintenanceReminder);
    }

    public MaintenanceReminder update(String id, MaintenanceReminder maintenanceReminder) {
        getById(id);
        maintenanceReminder.setId(id);
        syncVehicleFields(maintenanceReminder);
        if (maintenanceReminder.getCreatedAt() == null) {
            maintenanceReminder.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(maintenanceReminder);
    }

    public void delete(String id) {
        if (!repository.deleteById(id)) {
            throw new NoSuchElementException("Maintenance reminder not found: " + id);
        }
    }

    private void syncVehicleFields(MaintenanceReminder maintenanceReminder) {
        if (maintenanceReminder.getVehicleId() == null || maintenanceReminder.getVehicleId().isBlank()) {
            throw new IllegalArgumentException("vehicleId is required");
        }
        var vehicle = vehicleRepository.findById(maintenanceReminder.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + maintenanceReminder.getVehicleId()));

        maintenanceReminder.setVehicleName(
                vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel() + " (" + vehicle.getLicensePlate() + ")"
        );
        maintenanceReminder.setCurrentMileage(vehicle.getMileage());
    }
}
