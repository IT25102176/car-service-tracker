package com._9.AutoServe.repository;

import com._9.AutoServe.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import tools.jackson.databind.json.JsonMapper;

@Repository
public class UserRepository extends JsonFileRepository<User> {
    public UserRepository(JsonMapper objectMapper, @Value("${app.storage.dir:data}") String storageDir) {
        super(objectMapper, storageDir, "users.json", User.class, User::getId);
    }
}
