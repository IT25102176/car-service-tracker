package com._9.AutoServe.service;


import com._9.AutoServe.model.Appointment;
import com._9.AutoServe.repository.AppointmentRepository;
import com._9.AutoServe.repository.UserRepository;
import com._9.AutoServe.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class AppointmentService {
    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "requested",
            "scheduled",
            "completed",
            "cancelled"
    );

    private final AppointmentRepository repository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public AppointmentService(
            AppointmentRepository repository,
            VehicleRepository vehicleRepository,
            UserRepository userRepository
    ) {
        this.repository = repository;
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    public List<Appointment> getAll() {
        return repository.findAll();
    }

    public Appointment getById(String id) {
        return repository.findById(id).orElseThrow(() -> new NoSuchElementException("Appointment not found: " + id));
    }

    public Appointment create(Appointment appointment) {
        if (appointment.getId() == null || appointment.getId().isBlank()) {
            appointment.setId(UUID.randomUUID().toString());
        }
        validateAndSyncReferences(appointment);
        if (appointment.getCreatedAt() == null) {
            appointment.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(appointment);
    }

    public Appointment update(String id, Appointment appointment) {
        getById(id);
        appointment.setId(id);
        validateAndSyncReferences(appointment);
        if (appointment.getCreatedAt() == null) {
            appointment.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(appointment);
    }

    public void delete(String id) {
        if (!repository.deleteById(id)) {
            throw new NoSuchElementException("Appointment not found: " + id);
        }
    }

    private void validateAndSyncReferences(Appointment appointment) {
        if (appointment.getVehicleId() == null || appointment.getVehicleId().isBlank()) {
            throw new IllegalArgumentException("vehicleId is required");
        }
        var vehicle = vehicleRepository.findById(appointment.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + appointment.getVehicleId()));

        appointment.setVehicleName(
                vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel() + " (" + vehicle.getLicensePlate() + ")"
        );
        if (appointment.getCustomerName() == null || appointment.getCustomerName().isBlank()) {
            appointment.setCustomerName(vehicle.getOwnerName());
        }

        if (appointment.getAssignedTechnicianId() != null && !appointment.getAssignedTechnicianId().isBlank()) {
            var technician = userRepository.findById(appointment.getAssignedTechnicianId())
                    .orElseThrow(() -> new IllegalArgumentException("Technician user not found: " + appointment.getAssignedTechnicianId()));
            if (!technician.canBeAssignedAsTechnician()) {
                throw new IllegalArgumentException("Assigned user must have technician role");
            }
        }

        normalizeAndValidateStatus(appointment);
    }

    private void normalizeAndValidateStatus(Appointment appointment) {
        String status = appointment.getStatus();
        if (status == null || status.isBlank()) {
            appointment.setStatus("requested");
            return;
        }

        String normalizedStatus = status.trim().toLowerCase();
        if (!ALLOWED_STATUSES.contains(normalizedStatus)) {
            throw new IllegalArgumentException("Invalid appointment status: " + status);
        }
        appointment.setStatus(normalizedStatus);
    }
}

