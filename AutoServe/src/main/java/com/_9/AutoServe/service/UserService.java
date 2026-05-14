package com._9.AutoServe.service;

import com._9.AutoServe.model.User;
import com._9.AutoServe.model.Admin;
import com._9.AutoServe.model.Customer;
import com._9.AutoServe.model.Manager;
import com._9.AutoServe.model.Technician;
import com._9.AutoServe.repository.AppointmentRepository;
import com._9.AutoServe.repository.UserRepository;
import com._9.AutoServe.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository repository;
    private final VehicleRepository vehicleRepository;
    private final AppointmentRepository appointmentRepository;

    public UserService(
            UserRepository repository,
            VehicleRepository vehicleRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.repository = repository;
        this.vehicleRepository = vehicleRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public List<User> getAll() {
        return repository.findAll().stream()
                .map(this::toRoleSpecificUser)
                .toList();
    }

    public User getById(String id) {
        return repository.findById(id)
                .map(this::toRoleSpecificUser)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + id));
    }

    public User getCustomerByPhone(String phone) {
        if (phone == null || phone.isBlank()) {
            throw new IllegalArgumentException("phone is required");
        }
        return repository.findAll().stream()
                .map(this::toRoleSpecificUser)
                .filter(user -> "customer".equalsIgnoreCase(user.getRole()))
                .filter(user -> phone.equals(user.getPhone()))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Customer not found for phone: " + phone));
    }

    public User create(User user) {
        User roleSpecificUser = toRoleSpecificUser(user);
        if (user.getId() == null || user.getId().isBlank()) {
            roleSpecificUser.setId(UUID.randomUUID().toString());
        }
        if (user.getCreatedAt() == null) {
            roleSpecificUser.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(roleSpecificUser);
    }

    public User update(String id, User user) {
        getById(id);
        User roleSpecificUser = toRoleSpecificUser(user);
        roleSpecificUser.setId(id);
        if (user.getCreatedAt() == null) {
            roleSpecificUser.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(roleSpecificUser);
    }

    public void delete(String id) {
        boolean ownsVehicles = vehicleRepository.findAll().stream()
                .anyMatch(vehicle -> id.equals(vehicle.getOwnerUserId()));
        if (ownsVehicles) {
            throw new IllegalArgumentException("Cannot delete user who is assigned as a vehicle owner");
        }

        boolean assignedTechnician = appointmentRepository.findAll().stream()
                .anyMatch(appointment -> id.equals(appointment.getAssignedTechnicianId()));
        if (assignedTechnician) {
            throw new IllegalArgumentException("Cannot delete user assigned to appointments");
        }

        if (!repository.deleteById(id)) {
            throw new NoSuchElementException("User not found: " + id);
        }
    }

    private User toRoleSpecificUser(User user) {
        if (user == null) {
            return null;
        }

        String role = user.getRole() == null ? "" : user.getRole().trim().toLowerCase();
        User roleSpecificUser = switch (role) {
            case "customer" -> new Customer();
            case "technician" -> new Technician();
            case "admin" -> new Admin();
            default -> new Manager();
        };

        roleSpecificUser.setId(user.getId());
        roleSpecificUser.setName(user.getName());
        roleSpecificUser.setEmail(user.getEmail());
        roleSpecificUser.setPhone(user.getPhone());
        roleSpecificUser.setRole(roleSpecificUser.getRole());
        roleSpecificUser.setCreatedAt(user.getCreatedAt());
        return roleSpecificUser;
    }
}

