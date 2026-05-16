package com._9.AutoServe.repository;

import com._9.AutoServe.model.Invoice;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import tools.jackson.databind.json.JsonMapper;

@Repository
public class InvoiceRepository extends JsonFileRepository<Invoice> {
    public InvoiceRepository(JsonMapper objectMapper, @Value("${app.storage.dir:data}") String storageDir) {
        super(objectMapper, storageDir, "invoices.json", Invoice.class, Invoice::getId);
    }
}
