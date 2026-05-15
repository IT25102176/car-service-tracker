package com._9.AutoServe.service;

import com._9.AutoServe.model.ServiceRecord;
import com._9.AutoServe.repository.ServiceRecordRepository;
import com.se1020.carservice.model.ServiceRecord;
import com.se1020.carservice.repository.InvoiceRepository;
import com.se1020.carservice.repository.ServiceRecordRepository;
import com.se1020.carservice.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class ServiceRecordService {
    private final ServiceRecordRepository repository;
    private final VehicleRepository vehicleRepository;
    private final InvoiceRepository invoiceRepository;

    public ServiceRecordService(
            ServiceRecordRepository repository,
            VehicleRepository vehicleRepository,
            InvoiceRepository invoiceRepository
    ) {
        this.repository = repository;
        this.vehicleRepository = vehicleRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public List<ServiceRecord> getAll() {
        return repository.findAll();
    }

    public ServiceRecord getById(String id) {
        return repository.findById(id).orElseThrow(() -> new NoSuchElementException("Service record not found: " + id));
    }

    public ServiceRecord create(ServiceRecord serviceRecord) {
        if (serviceRecord.getId() == null || serviceRecord.getId().isBlank()) {
            serviceRecord.setId(UUID.randomUUID().toString());
        }
        syncVehicleFields(serviceRecord);
        if (serviceRecord.getCreatedAt() == null) {
            serviceRecord.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(serviceRecord);
    }

    public ServiceRecord update(String id, ServiceRecord serviceRecord) {
        getById(id);
        serviceRecord.setId(id);
        syncVehicleFields(serviceRecord);
        if (serviceRecord.getCreatedAt() == null) {
            serviceRecord.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(serviceRecord);
    }

    public void delete(String id) {
        boolean usedByInvoice = invoiceRepository.findAll().stream()
                .anyMatch(invoice -> id.equals(invoice.getServiceId()));
        if (usedByInvoice) {
            throw new IllegalArgumentException("Cannot delete service record linked to invoices");
        }

        if (!repository.deleteById(id)) {
            throw new NoSuchElementException("Service record not found: " + id);
        }
    }

    private void syncVehicleFields(ServiceRecord serviceRecord) {
        if (serviceRecord.getVehicleId() == null || serviceRecord.getVehicleId().isBlank()) {
            throw new IllegalArgumentException("vehicleId is required");
        }
        var vehicle = vehicleRepository.findById(serviceRecord.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + serviceRecord.getVehicleId()));

        serviceRecord.setVehicleName(
                vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel() + " (" + vehicle.getLicensePlate() + ")"
        );
    }
}
