package com._9.AutoServe.repository;

import com._9.AutoServe.model.Appointment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import tools.jackson.databind.json.JsonMapper;

/*
     The Database Whisperer:
     - writes the SQL queries bts to save, update, delete or fetch appointments from the database tables
*/

@Repository
public class AppointmentRepository extends JsonFileRepository<Appointment> {        // "Inheritance"
    public AppointmentRepository(JsonMapper objectMapper, @Value("${app.storage.dir:data}") String storageDir) {
        super(objectMapper, storageDir, "appointments.json", Appointment.class, Appointment::getId);
    }
}
// Constructor: runs at startup, spring Boot automatically hands it the JsonMapper translator.
