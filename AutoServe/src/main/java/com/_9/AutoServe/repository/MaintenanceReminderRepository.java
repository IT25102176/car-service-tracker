package com._9.AutoServe.repository;


import com._9.AutoServe.model.MaintenanceReminder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import tools.jackson.databind.json.JsonMapper;

@Repository
public class MaintenanceReminderRepository extends JsonFileRepository<MaintenanceReminder> {
    public MaintenanceReminderRepository(JsonMapper objectMapper, @Value("${app.storage.dir:data}") String storageDir) {
        super(objectMapper, storageDir, "maintenance.json", MaintenanceReminder.class, MaintenanceReminder::getId);
    }
}
