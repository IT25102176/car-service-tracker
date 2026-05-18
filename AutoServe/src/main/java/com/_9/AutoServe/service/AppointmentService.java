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

/*
    Handles all calculations & decisions, once everything clears it hands the data to the repo
        [Service ===> Repository]
*/

@Service
public class AppointmentService {
    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "requested",        //permanent list of allowed words for an appointment's status
            "scheduled",
            "completed",
            "cancelled"
    );

    // private dependencies that check appointments, vehicles, and user accounts
    private final AppointmentRepository repository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    /*
        The Constructor:
            Wires up the three repositories into this service,
            so it has permission to read and write data to the temporary JSON storage
    */
    public AppointmentService(
            AppointmentRepository repository,
            VehicleRepository vehicleRepository,
            UserRepository userRepository
    ) {
        this.repository = repository;
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    // Get all appointments [READ]
    public List<Appointment> getAll() {
        return repository.findAll();
    }

    // Get appointment by ID [READ]
    public Appointment getById(String id) {
        return repository.findById(id).orElseThrow(() -> new NoSuchElementException("Appointment not found: " + id));
    }

    // Create a new appointment [CREATE]
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

    // Update an appointment [UPDATE]
    public Appointment update(String id, Appointment appointment) {
        getById(id);
        appointment.setId(id);
        validateAndSyncReferences(appointment);
        if (appointment.getCreatedAt() == null) {
            appointment.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(appointment);
    }

    // Delete an appointment [DELETE]
    public void delete(String id) {
        if (!repository.deleteById(id)) {
            throw new NoSuchElementException("Appointment not found: " + id);
        }
    }

    /*
        Methods (The Validation)
    */


    private void validateAndSyncReferences(Appointment appointment) {
        if (appointment.getVehicleId() == null || appointment.getVehicleId().isBlank()) {
            throw new IllegalArgumentException("vehicleId is required");        // No vehicle ID? = No Booking Service
        }
        var vehicle = vehicleRepository.findById(appointment.getVehicleId())    // checks the VehicleRepository to see if that vehicle actually exists
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + appointment.getVehicleId()));

        appointment.setVehicleName(
                vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel() + " (" + vehicle.getLicensePlate() + ")"
                // ex: 2022 Toyota Corolla (WP-CAA-1234)
        );
        if (appointment.getCustomerName() == null || appointment.getCustomerName().isBlank()) {
            appointment.setCustomerName(vehicle.getOwnerName());
            // Autofill the owner's name from the vehicle record if the customer name blank
        }

        if (appointment.getAssignedTechnicianId() != null && !appointment.getAssignedTechnicianId().isBlank()) {
            var technician = userRepository.findById(appointment.getAssignedTechnicianId())
                    .orElseThrow(() -> new IllegalArgumentException("Technician user not found: " + appointment.getAssignedTechnicianId()));
            if (!technician.canBeAssignedAsTechnician()) {
                throw new IllegalArgumentException("Assigned user must have technician role");
            // Make sure the person is an actual technician
            }
        }

        normalizeAndValidateStatus(appointment);
    }

    private void normalizeAndValidateStatus(Appointment appointment) {
        String status = appointment.getStatus();
        if (status == null || status.isBlank()) {
            appointment.setStatus("requested");
            return;
        // Status = NO?, defaults to "requested"
        }

        String normalizedStatus = status.trim().toLowerCase();
        // Status = YES?, trims out any accidental spaces and converts it to lowercase [Scheduled => scheduled]
        if (!ALLOWED_STATUSES.contains(normalizedStatus)) {
            throw new IllegalArgumentException("Invalid appointment status: " + status);
        // if the status doesn't match the ALLOWED_STATUSES word set, block the action
        }
        appointment.setStatus(normalizedStatus);
    }
}

