package com._9.AutoServe.Controller;

import com._9.AutoServe.model.Vehicle;
import com._9.AutoServe.service.VehicleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public List<Vehicle> getAll() {
        return vehicleService.getAll();
    }

    @GetMapping("/{id}")
    public Vehicle getById(@PathVariable String id) {
        return vehicleService.getById(id);
    }

    @PostMapping
    public Vehicle create(@RequestBody Vehicle vehicle) {
        return vehicleService.create(vehicle);
    }

    @PutMapping("/{id}")
    public Vehicle update(@PathVariable String id, @RequestBody Vehicle vehicle) {
        return vehicleService.update(id, vehicle);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        vehicleService.delete(id);
    }
}
