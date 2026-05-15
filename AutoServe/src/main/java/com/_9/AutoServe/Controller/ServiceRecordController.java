package com._9.AutoServe.Controller;

import com._9.AutoServe.model.ServiceRecord;
import com._9.AutoServe.service.ServiceRecordService;
import com.se1020.carservice.model.ServiceRecord;
import com.se1020.carservice.service.ServiceRecordService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceRecordController {
    private final ServiceRecordService serviceRecordService;

    public ServiceRecordController(ServiceRecordService serviceRecordService) {
        this.serviceRecordService = serviceRecordService;
    }

    @GetMapping
    public List<ServiceRecord> getAll() {
        return serviceRecordService.getAll();
    }

    @GetMapping("/{id}")
    public ServiceRecord getById(@PathVariable String id) {
        return serviceRecordService.getById(id);
    }

    @PostMapping
    public ServiceRecord create(@RequestBody ServiceRecord serviceRecord) {
        return serviceRecordService.create(serviceRecord);
    }

    @PutMapping("/{id}")
    public ServiceRecord update(@PathVariable String id, @RequestBody ServiceRecord serviceRecord) {
        return serviceRecordService.update(id, serviceRecord);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        serviceRecordService.delete(id);
    }
}
