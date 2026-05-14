package com._9.AutoServe.model;

public class Manager extends User {
    public Manager() {
        setRole("manager");
    }

    @Override
    public String getResponsibilities() {
        return "Oversees staff and workshop operations";
    }
}

