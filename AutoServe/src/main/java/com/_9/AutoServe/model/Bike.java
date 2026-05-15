package com._9.AutoServe.model;

public class Bike extends Vehicle {
    public Bike() {
        setVehicleType("bike");
    }

    @Override
    public String getMaintenanceProfile() {
        return "Frequent chain and brake inspection";
    }
}
