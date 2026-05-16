package com._9.AutoServe.Controller;


import com._9.AutoServe.model.MaintenanceReminder;
import com._9.AutoServe.service.MaintenanceReminderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceReminderController {
    private final MaintenanceReminderService maintenanceReminderService;

    public MaintenanceReminderController(MaintenanceReminderService maintenanceReminderService) {
        this.maintenanceReminderService = maintenanceReminderService;
    }

    @GetMapping
    public List<MaintenanceReminder> getAll() {
        return maintenanceReminderService.getAll();
    }

    @GetMapping("/{id}")
    public MaintenanceReminder getById(@PathVariable String id) {
        return maintenanceReminderService.getById(id);
    }

    @PostMapping
    public MaintenanceReminder create(@RequestBody MaintenanceReminder maintenanceReminder) {
        return maintenanceReminderService.create(maintenanceReminder);
    }

    @PutMapping("/{id}")
    public MaintenanceReminder update(@PathVariable String id, @RequestBody MaintenanceReminder maintenanceReminder) {
        return maintenanceReminderService.update(id, maintenanceReminder);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        maintenanceReminderService.delete(id);
    }
}
