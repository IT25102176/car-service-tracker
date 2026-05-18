package com._9.AutoServe.Controller;

import com._9.AutoServe.model.Appointment;
import com._9.AutoServe.service.AppointmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
    Grabs the request and hand it over to the service layer
        [Controller ==> Service]
*/

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

    // Connecting to the Service Layer === Constructor
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping     // Get All Appointments [READ all] === Method
    public List<Appointment> getAll() {
        return appointmentService.getAll();
    }

    @GetMapping("/{id}")    // Get a Single Appointment by ID [READ one] === Method
    public Appointment getById(@PathVariable String id) {
        return appointmentService.getById(id);
    }

    @PostMapping    // Book a New Appointment [CREATE] === Method
    public Appointment create(@RequestBody Appointment appointment) {
        return appointmentService.create(appointment);
    }

    @PutMapping("/{id}")    // Edit an Appointment [UPDATE] === Method
    public Appointment update(@PathVariable String id, @RequestBody Appointment appointment) {
        return appointmentService.update(id, appointment);
    }

    @DeleteMapping("/{id}")     // Cancel/Remove an Appointment [DELETE] === Method
    public void delete(@PathVariable String id) {
        appointmentService.delete(id);
    }
}

