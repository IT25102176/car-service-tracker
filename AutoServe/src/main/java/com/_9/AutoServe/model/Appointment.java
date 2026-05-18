package com._9.AutoServe.model;

import java.time.LocalDateTime;

/*
    The Blueprint / The Data form
    - everytime a new appointment is made, a new object is stamped out using this blueprint
*/

public class Appointment {      // Attributes/Variables
    private String id;
    private String vehicleId;
    private String vehicleName;
    private String customerName;
    private LocalDateTime appointmentDate;
    private String serviceType;
    private String notes;
    private String status;
    private String assignedTechnicianId;
    private LocalDateTime createdAt;

    public Appointment() {          // Constructor
    }

    // Getters + Setters

    public String getId() {
        return id;
    }
    void setId(String id) {
        this.id = id;
    }


    public String getVehicleId() {
        return vehicleId;
    }
    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }


    public String getVehicleName() {
        return vehicleName;
    }
    public void setVehicleName(String vehicleName) {
        this.vehicleName = vehicleName;
    }


    public String getCustomerName() {
        return customerName;
    }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }


    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }
    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }


    public String getServiceType() {
        return serviceType;
    }
    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }


    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }


    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }


    public String getAssignedTechnicianId() {
        return assignedTechnicianId;
    }
    public void setAssignedTechnicianId(String assignedTechnicianId) {
        this.assignedTechnicianId = assignedTechnicianId;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

