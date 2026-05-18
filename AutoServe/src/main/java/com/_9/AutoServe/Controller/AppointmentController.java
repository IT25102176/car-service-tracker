package com._9.AutoServe.Controller;

import com._9.AutoServe.model.Appointment;
import com._9.AutoServe.service.AppointmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

    //Connecting to the Service Layer
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping     //Operation 1: Get All Appointments [READ all]
    public List<Appointment> getAll() {
        return appointmentService.getAll();
    }

    @GetMapping("/{id}")    //Operation 2: Get a Single Appointment by ID [READ one]
    public Appointment getById(@PathVariable String id) {
        return appointmentService.getById(id);
    }

    @PostMapping    //Operation 3: Book a New Appointment [CREATE]
    public Appointment create(@RequestBody Appointment appointment) {
        return appointmentService.create(appointment);
    }

    @PutMapping("/{id}")    //Operation 4: Edit an Appointment [UPDATE]
    public Appointment update(@PathVariable String id, @RequestBody Appointment appointment) {
        return appointmentService.update(id, appointment);
    }

    @DeleteMapping("/{id}")     //Operation 5: Cancel/Remove an Appointment [DELETE]
    public void delete(@PathVariable String id) {
        appointmentService.delete(id);
    }
}

