package com._9.AutoServe.service;

import com._9.AutoServe.model.Vehicle;
import com._9.AutoServe.model.Bike;
import com._9.AutoServe.model.Car;
import com._9.AutoServe.model.Van;
import com._9.AutoServe.repository.AppointmentRepository;
import com._9.AutoServe.repository.MaintenanceReminderRepository;
import com._9.AutoServe.repository.ServiceRecordRepository;
import com._9.AutoServe.repository.UserRepository;
import com._9.AutoServe.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class VehicleService {
    private final VehicleRepository repository;
    private final UserRepository userRepository;
    private final ServiceRecordRepository serviceRecordRepository;
    private final MaintenanceReminderRepository maintenanceReminderRepository;
    private final AppointmentRepository appointmentRepository;

    public VehicleService(
            VehicleRepository repository,
            UserRepository userRepository,
            ServiceRecordRepository serviceRecordRepository,
            MaintenanceReminderRepository maintenanceReminderRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.serviceRecordRepository = serviceRecordRepository;
        this.maintenanceReminderRepository = maintenanceReminderRepository;
        this.appointmentRepository = appointmentRepository;
    }
    
  // Gets all vehicles with their correct vehicle type.
    public List<Vehicle> getAll() {
        return repository
                .findAll()
                .stream()
                .map(this::toVehicleSubtype)
                .toList();
    }
   // Gets one vehicle by id with the correct vehicle type.
    public Vehicle getById(String id) {
        return repository.findById(id)
                .map(this::toVehicleSubtype)
                .orElseThrow(() -> new NoSuchElementException("Vehicle not found: " + id));
    }
    
   // Creates a new vehicle and saves it.
    public Vehicle create(Vehicle vehicle) {
        Vehicle vehicleByType = toVehicleSubtype(vehicle);
        if (vehicle.getId() == null || vehicle.getId().isBlank()) {
            vehicleByType.setId(UUID.randomUUID().toString());
        }
        syncOwnerFromUser(vehicleByType);
        if (vehicle.getCreatedAt() == null) {
            vehicleByType.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(vehicleByType);
    }
   // Updates an existing vehicle.
    public Vehicle update(String id, Vehicle vehicle) {
        getById(id);
        Vehicle vehicleByType = toVehicleSubtype(vehicle);
        vehicleByType.setId(id);
        syncOwnerFromUser(vehicleByType);
        if (vehicle.getCreatedAt() == null) {
            vehicleByType.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(vehicleByType);
    }
  // Deletes a vehicle if no other records are using it.
    public void delete(String id) {
        boolean hasServices = serviceRecordRepository.findAll().stream()
                .anyMatch(service -> id.equals(service.getVehicleId()));
        if (hasServices) {
            throw new IllegalArgumentException("Cannot delete vehicle with service records");
        }

        boolean hasMaintenances = maintenanceReminderRepository.findAll().stream()
                .anyMatch(maintenance -> id.equals(maintenance.getVehicleId()));
        if (hasMaintenances) {
            throw new IllegalArgumentException("Cannot delete vehicle with maintenance reminders");
        }

        boolean hasAppointments = appointmentRepository.findAll().stream()
                .anyMatch(appointment -> id.equals(appointment.getVehicleId()));
        if (hasAppointments) {
            throw new IllegalArgumentException("Cannot delete vehicle with appointments");
        }

        if (!repository.deleteById(id)) {
            throw new NoSuchElementException("Vehicle not found: " + id);
        }
    }
   // Copies the owner's details from the selected user into the vehicle.
    private void syncOwnerFromUser(Vehicle vehicle) {
        if (vehicle.getOwnerUserId() == null || vehicle.getOwnerUserId().isBlank()) {
            throw new IllegalArgumentException("ownerUserId is required");
        }
        var owner = userRepository.findById(vehicle.getOwnerUserId())
                .orElseThrow(() -> new IllegalArgumentException("Owner user not found: " + vehicle.getOwnerUserId()));
        if (!owner.canOwnVehicle()) {
            throw new IllegalArgumentException("Selected user must have customer role to own a vehicle");
        }

        vehicle.setOwnerName(owner.getName());
        vehicle.setOwnerPhone(owner.getPhone());
        vehicle.setOwnerEmail(owner.getEmail());
    }
    // Converts a vehicle into the correct class based on the vehicle type.
    private Vehicle toVehicleSubtype(Vehicle vehicle) {
        if (vehicle == null) {
            return null;
        }

        String vehicleType = vehicle.getVehicleType() == null
                ? ""
                : vehicle.getVehicleType().trim().toLowerCase();

        Vehicle typedVehicle = switch (vehicleType) {
            case "bike" -> new Bike();
            case "van" -> new Van();
            case "car" -> new Car();
            default -> new Car();
        };

        typedVehicle.setId(vehicle.getId());
        typedVehicle.setOwnerUserId(vehicle.getOwnerUserId());
        typedVehicle.setMake(vehicle.getMake());
        typedVehicle.setModel(vehicle.getModel());
        typedVehicle.setYear(vehicle.getYear());
        typedVehicle.setLicensePlate(vehicle.getLicensePlate());
        typedVehicle.setVin(vehicle.getVin());
        typedVehicle.setOwnerName(vehicle.getOwnerName());
        typedVehicle.setOwnerPhone(vehicle.getOwnerPhone());
        typedVehicle.setOwnerEmail(vehicle.getOwnerEmail());
        typedVehicle.setImageUrl(vehicle.getImageUrl());
        typedVehicle.setMileage(vehicle.getMileage());
        typedVehicle.setLastServiceDate(vehicle.getLastServiceDate());
        typedVehicle.setCreatedAt(vehicle.getCreatedAt());
        return typedVehicle;
    }
}

