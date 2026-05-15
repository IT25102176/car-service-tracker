package com._9.AutoServe.model;

public class Car extends Vehicle {
    public Car() {
        setVehicleType("car");
    }

    @Override
    public String getMaintenanceProfile() {
        return "Standard car service interval";
    }
}
