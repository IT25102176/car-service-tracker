package com._9.AutoServe.service;

import com.se1020.carservice.model.Invoice;
import com.se1020.carservice.repository.InvoiceRepository;
import com.se1020.carservice.repository.ServiceRecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service

public class InvoiceService {
    private final InvoiceRepository repository;
    private final ServiceRecordRepository serviceRecordRepository;

    public InvoiceService(InvoiceRepository repository, ServiceRecordRepository serviceRecordRepository) {
        this.repository = repository;
        this.serviceRecordRepository = serviceRecordRepository;
    }

    public List<Invoice> getAll() {
        return repository.findAll();
    }

    public Invoice getById(String id) {
        return repository.findById(id).orElseThrow(() -> new NoSuchElementException("Invoice not found: " + id));
    }

    public Invoice create(Invoice invoice) {
        if (invoice.getId() == null || invoice.getId().isBlank()) {
            invoice.setId(UUID.randomUUID().toString());
        }
        validateAndSyncServiceReference(invoice);
        if (invoice.getCreatedAt() == null) {
            invoice.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(invoice);
    }

    public Invoice update(String id, Invoice invoice) {
        getById(id);
        invoice.setId(id);
        validateAndSyncServiceReference(invoice);
        if (invoice.getCreatedAt() == null) {
            invoice.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(invoice);
    }

    public void delete(String id) {
        if (!repository.deleteById(id)) {
            throw new NoSuchElementException("Invoice not found: " + id);
        }
    }

    private void validateAndSyncServiceReference(Invoice invoice) {
        if (invoice.getServiceId() == null || invoice.getServiceId().isBlank()) {
            throw new IllegalArgumentException("serviceId is required");
        }
        var serviceRecord = serviceRecordRepository.findById(invoice.getServiceId())
                .orElseThrow(() -> new IllegalArgumentException("Service record not found: " + invoice.getServiceId()));

        invoice.setVehicleName(serviceRecord.getVehicleName());
        if (invoice.getCustomerName() == null || invoice.getCustomerName().isBlank()) {
            invoice.setCustomerName("Customer");
        }
        double amount = invoice.getAmount() == null ? 0.0 : invoice.getAmount();
        double tax = invoice.getTax() == null ? 0.0 : invoice.getTax();
        invoice.setTotal(amount + tax);
    }
}
