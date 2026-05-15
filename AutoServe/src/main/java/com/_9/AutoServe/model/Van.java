package com._9.AutoServe.model;

public class Van extends Vehicle {
    public Van() {
        setVehicleType("van");
    }

    @Override
    public String getMaintenanceProfile() {
        return "Heavy-load maintenance checks";
    }
}

