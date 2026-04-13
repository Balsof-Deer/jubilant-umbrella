package com.example.backend.CONTROLLER;

import com.example.backend.MODEL.Requirements;
import com.example.backend.MODEL.TaskList;
import com.example.backend.MODEL.UserQ;
import com.example.backend.REPOSITORIES.RequirementsRepository;
import com.example.backend.REPOSITORIES.TaskListRepository;
import com.example.backend.REPOSITORIES.UserQRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/userq")
@CrossOrigin(origins = "*")
public class UserQController {

    @Autowired
    private UserQRepository userQRepository;

    @Autowired
    private TaskListRepository taskListRepository;

    @Autowired
    private RequirementsRepository requirementsRepository;

    @GetMapping("/all")
    public List<UserQ> getAllUsers() {
        return userQRepository.findAll();
    }


    @PostMapping("/queue")
    public UserQ addToQueue(@RequestParam Integer taskID) {

        Random random = new Random();
        int userID;

        do {
            userID = 10000 + random.nextInt(90000);
        } while(userQRepository.existsById(userID));

        TaskList task = taskListRepository.findById(taskID)
                .orElseThrow();

        UserQ user = new UserQ();
        user.setUserID(userID);
        user.setTaskID(taskID);
        user.setTaskName(task.getTaskName());
        user.setCreatedAt(LocalTime.now());

        // Assign a position (placeholder: queue size + 1)
        long count = userQRepository.count();
        user.setPosition((int) count + 1);

        return userQRepository.save(user);
    }

    @DeleteMapping({"/remove/{userID}"})
    @Transactional
    public ResponseEntity<Map<String, Object>> removeUser(@PathVariable Integer userID) {
        return userQRepository.findById(userID)
                .map(user -> {
                    userQRepository.delete(user);
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "User removed from queue successfully");
                    response.put("userID", userID);
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("error", "User not found in queue with ID: " + userID);
                    return ResponseEntity.status(404).body(response);
                });
    }

    @GetMapping("/{userID}")
    public UserQ getUser(@PathVariable Integer userID) {
        return userQRepository.findById(userID).orElseThrow();
    }

    @GetMapping("/count")
    public long queueSize(){
        return userQRepository.count();
    }

    @GetMapping("/position/{userID}")
    public ResponseEntity<Map<String, Object>> getPositionInDepartment(@PathVariable Integer userID) {
        return userQRepository.findById(userID)
                .map(user -> {
                    TaskList task = taskListRepository.findById(user.getTaskID())
                            .orElseThrow(() -> new RuntimeException("Task not found for ID: " + user.getTaskID()));

                    Integer departmentID = task.getDepartment().getDepartmentID();
                    int position = userQRepository.countUsersAhead(departmentID, user.getCreatedAt());

                    Map<String, Object> response = new HashMap<>();
                    response.put("userID", userID);
                    response.put("departmentID", departmentID);
                    response.put("position", position);
                    response.put("taskName", user.getTaskName());
                    response.put("createdAt", user.getCreatedAt());

                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("error", "User not found in queue with ID: " + userID);
                    return ResponseEntity.status(404).body(response);
                });
    }

    @GetMapping("/department/{departmentID}")
    public List<UserQ> getUsersByDepartment(@PathVariable Integer departmentID) {
        return userQRepository.findByDepartmentID(departmentID);
    }


}
