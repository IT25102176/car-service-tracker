package com._9.AutoServe.model;

public class Technician extends User {
    public Technician() {
        setRole("technician");
    }

    @Override
    public boolean canBeAssignedAsTechnician() {
        return true;
    }

    @Override
    public String getResponsibilities() {
        return "Handles vehicle diagnostics and repair work";
    }
}
