package com.example.backend.CONTROLLER;

import com.example.backend.MODEL.Requirements;
import com.example.backend.MODEL.RequirementsKey;
import com.example.backend.REPOSITORIES.RequirementsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requirements")
@CrossOrigin(origins = "*")
public class RequirementController {

    @Autowired
    RequirementsRepository requirementsRepository;

    @GetMapping("/task/{taskID}")
    public List<Requirements> getRequirementsByTask(@PathVariable Integer taskID) {
        return requirementsRepository.findById_TaskID(taskID);
    }

    @PostMapping("/add")
    public Requirements addRequirement(@RequestBody Requirements req) {
        return requirementsRepository.save(req);
    }

    @DeleteMapping("/delete/{taskID}/{document}")
    public void deleteRequirement(@PathVariable Integer taskID, @PathVariable String document) {
        RequirementsKey key = new RequirementsKey();
        key.setTaskID(taskID);
        key.setDocument(document);
        if (requirementsRepository.existsById(key)) {
            requirementsRepository.deleteById(key);
        }
    }

}
