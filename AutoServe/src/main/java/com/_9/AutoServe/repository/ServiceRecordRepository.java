package com._9.AutoServe.repository;

import com._9.AutoServe.model.ServiceRecord;
import com._9.AutoServe.model.ServiceRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import tools.jackson.databind.json.JsonMapper;

@Repository
public class ServiceRecordRepository extends JsonFileRepository<ServiceRecord> {
    public ServiceRecordRepository(JsonMapper objectMapper, @Value("${app.storage.dir:data}") String storageDir) {
        super(objectMapper, storageDir, "services.json", ServiceRecord.class, ServiceRecord::getId);
    }
}
