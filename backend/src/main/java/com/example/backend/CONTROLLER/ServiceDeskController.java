package com.example.backend.CONTROLLER;

import com.example.backend.MODEL.Requirements;
import com.example.backend.MODEL.ServiceDesk;
import com.example.backend.MODEL.ServiceDeskKey;
import com.example.backend.REPOSITORIES.RequirementsRepository;
import com.example.backend.REPOSITORIES.ServiceDeskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/serviceDesk")
@CrossOrigin(origins = "*")
public class ServiceDeskController {

    @Autowired
    private ServiceDeskRepository serviceDeskRepository;

    @Autowired
    private RequirementsRepository requirementsRepository;

    @GetMapping("/all")
    public List<ServiceDesk> getAllEntries() {
        return serviceDeskRepository.findAll();
    }

    @GetMapping("/position/{userID}")
    public ResponseEntity<?> getPosition(@PathVariable Integer userID) {
        Optional<ServiceDesk> entry = serviceDeskRepository.findByUserID(userID);

        if (entry.isPresent()) {
            ServiceDesk deskEntry = entry.get();
            List<Requirements> reqs = requirementsRepository.findById_TaskID(deskEntry.getTaskID());
            List<String> documents = reqs.stream()
                    .map(r -> r.getId().getDocument())
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("userID", deskEntry.getUserID());
            response.put("taskID", deskEntry.getTaskID());
            response.put("taskName", deskEntry.getTaskName());
            response.put("position", deskEntry.getPosition());
            response.put("documents", documents);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.ok(java.util.Collections.singletonMap("error", "Queue details not found for User ID: " + userID));
        }
    }

    @DeleteMapping("/delete/{userID}/{taskID}")
    public void deleteEntry(@PathVariable Integer userID, @PathVariable Integer taskID) {
        ServiceDeskKey key = new ServiceDeskKey();
        key.setUserID(userID);
        key.setTaskID(taskID);
        if (serviceDeskRepository.existsById(key)) {
            serviceDeskRepository.deleteById(key);
        }
    }
}
