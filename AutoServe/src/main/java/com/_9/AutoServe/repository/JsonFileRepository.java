package com._9.AutoServe.repository;

import tools.jackson.databind.JavaType;
import tools.jackson.databind.json.JsonMapper;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.function.Function;
import java.util.List;
import java.util.Optional;

public class JsonFileRepository<T> {
    private final JsonMapper objectMapper;
    private final Path filePath;
    private final JavaType listType;
    private final Function<T, String> idGetter;
    private final Object lock = new Object();

    public JsonFileRepository(
            JsonMapper objectMapper,
            @Value("${app.storage.dir:data}") String storageDir,
            String fileName,
            Class<T> clazz,
            Function<T, String> idGetter
    ) {
        this.objectMapper = objectMapper;
        this.filePath = Path.of(storageDir, fileName);
        this.listType = objectMapper.getTypeFactory().constructCollectionType(List.class, clazz);
        this.idGetter = idGetter;
        createFileIfMissing();
    }

    public List<T> findAll() {
        synchronized (lock) {
            return new ArrayList<>(readAllInternal());
        }
    }

    public Optional<T> findById(String id) {
        synchronized (lock) {
            return readAllInternal().stream().filter(item -> idGetter.apply(item).equals(id)).findFirst();
        }
    }

    public T save(T entity) {
        synchronized (lock) {
            List<T> items = readAllInternal();
            int existingIndex = -1;
            for (int i = 0; i < items.size(); i++) {
                if (idGetter.apply(items.get(i)).equals(idGetter.apply(entity))) {
                    existingIndex = i;
                    break;
                }
            }
            if (existingIndex >= 0) {
                items.set(existingIndex, entity);
            } else {
                items.add(entity);
            }
            writeAllInternal(items);
            return entity;
        }
    }

    public boolean deleteById(String id) {
        synchronized (lock) {
            List<T> items = readAllInternal();
            boolean removed = items.removeIf(item -> idGetter.apply(item).equals(id));
            if (removed) {
                writeAllInternal(items);
            }
            return removed;
        }
    }

    private void createFileIfMissing() {
        try {
            Files.createDirectories(filePath.getParent());
            if (Files.notExists(filePath)) {
                Files.writeString(filePath, "[]", StandardOpenOption.CREATE_NEW);
            }
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to initialize storage file: " + filePath, ex);
        }
    }

    private List<T> readAllInternal() {
        try {
            String content = Files.readString(filePath);
            if (content == null || content.isBlank()) {
                return new ArrayList<>();
            }
            return objectMapper.readValue(content, listType);
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to read file: " + filePath, ex);
        }
    }

    private void writeAllInternal(List<T> entities) {
        try {
            String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(entities);
            Files.writeString(
                    filePath,
                    json,
                    StandardOpenOption.TRUNCATE_EXISTING,
                    StandardOpenOption.CREATE
            );
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to write file: " + filePath, ex);
        }
    }
}
