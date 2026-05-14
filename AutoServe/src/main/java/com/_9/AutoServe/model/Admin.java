package com._9.AutoServe.model;

public class Admin extends User {
    public Admin() {
        setRole("admin");
    }

    @Override
    public String getResponsibilities() {
        return "Manages system users and access settings";
    }
}
